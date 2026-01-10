"""
Vector Store Service
Manages FAISS vector database for fast semantic search
"""

import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Tuple
import numpy as np

try:
    import faiss
except ImportError:
    faiss = None

logger = logging.getLogger(__name__)


class VectorStore:
    """FAISS-based vector database for semantic search."""
    
    def __init__(self, embedding_dim: int = 384, index_path: str = "data/vector_index"):
        """
        Initialize VectorStore.
        
        Args:
            embedding_dim: Dimension of embeddings
            index_path: Path to save/load the FAISS index
        """
        if faiss is None:
            raise ImportError("faiss-cpu is required. Install with: pip install faiss-cpu")
        
        self.embedding_dim = embedding_dim
        self.index_path = Path(index_path)
        # Ensure the index directory exists (create the directory itself)
        self.index_path.mkdir(parents=True, exist_ok=True)
        
        # Create FAISS index
        self.index = faiss.IndexFlatL2(embedding_dim)  # L2 distance
        self.documents = []  # Store document metadata
        self._loaded = False
        
        logger.info(f"VectorStore initialized with dimension: {embedding_dim}")
    
    def add_embeddings(self, embeddings: List[np.ndarray], documents: List[Dict[str, Any]]):
        """
        Add embeddings and their associated documents to the store.
        
        Args:
            embeddings: List of embedding vectors
            documents: List of document dictionaries with 'content' and 'metadata'
        """
        if len(embeddings) != len(documents):
            raise ValueError("Number of embeddings must match number of documents")
        
        # Convert to numpy array and ensure float32 for FAISS
        embeddings_array = np.array(embeddings, dtype=np.float32)
        
        # Ensure correct shape
        if len(embeddings_array.shape) == 1:
            embeddings_array = embeddings_array.reshape(1, -1)
        elif len(embeddings_array.shape) == 2:
            pass  # Already correct
        else:
            raise ValueError(f"Invalid embedding shape: {embeddings_array.shape}")
        
        # Add to FAISS index
        self.index.add(embeddings_array)

        # Store documents with correct indices
        current_start = len(self.documents)
        for i, doc in enumerate(documents):
            self.documents.append({
                'index': current_start + i,
                'content': str(doc['content']),  # Ensure content is string
                'metadata': doc.get('metadata', {})
            })
        
        logger.info(f"Added {len(embeddings)} embeddings to vector store")
    
    def search(self, query_embedding: np.ndarray, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Search for most similar documents to a query.
        
        Args:
            query_embedding: Query embedding vector
            top_k: Number of top results to return
            
        Returns:
            List of documents with similarity scores
        """
        if len(self.documents) == 0:
            logger.warning("Vector store is empty")
            return []
        
        # Prepare query (reshape to 2D array for batch query)
        query = np.array([query_embedding], dtype=np.float32)
        
        # Search
        distances, indices = self.index.search(query, min(top_k, len(self.documents)))
        
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx < len(self.documents):
                doc = self.documents[idx]
                results.append({
                    'content': doc['content'],
                    'metadata': doc['metadata'],
                    'similarity': 1 / (1 + dist),  # Convert L2 distance to similarity
                    'distance': float(dist)
                })
        
        return results
    
    def save(self) -> str:
        """
        Save the vector store (index and documents) to disk.
        
        Returns:
            Path to saved index
        """
        try:
            # Save FAISS index
            index_file = self.index_path / "index.faiss"
            faiss.write_index(self.index, str(index_file))
            
            # Save document metadata
            docs_file = self.index_path / "documents.json"
            with open(docs_file, 'w') as f:
                json.dump(self.documents, f, indent=2)
            
            logger.info(f"Vector store saved to {self.index_path}")
            return str(self.index_path)
        except Exception as e:
            logger.error(f"Error saving vector store: {e}")
            raise
    
    def load(self) -> bool:
        """
        Load the vector store (index and documents) from disk.
        
        Returns:
            True if loaded successfully, False otherwise
        """
        try:
            index_file = self.index_path / "index.faiss"
            docs_file = self.index_path / "documents.json"
            
            if not index_file.exists() or not docs_file.exists():
                logger.warning(f"Vector store files not found at {self.index_path}")
                return False
            
            # Load FAISS index
            self.index = faiss.read_index(str(index_file))
            
            # Load documents
            with open(docs_file, 'r') as f:
                self.documents = json.load(f)
            
            logger.info(f"Vector store loaded from {self.index_path}")
            logger.info(f"Loaded {len(self.documents)} documents")
            self._loaded = True
            return True
        except Exception as e:
            logger.error(f"Error loading vector store: {e}")
            return False
    
    def get_stats(self) -> Dict[str, Any]:
        """Get statistics about the vector store."""
        return {
            'total_documents': len(self.documents),
            'index_size': self.index.ntotal,
            'embedding_dim': self.embedding_dim,
            'index_type': 'FlatL2'
        }
