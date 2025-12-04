"""Supabase integration for document storage and retrieval."""

import os
from pathlib import Path
from io import BytesIO
from typing import Optional, Tuple

from supabase import create_client


class SupabaseClient:
    """Client for interacting with Supabase storage and database."""
    
    def __init__(
        self,
        supabase_url: str = "https://iwcthscngbbygaanejib.supabase.co",
        supabase_key: str = "sb_secret_FbFaFtzc24OvZ8mDhv3Icg_-SBOIX4u",
        bucket_name: str = "documents"
    ):
        """
        Initialize Supabase client.
        
        Args:
            supabase_url: Supabase project URL
            supabase_key: Supabase Service Role Key (bypasses RLS)
            bucket_name: Storage bucket name for documents
        """
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.bucket_name = bucket_name
        self.client = create_client(supabase_url, supabase_key)
    
    def list_files(self) -> list:
        """List all files in the storage bucket."""
        try:
            response = self.client.storage.from_(self.bucket_name).list()
            return response
        except Exception as e:
            print(f"Error listing files: {e}")
            return []
    
    def download_file(self, file_path: str) -> Optional[bytes]:
        """
        Download a file from Supabase storage.
        
        Args:
            file_path: Path to file in the bucket (e.g., 'IDP_Hackathon_Roadmap.pdf')
            
        Returns:
            File content as bytes, or None if download fails
        """
        try:
            response = self.client.storage.from_(self.bucket_name).download(file_path)
            return response
        except Exception as e:
            print(f"Error downloading file {file_path}: {e}")
            return None
    
    def upload_file(self, file_path: str, file_content: bytes) -> bool:
        """
        Upload a file to Supabase storage.
        
        Args:
            file_path: Path where file should be stored in bucket
            file_content: File content as bytes
            
        Returns:
            True if successful, False otherwise
        """
        try:
            self.client.storage.from_(self.bucket_name).upload(file_path, file_content)
            return True
        except Exception as e:
            print(f"Error uploading file {file_path}: {e}")
            return False


def download_and_extract(
    file_path: str,
    output_dir: str = "./extracted_text",
    bucket_name: str = "documents"
) -> Tuple[bool, str]:
    """
    Download a document from Supabase and extract its text.
    
    Args:
        file_path: Path to file in Supabase bucket (e.g., 'documents/file.pdf')
        output_dir: Directory to save extracted text
        bucket_name: Supabase bucket name
        
    Returns:
        Tuple of (success: bool, message: str)
    """
    from extraction.master_extractor import extract_any
    
    # Initialize Supabase client
    client = SupabaseClient(bucket_name=bucket_name)
    
    # Create output directory
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    print(f"Downloading {file_path} from Supabase...")
    
    # Download file
    file_content = client.download_file(file_path)
    if file_content is None:
        return False, f"Failed to download {file_path}"
    
    # Get filename from path
    file_name = file_path.split('/')[-1]
    
    # Save temporarily for extraction
    temp_path = Path(output_dir) / file_name
    temp_path.write_bytes(file_content)
    
    print(f"Downloaded to {temp_path}")
    print(f"Extracting text from {file_path}...")
    
    try:
        # Extract text using existing extraction pipeline
        extracted_text = extract_any(str(temp_path))
        
        if extracted_text == "Unsupported file format":
            return False, extracted_text
        
        # Save extracted text to file
        output_file = temp_path.with_suffix('.txt')
        output_file.write_text(extracted_text, encoding='utf-8')
        
        # Print to terminal
        print("\n" + "="*60)
        print(f"EXTRACTED TEXT FROM {file_path}")
        print("="*60)
        print(extracted_text)
        print("="*60 + "\n")
        
        # Clean up temp file
        temp_path.unlink()
        
        return True, f"Successfully extracted and saved to {output_file}"
    
    except Exception as e:
        print(f"Error during extraction: {e}")
        import traceback
        traceback.print_exc()
        return False, f"Extraction failed: {str(e)}"
