"""
Document processor module for retrieving pending documents from Supabase,
extracting text, and updating processing status.
"""

from pathlib import Path
from typing import List, Dict, Tuple, Optional
from datetime import datetime
import traceback

from supabase import create_client


class DocumentProcessor:
    """Process documents from Supabase: retrieve, extract, and update status."""
    
    def __init__(
        self,
        supabase_url: str = "https://iwcthscngbbygaanejib.supabase.co",
        supabase_key: str = "sb_secret_FbFaFtzc24OvZ8mDhv3Icg_-SBOIX4u",
        table_name: str = "documents",
        bucket_name: str = "documents",
        output_dir: str = "./extracted_text"
    ):
        """
        Initialize Document Processor.
        
        Args:
            supabase_url: Supabase project URL
            supabase_key: Supabase Service Role Key (bypasses RLS)
            table_name: Database table name
            bucket_name: Storage bucket name
            output_dir: Directory to save extracted text files
        """
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.table_name = table_name
        self.bucket_name = bucket_name
        self.output_dir = Path(output_dir)
        
        # Initialize Supabase client
        self.client = create_client(supabase_url, supabase_key)
        
        # Create output directory
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Import extraction function
        from extraction.master_extractor import extract_any
        self.extract_any = extract_any
    
    def get_pending_documents(self, status: str = "Pending") -> List[Dict]:
        """
        Retrieve documents with specified status from the database.
        
        Args:
            status: Status to filter by (default: "Pending")
            
        Returns:
            List of document records from the database
        """
        try:
            print(f"Fetching documents with status = '{status}'...")
            response = self.client.table(self.table_name).select("*").eq(
                "status", status
            ).execute()
            
            documents = response.data
            print(f"Found {len(documents)} document(s) with status '{status}'")
            return documents
        
        except Exception as e:
            print(f"Error fetching documents: {e}")
            traceback.print_exc()
            return []
    
    def download_file(self, storage_path: str) -> Optional[bytes]:
        """
        Download a file from Supabase storage.
        
        Args:
            storage_path: Path to file in storage bucket (e.g., 'documents/file.pdf' or just 'file.pdf')
            
        Returns:
            File content as bytes, or None if download fails
        """
        try:
            print(f"  Downloading {storage_path}...")
            
            # Remove bucket prefix if it's included in the storage_path
            file_path = storage_path
            if file_path.startswith(f"{self.bucket_name}/"):
                file_path = file_path[len(self.bucket_name) + 1:]
            
            file_content = self.client.storage.from_(self.bucket_name).download(
                file_path
            )
            return file_content
        
        except Exception as e:
            print(f"  Error downloading {storage_path}: {e}")
            return None
    
    def extract_and_save(
        self, file_content: bytes, original_filename: str, document_id: str
    ) -> Tuple[bool, str, str]:
        """
        Extract text from file and save to .txt file.
        
        Args:
            file_content: File content as bytes
            original_filename: Original filename from database
            document_id: Document ID for tracking
            
        Returns:
            Tuple of (success: bool, message: str, output_file_path: str)
        """
        try:
            # Create temporary file to extract from
            temp_filename = f"temp_{document_id}_{original_filename}"
            temp_path = self.output_dir / temp_filename
            temp_path.write_bytes(file_content)
            
            print(f"  Extracting text...")
            
            # Extract text
            extracted_text = self.extract_any(str(temp_path))
            
            if extracted_text == "Unsupported file format":
                temp_path.unlink()
                return False, "Unsupported file format", ""
            
            # Save to .txt file
            output_filename = f"{Path(original_filename).stem}.txt"
            output_path = self.output_dir / output_filename
            output_path.write_text(extracted_text, encoding='utf-8')
            
            # Clean up temp file
            temp_path.unlink()
            
            print(f"  Saved extracted text to {output_path}")
            return True, "Extraction successful", str(output_path)
        
        except Exception as e:
            print(f"  Error during extraction: {e}")
            traceback.print_exc()
            return False, f"Extraction error: {str(e)}", ""
    
    def update_document_status(
        self, document_id: str, status: str = "Text Extracted"
    ) -> bool:
        """
        Update the status of a document in the database.
        
        Args:
            document_id: Document ID to update
            status: New status (default: "Text Extracted")
            
        Returns:
            True if successful, False otherwise
        """
        try:
            print(f"  Updating status to '{status}'...")
            self.client.table(self.table_name).update({
                "status": status,
                "processed": True,
                "processed_at": datetime.now().isoformat()
            }).eq("id", document_id).execute()
            
            return True
        
        except Exception as e:
            print(f"  Error updating document status: {e}")
            return False
    
    def process_pending_documents(
        self, update_status: bool = True, status: str = "Pending"
    ) -> Dict:
        """
        Main processing function: retrieve pending documents, extract text, update status.
        
        Args:
            update_status: Whether to update database status after processing
            status: Status to filter by (default: "Pending")
            
        Returns:
            Dictionary with processing results
        """
        results = {
            "total": 0,
            "successful": 0,
            "failed": 0,
            "processed_files": [],
            "errors": []
        }
        
        print("\n" + "="*60)
        print("DOCUMENT PROCESSING PIPELINE")
        print("="*60 + "\n")
        
        # Get pending documents
        documents = self.get_pending_documents(status=status)
        results["total"] = len(documents)
        
        if not documents:
            print("No pending documents to process.\n")
            return results
        
        # Process each document
        for doc in documents:
            print(f"\nProcessing document: {doc['original_filename']} (ID: {doc['id']})")
            print("-" * 60)
            
            try:
                # Download file
                file_content = self.download_file(doc['storage_path'])
                if file_content is None:
                    results["failed"] += 1
                    results["errors"].append({
                        "document_id": doc['id'],
                        "filename": doc['original_filename'],
                        "error": "Failed to download from storage"
                    })
                    continue
                
                # Extract text and save
                success, message, output_file = self.extract_and_save(
                    file_content,
                    doc['original_filename'],
                    doc['id']
                )
                
                if not success:
                    results["failed"] += 1
                    results["errors"].append({
                        "document_id": doc['id'],
                        "filename": doc['original_filename'],
                        "error": message
                    })
                    continue
                
                # Update database status if requested
                if update_status:
                    status_updated = self.update_document_status(
                        doc['id'], 
                        status="Text Extracted"
                    )
                    if not status_updated:
                        results["errors"].append({
                            "document_id": doc['id'],
                            "filename": doc['original_filename'],
                            "error": "Text extracted but failed to update database status"
                        })
                
                results["successful"] += 1
                results["processed_files"].append({
                    "document_id": doc['id'],
                    "original_filename": doc['original_filename'],
                    "output_file": output_file,
                    "status": "processed"
                })
                
                print(f"✅ Successfully processed")
            
            except Exception as e:
                print(f"❌ Error processing document: {e}")
                traceback.print_exc()
                results["failed"] += 1
                results["errors"].append({
                    "document_id": doc['id'],
                    "filename": doc['original_filename'],
                    "error": str(e)
                })
        
        # Print summary
        print("\n" + "="*60)
        print("PROCESSING SUMMARY")
        print("="*60)
        print(f"Total documents: {results['total']}")
        print(f"Successfully processed: {results['successful']}")
        print(f"Failed: {results['failed']}")
        
        if results["errors"]:
            print(f"\nErrors encountered:")
            for error in results["errors"]:
                print(f"  - {error['filename']}: {error['error']}")
        
        print("="*60 + "\n")
        
        return results


def main():
    """Main function to process pending documents."""
    processor = DocumentProcessor()
    
    # Process documents with status = "Pending"
    # Change status parameter if needed to filter by different status values
    results = processor.process_pending_documents(
        update_status=True,
        status="Pending"
    )
    
    print("\nProcessing complete!")
    return results


if __name__ == "__main__":
    main()
