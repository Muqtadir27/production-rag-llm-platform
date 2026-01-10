"""
RAG Pipeline Test Script
Demonstrates the complete RAG pipeline in action
"""

import logging
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from backend.app.services.rag_pipeline import RAGPipeline

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def main():
    """Main test function."""
    
    # Initialize RAG Pipeline
    logger.info("=" * 80)
    logger.info("NEUROCORE RAG PIPELINE - TEST")
    logger.info("=" * 80)
    
    rag = RAGPipeline(
        documents_dir="data/documents",
        index_path="data/vector_index",
        embedding_model="all-MiniLM-L6-v2",
        llm_model="google/flan-t5-base"
    )
    
    # Print statistics
    logger.info("\nRAG Pipeline Configuration:")
    stats = rag.get_statistics()
    for key, value in stats.items():
        logger.info(f"  {key}: {value}")
    
    # Check if index exists and build if needed
    if stats['vector_store']['total_documents'] == 0:
        logger.info("\nNo indexed documents found.")
        logger.info("To build the index:")
        logger.info("  1. Place your documents (PDF, TXT, MD) in: data/documents/")
        logger.info("  2. Run: rag.build_index()")
        logger.info("\nDocuments will be automatically loaded, split, embedded, and indexed.")
        return
    
    logger.info(f"\n✓ Vector index loaded with {stats['vector_store']['total_documents']} documents\n")
    
    # Example queries
    example_queries = [
        "What is the main topic of the documents?",
        "Summarize the key points.",
        "What are the main features discussed?"
    ]
    
    # Process queries
    logger.info("=" * 80)
    logger.info("EXAMPLE QUERIES")
    logger.info("=" * 80)
    
    for i, query in enumerate(example_queries, 1):
        logger.info(f"\n[Query {i}] {query}")
        logger.info("-" * 80)
        
        result = rag.query(query, top_k=3)
        
        logger.info(f"Status: {result['status']}")
        logger.info(f"\nAnswer:\n{result['answer']}")
        
        if result['retrieved_documents']:
            logger.info(f"\nTop {len(result['retrieved_documents'])} Retrieved Documents:")
            for j, doc in enumerate(result['retrieved_documents'], 1):
                logger.info(f"\n  Document {j} (Source: {doc['metadata'].get('source', 'Unknown')})")
                logger.info(f"  Similarity: {doc.get('similarity', 0):.4f}")
                logger.info(f"  Content Preview: {doc['content'][:150]}...")


if __name__ == "__main__":
    main()
