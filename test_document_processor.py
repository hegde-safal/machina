"""
Test script for document processor.
Retrieve pending documents, extract text, and update status in Supabase.
"""

from document_processor import DocumentProcessor


def main():
    """
    Test the document processor pipeline.
    
    This script will:
    1. Fetch all documents with processed = FALSE from Supabase
    2. Download each document from the storage bucket
    3. Extract text using the master_extractor
    4. Save extracted text to .txt files
    5. Update the database status to processed = TRUE
    """
    
    # Initialize the processor
    processor = DocumentProcessor(
        # You can customize these parameters if needed:
        # table_name="documents",
        # bucket_name="documents",
        # output_dir="./extracted_text"
        # processed_status=False  # Set to True to process already processed docs
    )
    
    # Process pending documents
    print("Starting document processing pipeline...\n")
    results = processor.process_pending_documents(
        update_status=True,        # Update database status after processing
        status="Pending"           # Process documents with status = "Pending"
    )
    
    # Print results
    print("\n" + "="*60)
    print("FINAL RESULTS")
    print("="*60)
    print(f"✅ Successfully processed: {results['successful']} document(s)")
    print(f"❌ Failed: {results['failed']} document(s)")
    
    if results['processed_files']:
        print("\nProcessed files:")
        for file_info in results['processed_files']:
            print(f"  - {file_info['original_filename']}")
            print(f"    → {file_info['output_file']}")
    
    if results['errors']:
        print("\nErrors:")
        for error in results['errors']:
            print(f"  - {error['filename']}: {error['error']}")
    
    print("="*60 + "\n")


if __name__ == "__main__":
    main()
