"""
RAG Pipeline Service
Orchestrates the complete Retrieval-Augmented Generation pipeline
"""

import logging
from typing import Dict, Any, List, Optional
import numpy as np

from .document_loader import DocumentLoader
from .text_splitter import TextSplitter
from .embeddings import EmbeddingService
from .vector_store import VectorStore
from .llm import LLMService
from .prompt import PromptService

logger = logging.getLogger(__name__)


class RAGPipeline:
    """Complete RAG pipeline combining all components."""
    
    def __init__(
        self,
        documents_dir: str = "data/documents",
        index_path: str = "data/vector_index",
        embedding_model: str = "all-MiniLM-L6-v2",
        llm_model: str = "google/flan-t5-base"
    ):
        """
        Initialize RAG Pipeline.
        
        Args:
            documents_dir: Directory containing documents
            index_path: Path for vector index
            embedding_model: Embedding model name
            llm_model: LLM model name
        """
        self.documents_dir = documents_dir
        self.index_path = index_path
        
        # Initialize components
        logger.info("Initializing RAG Pipeline components...")
        self.document_loader = DocumentLoader(documents_dir)
        self.text_splitter = TextSplitter(chunk_size=800, chunk_overlap=150)
        self.embedding_service = EmbeddingService(embedding_model)
        self.vector_store = VectorStore(
            embedding_dim=self.embedding_service.embedding_dim,
            index_path=index_path
        )
        self.llm_service = LLMService(llm_model)
        self.prompt_service = PromptService()
        
        # Load existing vector store if available
        if not self.vector_store.load():
            logger.info("No existing or valid vector store found. Attempting to build index automatically...")
            try:
                built = self.build_index()
                if built:
                    # try loading again
                    if self.vector_store.load():
                        logger.info("Vector store built and loaded successfully.")
                    else:
                        logger.warning("Vector store built but failed to load after build.")
                else:
                    logger.warning("Automatic index build did not produce any index.")
            except Exception as e:
                logger.error(f"Automatic index build failed: {e}")
    
    def build_index(self):
        """Build the vector index from documents in the documents directory."""
        logger.info("="*60)
        logger.info("Building vector index...")
        logger.info("="*60)
        
        # Clear existing index to rebuild from scratch
        self.vector_store.index.reset()
        self.vector_store.documents = []
        
        # Load documents
        documents = self.document_loader.load_all_documents()
        if not documents:
            logger.warning("No documents found!")
            return False
        
        logger.info(f"Loaded {len(documents)} document(s)")
        
        # Process each document thoroughly
        all_chunks = []
        for doc in documents:
            filename = doc.get('filename', 'unknown')
            logger.info(f"Processing document: {filename}")
            doc_chunks = self.text_splitter.split_documents([doc])
            logger.info(f"  -> Split into {len(doc_chunks)} chunks")
            all_chunks.extend(doc_chunks)
        
        logger.info(f"Total chunks created: {len(all_chunks)}")
        
        if not all_chunks:
            logger.warning("No valid chunks created from documents!")
            return False
        
        # Generate embeddings in batches for better performance
        logger.info("Generating embeddings...")
        chunk_contents = [chunk['content'] for chunk in all_chunks]
        
        try:
            embeddings = self.embedding_service.embed_chunks(chunk_contents)
            logger.info(f"Generated {len(embeddings)} embeddings")
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}", exc_info=True)
            return False
        
        # Add to vector store
        try:
            self.vector_store.add_embeddings(embeddings, all_chunks)
            logger.info(f"Added {len(all_chunks)} chunks to vector store")
        except Exception as e:
            logger.error(f"Error adding to vector store: {e}", exc_info=True)
            return False
        
        # Save index
        try:
            self.vector_store.save()
            logger.info("Vector index saved successfully")
        except Exception as e:
            logger.error(f"Error saving index: {e}", exc_info=True)
            return False
        
        logger.info("="*60)
        logger.info("Vector index built and saved successfully!")
        logger.info(f"Index contains {len(all_chunks)} chunks from {len(documents)} document(s)")
        logger.info("="*60)
        return True
    
    def query(self, question: str, top_k: int = 3) -> Dict[str, Any]:
        """
        Answer a question using the RAG pipeline.
        
        Args:
            question: User's question
            top_k: Number of documents to retrieve
            
        Returns:
            Dictionary with question, answer, and retrieved documents
        """
        logger.info(f"Processing query: {question}")
        
        try:
            # Validate input
            if not question or not question.strip():
                return {
                    'question': question,
                    'answer': 'Please provide a valid question.',
                    'retrieved_documents': [],
                    'status': 'error'
                }
            
            question = question.strip()
            
            # Check if vector store has documents
            if len(self.vector_store.documents) == 0:
                logger.warning("Vector store is empty, attempting to load...")
                if not self.vector_store.load():
                    logger.error("Failed to load vector store")
                    return {
                        'question': question,
                        'answer': "No documents are currently indexed. Please upload and index documents first.",
                        'retrieved_documents': [],
                        'status': 'no_documents'
                    }
            
            # Embed query
            try:
                query_embedding = self.embedding_service.embed_text(question)
            except Exception as e:
                logger.error(f"Embedding error: {e}")
                return {
                    'question': question,
                    'answer': f"Error generating embedding for your question: {str(e)}",
                    'retrieved_documents': [],
                    'status': 'embedding_error'
                }
            
            # Retrieve relevant documents
            try:
                retrieved_docs = self.vector_store.search(query_embedding, top_k=top_k)
            except Exception as e:
                logger.error(f"Search error: {e}")
                return {
                    'question': question,
                    'answer': f"Error searching documents: {str(e)}",
                    'retrieved_documents': [],
                    'status': 'search_error'
                }
        except Exception as e:
            logger.error(f"Unexpected error in query: {e}", exc_info=True)
            return {
                'question': question,
                'answer': f"An unexpected error occurred: {str(e)}",
                'retrieved_documents': [],
                'status': 'error'
            }
        
        if not retrieved_docs:
            return {
                'question': question,
                'answer': "I don't have any relevant documents to answer this question.",
                'retrieved_documents': [],
                'status': 'no_context'
            }

        # Sanitize and deduplicate retrieved content
        seen_contents = set()
        cleaned_docs = []
        
        for d in retrieved_docs:
            content = d.get('content', '').strip() or ''
            if not content or len(content) < 20:
                continue
            
            # Skip duplicate or near-duplicate content
            content_hash = hash(content.lower()[:200])  # Hash first 200 chars
            if content_hash in seen_contents:
                continue
            seen_contents.add(content_hash)
            
            # Clean up content
            # Remove excessive whitespace but preserve structure
            lines = [line.strip() for line in content.splitlines() if line.strip() and len(line.strip()) > 3]
            if not lines:
                continue
            
            cleaned_content = '\n'.join(lines)
            # Collapse multiple spaces but preserve newlines
            cleaned_content = '\n'.join(' '.join(line.split()) for line in cleaned_content.split('\n') if line.strip())
            
            d['content'] = cleaned_content
            cleaned_docs.append(d)
        
        # Use cleaned deduplicated docs
        retrieved_docs = cleaned_docs[:top_k]  # Limit to top_k
        
        # Validate the retrieved context quality
        if not retrieved_docs or not self.prompt_service.validate_retrieved_context(retrieved_docs):
            return {
                'question': question,
                'answer': "I apologize, but I could not find relevant information in the provided documents to answer this question. Please try rephrasing your question or ensure that documents containing the relevant information have been uploaded.",
                'retrieved_documents': [],
                'status': 'insufficient_context'
            }

        # Create prompt with cleaned context
        prompt = self.prompt_service.create_rag_prompt(question, retrieved_docs)
        
        # Generate answer (with fallback if LLM fails)
        try:
            answer = self.llm_service.generate(
                prompt,
                max_length=256,  # Shorter for more focused answers
                temperature=0.1  # Very low temperature for deterministic, factual answers
            )
            
            # Post-process answer to remove repetition and hallucinations
            answer = self._clean_answer(answer, question)
            
            # If answer is too short or seems like it didn't understand, use first retrieved doc
            if len(answer.strip()) < 10 or answer.lower().startswith('question:'):
                # Fallback to summarizing first retrieved document
                first_doc = retrieved_docs[0].get('content', '')
                if len(first_doc) > 200:
                    answer = first_doc[:300] + "..."
                else:
                    answer = first_doc
            
        except Exception as e:
            logger.error(f"LLM generation failed: {e}")
            # Fallback: provide a summary of the most relevant document
            if retrieved_docs:
                first_content = retrieved_docs[0].get('content', '')
                if first_content:
                    # Provide a relevant excerpt
                    sentences = first_content.split('.')
                    answer = '. '.join(sentences[:3]) + '.' if len(sentences) >= 3 else first_content[:300]
                    if len(answer) < 50:
                        answer = first_content[:300]
                else:
                    answer = "I found relevant documents but could not generate a response. Please try rephrasing your question."
            else:
                answer = "I could not find relevant information to answer your question in the provided documents."
        
        logger.info("Query processed successfully")
        
        return {
            'question': question,
            'answer': answer,
            'retrieved_documents': retrieved_docs,
            'status': 'success'
        }
    
    @staticmethod
    def _clean_answer(answer: str, question: str) -> str:
        """
        Clean and post-process LLM answer to remove repetition and hallucinations.
        
        Args:
            answer: Raw LLM answer
            question: Original question
            
        Returns:
            Cleaned answer
        """
        if not answer:
            return answer
        
        # Remove common prefixes that might repeat
        prefixes_to_remove = [
            'answer:',
            'response:',
            'based on',
            'according to',
            'the answer is:',
            'answer is:',
        ]
        
        answer_lower = answer.lower().strip()
        for prefix in prefixes_to_remove:
            if answer_lower.startswith(prefix):
                answer = answer[len(prefix):].strip()
                if answer.startswith(':'):
                    answer = answer[1:].strip()
        
        # Remove repetition - check if same sentence repeats
        sentences = [s.strip() for s in answer.split('.') if s.strip()]
        unique_sentences = []
        seen = set()
        
        for sentence in sentences:
            # Create a hash of the sentence (lowercase, first 50 chars)
            sentence_hash = hash(sentence.lower()[:50])
            if sentence_hash not in seen:
                seen.add(sentence_hash)
                unique_sentences.append(sentence)
        
        # Rejoin sentences
        if unique_sentences:
            answer = '. '.join(unique_sentences)
            if not answer.endswith('.'):
                answer += '.'
        else:
            answer = sentences[0] if sentences else answer
        
        # Remove excessive repetition of phrases
        words = answer.split()
        if len(words) > 50:
            # Check for phrase repetition (3+ word phrases)
            for i in range(len(words) - 5):
                phrase = ' '.join(words[i:i+3])
                phrase_lower = phrase.lower()
                count = answer.lower().count(phrase_lower)
                if count > 2:  # Phrase appears more than twice
                    # Remove duplicate occurrences
                    parts = answer.split(phrase)
                    if len(parts) > 1:
                        answer = parts[0] + phrase + ' '.join(parts[1:])
        
        # Final cleanup - remove extra whitespace
        answer = ' '.join(answer.split())
        
        # Limit answer length to prevent rambling
        max_length = 500
        if len(answer) > max_length:
            # Try to cut at sentence boundary
            truncated = answer[:max_length]
            last_period = truncated.rfind('.')
            if last_period > max_length * 0.8:
                answer = truncated[:last_period + 1]
            else:
                answer = truncated + "..."
        
        return answer.strip()
    
    def batch_query(self, questions: List[str], top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Answer multiple questions.
        
        Args:
            questions: List of questions
            top_k: Number of documents to retrieve for each
            
        Returns:
            List of results
        """
        results = []
        for question in questions:
            result = self.query(question, top_k=top_k)
            results.append(result)
        return results
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get statistics about the RAG pipeline."""
        return {
            'vector_store': self.vector_store.get_stats(),
            'embedding_model': self.embedding_service.model_name,
            'llm_model': self.llm_service.model_name,
            'documents_directory': self.documents_dir,
            'index_path': self.index_path
        }
