"""
Text Splitter Service - FIXED
Simple, effective chunking without fragments
"""

import re
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class TextSplitter:
    """Split documents into meaningful chunks WITHOUT creating fragments."""
    
    def __init__(self, chunk_size: int = 800, chunk_overlap: int = 150):
        """
        Initialize TextSplitter.
        
        Args:
            chunk_size: Target characters per chunk (1000 = ~150 words)
            chunk_overlap: Overlap between chunks (200 = ~30 words)
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
    
    def split_documents(self, documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Split multiple documents into chunks.
        
        Args:
            documents: List of document dictionaries
            
        Returns:
            List of chunks with metadata
        """
        all_chunks = []
        
        for doc in documents:
            chunks = self.split_text(
                text=doc['content'],
                metadata={
                    'source': doc['filename'],
                    'source_path': doc['path'],
                    'document_type': doc['type']
                }
            )
            all_chunks.extend(chunks)
        
        logger.info(f"Split {len(documents)} documents into {len(all_chunks)} chunks")
        return all_chunks
    
    def split_text(self, text: str, metadata: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Split text into meaningful chunks - SIMPLE METHOD.
        
        Args:
            text: Text content to split
            metadata: Optional metadata to attach to chunks
            
        Returns:
            List of chunks with metadata
        """
        metadata = metadata or {}
        text = self._clean_text(text)
        chunks = self._simple_chunk(text)
        
        chunk_dicts = []
        seen_content = set()  # Track duplicates to avoid repetition
        
        for i, chunk in enumerate(chunks):
            stripped = chunk.strip()
            # Ensure chunks are meaningful and not duplicates
            if stripped and len(stripped) > 50:
                # Create a hash to check for near-duplicates
                chunk_hash = hash(stripped.lower()[:100])  # Hash first 100 chars
                if chunk_hash not in seen_content:
                    seen_content.add(chunk_hash)
                    chunk_dicts.append({
                        'content': stripped,
                        'metadata': {
                            **metadata,
                            'chunk_index': i,
                            'chunk_size': len(stripped)
                        }
                    })
        
        logger.info(f"Created {len(chunk_dicts)} unique chunks from {len(chunks)} raw chunks")
        return chunk_dicts
    
    @staticmethod
    def _clean_text(text: str) -> str:
        """Clean text - remove control chars, normalize whitespace."""
        text = ''.join(ch for ch in text if ch.isprintable() or ch in '\n\t')
        # Remove multiple spaces
        text = re.sub(r' +', ' ', text)
        # Remove multiple newlines
        text = re.sub(r'\n\n+', '\n\n', text)
        return text.strip()
    
    def _simple_chunk(self, text: str) -> List[str]:
        """
        Simple chunking: split by paragraphs, then by size.
        NEVER creates tiny fragments.
        """
        if not text:
            return []
        
        chunks = []
        
        # Split by double newlines (paragraphs)
        paragraphs = text.split('\n\n')
        current = ""
        
        for para in paragraphs:
            if not para.strip():
                continue
            
            # Try to add paragraph to current chunk
            combined = current + '\n\n' + para if current else para
            
            if len(combined) <= self.chunk_size:
                current = combined
            else:
                # Current full, save it
                if current:
                    chunks.append(current)
                
                # If para too big, split by sentences
                if len(para) > self.chunk_size:
                    para_chunks = self._split_by_sentence(para)
                    chunks.extend(para_chunks)
                else:
                    current = para
        
        if current:
            chunks.append(current)
        
        return chunks
    
    def _split_by_sentence(self, text: str) -> List[str]:
        """
        Split by sentences without creating fragments.
        """
        sentences = re.split(r'(?<=[.!?])\s+', text)
        chunks = []
        current = ""
        
        for sentence in sentences:
            if not sentence.strip():
                continue
            
            combined = current + " " + sentence if current else sentence
            
            if len(combined) <= self.chunk_size:
                current = combined
            else:
                if current:
                    chunks.append(current)
                current = sentence
        
        if not text:
            return chunks
        if current:
            chunks.append(current)
        
        return chunks
    
    def _split_by_size(self, text: str) -> List[str]:
        """
        Split a large text by character size with overlap to preserve all details.
        Uses aggressive overlapping to ensure no information is lost.
        """
        chunks = []
        text = text.strip()
        if not text:
            return chunks
        
        start = 0
        safety_counter = 0
        max_iterations = 20000  # Increased to handle larger documents
        
        while start < len(text) and safety_counter < max_iterations:
            safety_counter += 1
            end = min(start + self.chunk_size, len(text))
            
            # Try to break at sentence boundary for better semantics
            if end < len(text):
                # Look for sentence endings
                for punct in ['. ', '? ', '! ', '\n']:
                    last_punct = text.rfind(punct, start, end)
                    if last_punct > start + self.chunk_size * 0.6:

                        end = last_punct + len(punct)
