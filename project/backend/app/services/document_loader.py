"""
Document Loader Service
Handles loading and parsing of various document formats (PDF, TXT, etc.)
"""

import os
from pathlib import Path
from typing import List, Dict, Any
import logging

try:
    from PyPDF2 import PdfReader
except ImportError:
    PdfReader = None

logger = logging.getLogger(__name__)


class DocumentLoader:
    """Load and parse documents from various formats."""
    
    def __init__(self, documents_dir: str = "data/documents"):
        """
        Initialize DocumentLoader.
        
        Args:
            documents_dir: Path to directory containing documents
        """
        self.documents_dir = Path(documents_dir)
        self.documents_dir.mkdir(parents=True, exist_ok=True)
        self.supported_formats = {'.pdf', '.txt', '.md'}
    
    def load_all_documents(self) -> List[Dict[str, Any]]:
        """
        Load all documents from the documents directory.
        
        Returns:
            List of document dictionaries with 'path', 'content', and 'type'
        """
        documents = []
        
        for file_path in self.documents_dir.rglob('*'):
            if file_path.is_file() and file_path.suffix.lower() in self.supported_formats:
                try:
                    if file_path.suffix.lower() == '.pdf':
                        content = self._load_pdf(file_path)
                    else:  # .txt or .md
                        content = self._load_text(file_path)
                    
                    if content.strip():
                        documents.append({
                            'path': str(file_path),
                            'content': content,
                            'type': file_path.suffix.lower(),
                            'filename': file_path.name
                        })
                        logger.info(f"Loaded document: {file_path.name}")
                except Exception as e:
                    logger.error(f"Error loading {file_path}: {e}")
        
        return documents
    
    def load_pdf(self, file_path: str) -> str:
        """Load PDF document."""
        return self._load_pdf(Path(file_path))
    
    def load_text(self, file_path: str) -> str:
        """Load text document."""
        return self._load_text(Path(file_path))
    
    @staticmethod
    def _load_pdf(file_path: Path) -> str:
        """
        Extract text from PDF file with improved extraction.
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            Extracted text content
        """
        if PdfReader is None:
            raise ImportError("PyPDF2 is required to load PDF files. Install it with: pip install PyPDF2")
        
        try:
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PdfReader(file)
                num_pages = len(pdf_reader.pages)
                logger.info(f"Extracting text from {num_pages} pages...")
                
                for page_num, page in enumerate(pdf_reader.pages, 1):
                    try:
                        extracted = page.extract_text()
                        if extracted:
                            # Clean up page text
                            page_text = extracted.strip()
                            # Remove common PDF artifacts
                            page_text = page_text.replace('\x00', '')  # Null bytes
                            page_text = page_text.replace('\ufeff', '')  # BOM
                            # Normalize whitespace
                            lines = [line.strip() for line in page_text.split('\n') if line.strip()]
                            page_text = '\n'.join(lines)
                            
                            if page_text:
                                text += page_text + "\n\n"
                    except Exception as e:
                        logger.warning(f"Error extracting page {page_num}: {e}")
                        continue
            
            cleaned = DocumentLoader._clean_text(text)
            logger.info(f"Extracted {len(cleaned)} characters from PDF")
            return cleaned
        except Exception as e:
            logger.error(f"Error extracting PDF text: {e}")
            raise
    
    @staticmethod
    def _load_text(file_path: Path) -> str:
        """
        Load text from text file.
        
        Args:
            file_path: Path to text file
            
        Returns:
            File content
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
                return DocumentLoader._clean_text(text)
        except Exception as e:
            logger.error(f"Error loading text file: {e}")
            raise
    
    def save_document(self, filename: str, content: str) -> str:
        """
        Save a document to the documents directory.
        
        Args:
            filename: Name of file to save
            content: Document content
            
        Returns:
            Path to saved file
        """
        file_path = self.documents_dir / filename
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        logger.info(f"Saved document: {filename}")
        return str(file_path)

    @staticmethod
    def _clean_text(text: str) -> str:
        """
        Enhanced cleaning of extracted document text.
        - Removes control characters and PDF artifacts
        - Preserves meaningful structure (paragraphs)
        - Removes noise while keeping content
        """
        if not text:
            return text

        # Remove control characters except newlines and tabs
        cleaned = ''.join(ch for ch in text if ch.isprintable() or ch in "\n\t\r")

        # Remove common PDF artifacts
        cleaned = cleaned.replace('\x00', '')  # Null bytes
        cleaned = cleaned.replace('\ufeff', '')  # BOM
        cleaned = cleaned.replace('\x0c', '\n')  # Form feed to newline
        
        # Split into lines and filter meaningful content
        lines = []
        for line in cleaned.splitlines():
            s = line.strip()
            if not s:
                continue
            
            # Skip very short isolated text that looks like noise
            if len(s) <= 2 and s.isalpha():
                continue
            
            # Skip common PDF extraction artifacts
            lower = s.lower()
            skip_patterns = [
                'page',
                'page of',
                'is a',
                'is an',
                'is the',
            ]
            
            # Only skip if line is very short AND matches a skip pattern
            if len(s.split()) <= 4:
                if any(pattern in lower for pattern in skip_patterns):
                    continue
            
            # Keep meaningful lines
            lines.append(s)

        # Join with double newlines to preserve paragraph structure
        out = '\n\n'.join(lines)
        
        # Clean up excessive whitespace within lines (but preserve paragraph breaks)
        paragraphs = []
        for para in out.split('\n\n'):
            # Collapse multiple spaces within a paragraph
            cleaned_para = ' '.join(para.split())
            if cleaned_para:
                paragraphs.append(cleaned_para)
        
        return '\n\n'.join(paragraphs)
