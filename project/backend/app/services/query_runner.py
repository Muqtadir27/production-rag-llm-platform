import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from backend.app.services.rag_pipeline import RAGPipeline

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def main():
    logger.info('Query runner started')
    rag = RAGPipeline(documents_dir='data/documents', index_path='data/vector_index')
    result = rag.query('What is machine learning?', top_k=3)
    logger.info(f"Status: {result['status']}")
    logger.info(f"Answer:\n{result['answer']}")
    if result['retrieved_documents']:
        logger.info('Retrieved docs:')
        for i, doc in enumerate(result['retrieved_documents'], 1):
            logger.info(f"{i}. Source: {doc['metadata'].get('source','unknown')} | similarity: {doc.get('similarity')}")


if __name__ == '__main__':
    main()
