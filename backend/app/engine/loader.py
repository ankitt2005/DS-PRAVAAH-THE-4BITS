import json
import os

# Adjust path to find your data folder
DATA_PATH = os.path.join(os.path.dirname(__file__), "../../../data/Conversational_Transcript_Dataset.json")

def load_transcripts():
    if not os.path.exists(DATA_PATH):
        print(f"Error: File not found at {DATA_PATH}")
        return []
    with open(DATA_PATH, 'r') as f:
        data = json.load(f)
        # Your JSON has a top-level key "transcripts"
        return data.get("transcripts", [])

def get_transcript_by_id(t_id: str):
    all_data = load_transcripts()
    return next((t for t in all_data if t["transcript_id"] == t_id), None)