import asyncio
import json
from supabase import create_client
from document_processor import process_document  # your existing logic
import os

# Environment variables (Render will inject)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
BUCKET_NAME = os.getenv("SUPABASE_BUCKET_NAME", "documents")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async def handle_storage_event(event):
    """Triggered when a new file is uploaded."""
    record = event.get("new")
    file_path = record["file_path"]
    doc_id = record["id"]

    print(f"📥 New document detected: {file_path}")

    # Download file
    file_bytes = supabase.storage.from_(BUCKET_NAME).download(file_path)

    # Run your existing processor
    output = process_document(file_bytes, file_path)

    # Update database with results
    supabase.table("documents").update({
        "summary": output.get("summary"),
        "category": output.get("category"),
        "status": "processed",
        "processed_at": "now()"
    }).eq("id", doc_id).execute()

    # Mark storage event processed
    supabase.table("storage_events").update({"processed": True}).eq("id", record["id"]).execute()

    print(f"✅ Document {file_path} fully processed.\n")


async def start_listener():
    print("🚀 Worker listening for new Supabase file uploads...")

    channel = supabase.realtime.channel("storage-events")

    @channel.on("postgres_changes", {
        "event": "INSERT",
        "schema": "public",
        "table": "storage_events"
    })
    def on_event(payload):
        asyncio.create_task(handle_storage_event(payload))

    await channel.subscribe()
    
    # Keep connection alive forever
    while True:
        await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(start_listener())
