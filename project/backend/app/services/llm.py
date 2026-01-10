"""
LLM Service
Manages large language model for generating responses
Uses HuggingFace Transformers with a local FLAN-T5 model
"""

import logging
from typing import List
import torch

try:
    from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
except ImportError:
    AutoTokenizer = None
    AutoModelForSeq2SeqLM = None
    pipeline = None

logger = logging.getLogger(__name__)


class LLMService:
    """Local LLM service using HuggingFace Transformers."""
    
    def __init__(self, model_name: str = "google/flan-t5-base", use_gpu: bool = True):
        """
        Initialize LLMService.
        
        Args:
            model_name: Name of the HuggingFace model to use
                       - "google/flan-t5-base" (default): Balanced, ~3GB
                       - "google/flan-t5-small": Lighter, ~1GB
                       - "google/flan-t5-large": More powerful, ~7GB
            use_gpu: Whether to use GPU if available
        """
        if pipeline is None:
            raise ImportError(
                "transformers is required. Install with: "
                "pip install transformers torch"
            )
        
        try:
            # Check for GPU
            device = 0 if use_gpu and torch.cuda.is_available() else -1
            device_name = "GPU" if device == 0 else "CPU"
            logger.info(f"Using {device_name} for inference")
            
            # Initialize pipeline
            logger.info(f"Loading model: {model_name}")
            self.pipeline = pipeline(
                "text2text-generation",
                model=model_name,
                device=device,
                torch_dtype=torch.float16 if device == 0 else torch.float32
            )
            self.model_name = model_name
            logger.info(f"Model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading model {model_name}: {e}")
            raise
    
    def generate(
        self,
        prompt: str,
        max_length: int = 512,
        temperature: float = 0.0,
        top_p: float = 0.9
    ) -> str:
        """
        Generate response using the LLM with deterministic settings.
        
        Args:
            prompt: Input prompt/question
            max_length: Maximum length of generated response
            temperature: Controls randomness (0 for deterministic)
            top_p: Nucleus sampling parameter (ignored when do_sample=False)
            
        Returns:
            Generated text response
        """
        try:
            outputs = self.pipeline(
                prompt,
                max_length=max_length,
                temperature=temperature,
                do_sample=False,
                num_beams=4
            )
            
            return outputs[0]['generated_text']
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            raise
    
    def generate_batch(self, prompts: List[str], max_length: int = 512) -> List[str]:
        """
        Generate responses for multiple prompts.
        
        Args:
            prompts: List of prompts
            max_length: Maximum length of generated responses
            
        Returns:
            List of generated responses
        """
        try:
            results = []
            for prompt in prompts:
                response = self.generate(prompt, max_length=max_length)
                results.append(response)
            return results
        except Exception as e:
            logger.error(f"Error in batch generation: {e}")
            raise
