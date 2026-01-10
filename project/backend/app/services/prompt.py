"""
Prompt Service
Handles prompt engineering for RAG system
"""

from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class PromptService:
    """Manages prompts for RAG system."""
    
    @staticmethod
    def create_rag_prompt(query: str, context_documents: List[Dict[str, Any]]) -> str:
        """
        Create a prompt that grounds the answer in retrieved documents.
        Instructs the LLM to provide explanatory answers based ONLY on the documents.
        """
        # Format context - only include actual content, remove empty or noisy chunks
        valid_docs = []
        for doc in context_documents:
            content = doc.get('content', '').strip()
            # Filter out very short or likely corrupted chunks
            if len(content) > 30 and not content.lower().startswith('response:'):
                valid_docs.append(content)
        
        if not valid_docs:
            return f"""Based on the available documents, I cannot find information to answer this question.

QUESTION: {query}

ANSWER: The information requested is not available in the provided documents."""

        # Combine valid documents
        context_text = "\n\n---\n\n".join([
            f"[Document Section {i+1}]\n{content}"
            for i, content in enumerate(valid_docs[:3])  # Limit to top 3 to avoid repetition
        ])
        
        # Truncate context if too large (FLAN-T5 has 512 token limit)
        max_context_length = 2000
        if len(context_text) > max_context_length:
            # Try to keep complete sentences
            truncated = context_text[:max_context_length]
            last_period = truncated.rfind('.')
            if last_period > max_context_length * 0.8:
                context_text = truncated[:last_period + 1]
            else:
                context_text = truncated + "..."
        
        # Improved prompt that explicitly prevents hallucinations
        prompt = f"""You are a helpful assistant that answers questions based ONLY on the provided documents. 
If the answer is not in the documents, say so clearly.

DOCUMENTS:
{context_text}

QUESTION: {query}

INSTRUCTIONS:
- Answer using ONLY information from the documents above
- If the answer is not in the documents, respond: "The information is not available in the provided documents."
- Do not repeat information multiple times
- Be concise and accurate
- Base your answer strictly on what is written in the documents

ANSWER:"""
        return prompt
    
    @staticmethod
    def create_summary_prompt(text: str) -> str:
        """Create a prompt for summarizing text."""
        return f"""Summarize the following text concisely with key points:

{text}

Summary:"""
    
    @staticmethod
    def create_explanation_prompt(concept: str, context: str) -> str:
        """Create a prompt for explaining a concept from context."""
        return f"""Based on the following context, explain what "{concept}" is in detail:

CONTEXT:
{context}

EXPLANATION:"""
    
    @staticmethod
    def create_qa_prompt(context: str, question: str) -> str:
        """Create a prompt for question answering."""
        return f"""Based on the following context, answer the question thoroughly and explain your answer.

    CONTEXT:
{context}


QUESTION: {question}
    
DETAILED ANSWER:"""
    
    @staticmethod
    def validate_retrieved_context(documents: List[Dict[str, Any]]) -> bool:
        """
        Validate that retrieved documents are relevant.
        
        Args:
            documents: Retrieved documents
            
        Returns:
            True if documents seem relevant
        """
        if not documents:
            return False

        # Count meaningful characters (letters/digits) and number of non-trivial chunks
        meaningful_chars = 0
        nontrivial_chunks = 0
        sources = set()
        for doc in documents:
            content = doc.get('content', '') or ''
            # strip whitespace and very short fragments
            stripped = content.strip()
            if len(stripped) < 20:
                continue
            # count alphanumeric chars
            alpha_num = sum(1 for c in stripped if c.isalnum())
            meaningful_chars += alpha_num
            if alpha_num >= 30:
                nontrivial_chunks += 1
            # track unique sources if available
            src = doc.get('metadata', {}).get('source') or doc.get('metadata', {}).get('source_path')
            if src:
                sources.add(src)

        # Accept if we have at least one nontrivial chunk or moderate meaningful content
        if nontrivial_chunks >= 1 or meaningful_chars >= 80:
            return True

        # otherwise insufficient
        return False
