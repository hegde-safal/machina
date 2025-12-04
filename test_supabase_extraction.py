"""Test Supabase integration and extraction pipeline."""

from supabase_integration import download_and_extract

if __name__ == "__main__":
    # Supabase configuration
    FILE_PATH = "IDP_Hackathon_Roadmap.pdf"  # File path in bucket
    BUCKET_NAME = "documents"  # Bucket name
    OUTPUT_DIR = "./extracted_text"
    
    print(f"Testing Supabase extraction with:")
    print(f"  Bucket: {BUCKET_NAME}")
    print(f"  File: {FILE_PATH}")
    print(f"  Output Dir: {OUTPUT_DIR}\n")
    
    success, message = download_and_extract(
        file_path=FILE_PATH,
        output_dir=OUTPUT_DIR,
        bucket_name=BUCKET_NAME
    )
    
    if success:
        print(f"✅ Success: {message}")
    else:
        print(f"❌ Failed: {message}")
