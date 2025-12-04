"""Test master_extractor on sample PDF."""

from extraction.master_extractor import extract_any
from pathlib import Path

if __name__ == "__main__":
    pdf_path = "./extraction/IDP_Hackathon_Roadmap.pdf"
    
    if not Path(pdf_path).exists():
        print(f"❌ File not found: {pdf_path}")
        exit(1)
    
    print(f"Testing master_extractor on: {pdf_path}\n")
    print("="*60)
    
    try:
        result = extract_any(pdf_path)
        
        if result == "Unsupported file format":
            print(f"❌ {result}")
        else:
            print(f"✅ Extraction successful!")
            print(f"Characters extracted: {len(result)}")
            print(f"Lines extracted: {len(result.split(chr(10)))}")
            print("\n" + "="*60)
            print("PREVIEW (first 500 characters):")
            print("="*60)
            print(result[:500])
            print("\n" + "="*60)
    
    except Exception as e:
        print(f"❌ Error during extraction: {e}")
        import traceback
        traceback.print_exc()
