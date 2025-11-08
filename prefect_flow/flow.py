import os
import json
from datetime import datetime
from prefect import flow, task
from dotenv import load_dotenv
from supabase import create_client
from dateutil import parser as dateparser

load_dotenv()
os.environ["PREFECT_API_URL"] = ""  # Run Prefect locally

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
SUPABASE_TABLE = os.getenv('SUPABASE_TABLE', 'cleaned_logs')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@task
def parse_logs(file_path: str):
    with open(file_path, 'r') as f:
        lines = f.readlines()

    cleaned = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        try:
            ts, action, status, user, ip = line.split(',')
        except ValueError:
            continue

        cleaned.append({
            "event_timestamp": dateparser.parse(ts).isoformat(),
            "level": "INFO",
            "message": f"{action} {status}",
            "source": user,
            "raw_payload": ip
        })
    return cleaned

@task
def store_in_supabase(records):
    if not records:
        print("No records to insert.")
        return
    supabase.table(SUPABASE_TABLE).insert(records).execute()
    print(f"Inserted {len(records)} records into Supabase")

@flow
def clean_and_store(file_path: str):
    logs = parse_logs(file_path)
    store_in_supabase(logs)
    return f"Processed {len(logs)} logs"
