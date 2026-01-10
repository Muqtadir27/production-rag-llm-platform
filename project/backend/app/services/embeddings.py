"""
Embeddings Service
Converts text chunks into semantic embeddings using Sentence-Transformers
"""

import logging
from typing import List, Union, Tuple
import numpy as np

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    SentenceTransformer = None

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Generate semantic embeddings for text using Sentence-Transformers."""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize EmbeddingService.
        
        Args:
            model_name: Name of the Sentence-Transformers model to use
                       - "all-MiniLM-L6-v2" (default): Fast, lightweight (384 dims)
                       - "all-mpnet-base-v2": More powerful (768 dims)
                       - "multi-qa-MiniLM-L6-cos-v1": Optimized for QA
        """
        if SentenceTransformer is None:
            raise ImportError(
                "sentence-transformers is required. Install with: "
                "pip install sentence-transformers"
            )
        
        try:
            logger.info(f"Loading embedding model: {model_name}")
            self.model = SentenceTransformer(model_name)
            self.model_name = model_name
            self.embedding_dim = self.model.get_sentence_embedding_dimension()
            logger.info(f"Model loaded. Embedding dimension: {self.embedding_dim}")
        except Exception as e:
            logger.error(f"Error loading model {model_name}: {e}")
            raise
    
    def embed_text(self, text: Union[str, List[str]]) -> Union[np.ndarray, List[np.ndarray]]:
        """
        Generate embedding for text(s).
        
        Args:
            text: Single text string or list of text strings
            
        Returns:
            Embedding vector (numpy array) or list of vectors
        """
        try:
            if isinstance(text, str):
                embedding = self.model.encode(text, convert_to_numpy=True)
                return embedding
            else:
                embeddings = self.model.encode(text, convert_to_numpy=True, show_progress_bar=False)
                return embeddings
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise
    
    def embed_chunks(self, chunks: List[str], batch_size: int = 32) -> List[np.ndarray]:
        """
        Generate embeddings for multiple chunks efficiently.
        
        Args:
            chunks: List of text chunks
            batch_size: Number of texts to encode at once
            
        Returns:
            List of embedding vectors
        """
        try:
            logger.info(f"Generating embeddings for {len(chunks)} chunks")
            embeddings = self.model.encode(
                chunks,
                batch_size=batch_size,
                show_progress_bar=True,
                convert_to_numpy=True
            )
            logger.info("Embedding generation complete")
            return [emb for emb in embeddings]
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            raise
    
    def similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """
        Calculate cosine similarity between two embeddings.
        
        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector
            
        Returns:
            Similarity score between -1 and 1
        """
        # Normalize vectors
        norm1 = embedding1 / np.linalg.norm(embedding1)
        norm2 = embedding2 / np.linalg.norm(embedding2)
        
        # Cosine similarity
        return np.dot(norm1, norm2)
    
    def most_similar(
        self,
        query_embedding: np.ndarray,
        candidate_embeddings: List[np.ndarray],
        top_k: int = 5
    ) -> List[Tuple[int, float]]:
        """
        Find most similar embeddings to a query embedding.
        
        Args:
            query_embedding: Query embedding vector
            candidate_embeddings: List of candidate embedding vectors
            top_k: Number of top results to return
            
        Returns:
            List of (index, similarity_score) tuples, sorted by similarity (descending)
        """
        similarities = []
        
        for idx, embedding in enumerate(candidate_embeddings):
            sim = self.similarity(query_embedding, embedding)
            similarities.append((idx, sim))
        
        # Sort by similarity descending
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        return similarities[:top_k]
