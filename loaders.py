import os
import time
from datetime import datetime, timezone
from supabase import create_client, Client
from elasticsearch import Elasticsearch, helpers
from dotenv import load_dotenv

load_dotenv()

# --- Supabase setup ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Elasticsearch setup ---
ES_URL = os.getenv("ELASTIC_URL")
ES_USER = os.getenv("ELASTIC_USERNAME")
ES_PASS = os.getenv("ELASTIC_PASSWORD")

es = Elasticsearch(
    ES_URL,
    basic_auth=(ES_USER, ES_PASS),
    verify_certs=True
)

INDEX_NAME = "logs"  # your index name in Elasticsearch


def ensure_index():
    """Create index in Elasticsearch if it doesn't exist."""
    if not es.indices.exists(index=INDEX_NAME):
        es.indices.create(index=INDEX_NAME, mappings={
            "properties": {
                "id": {"type": "integer"},
                "timestamp": {"type": "date"},
                "level": {"type": "keyword"},
                "message": {"type": "text"}
            }
        })
        print(f"Created index: {INDEX_NAME}")


def fetch_from_supabase():
    """Fetch all rows from Supabase cleaned_logs table."""
    response = supabase.table("cleaned_logs").select("*").execute()
    return response.data or []


def load_to_elastic(rows):
    """Bulk insert data into Elasticsearch."""
    actions = []
    for row in rows:
        actions.append({
            "_index": INDEX_NAME,
            "_id": row["id"],
            "_source": row
        })
    if actions:
        helpers.bulk(es, actions)
        print(f"Indexed {len(actions)} rows.")
    else:
        print("No new data to index.")


def run_sync():
    """One full run of Supabase -> Elasticsearch sync."""
    print(f"\n[{datetime.now(timezone.utc).isoformat()}] Starting sync...")
    ensure_index()
    rows = fetch_from_supabase()
    load_to_elastic(rows)
    print(f"[{datetime.now(timezone.utc).isoformat()}] Sync complete.\n")


def scheduled_sync(interval_minutes=60):
    """Run sync on a schedule."""
    while True:
        run_sync()
        print(f"Sleeping for {interval_minutes} minutes...\n")
        time.sleep(interval_minutes * 60)


if __name__ == "__main__":
    # change interval_minutes=10 for faster testing
    scheduled_sync(interval_minutes=30)