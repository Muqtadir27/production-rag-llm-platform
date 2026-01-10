import logging
import sys
from pathlib import Path

# Ensure project root on sys.path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from backend.app.services.rag_pipeline import RAGPipeline

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def main():
    logger.info('='*60)
    logger.info('Building vector index from documents...')
    logger.info('='*60)
    
    try:
        rag = RAGPipeline(documents_dir='data/documents', index_path='data/vector_index')
        logger.info('RAG pipeline initialized')
        
        logger.info('Loading and processing documents...')
        success = rag.build_index()
        
        if success:
            stats = rag.get_statistics()
            logger.info('='*60)
            logger.info('Index built successfully!')
            logger.info(f"Total documents indexed: {stats['vector_store']['total_documents']}")
            logger.info(f"Embedding model: {stats['embedding_model']}")
            logger.info('='*60)
            sys.exit(0)
        else:
            logger.error('='*60)
            logger.error('Index build failed - no documents found or processing error')
            logger.error('Please ensure documents are in: data/documents/')
            logger.error('='*60)
            sys.exit(1)
    except Exception as e:
        logger.error('='*60)
        logger.error(f'Fatal error building index: {e}', exc_info=True)
        logger.error('='*60)
        sys.exit(1)


if __name__ == '__main__':
    main()
