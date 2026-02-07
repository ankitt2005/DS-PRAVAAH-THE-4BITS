import os
import json
import difflib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI()

# --------------------------
# 1. CONFIGURATION
# --------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------
# 2. HIGH-PERFORMANCE DATA LOADER
# --------------------------
def load_transcript_data():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_dir, "data", "transcript.json")
    
    print(f"📂 LOADING DATASET: {file_path}")
    
    if not os.path.exists(file_path):
        print("❌ ERROR: transcript.json not found.")
        return []

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        conversation_turns = []
        
        # Flatten the huge structure into a simple list of turns
        if isinstance(data, dict) and "transcripts" in data:
            for item in data["transcripts"]:
                if "conversation" in item:
                    conversation_turns.extend(item["conversation"])
        elif isinstance(data, list):
            conversation_turns = data

        count = len(conversation_turns)
        print(f"✅ SYSTEM READY: Successfully indexed {count} conversation turns.")
        return conversation_turns
        
    except Exception as e:
        print(f"⚠️ CRITICAL ERROR LOADING FILE: {e}")
        return []

# Load data into memory once at startup
TRANSCRIPT_DATA = load_transcript_data()

# --------------------------
# 3. SMART CHAT LOGIC
# --------------------------
class ChatRequest(BaseModel):
    message: str

# ... (keep your existing imports and load_transcript_data function) ...

# 👇 ADD THIS BLOCK HERE 👇
@app.get("/")
def read_root():
    return {"status": "System Online", "loaded_turns": len(TRANSCRIPT_DATA)}
# 👆 END OF NEW BLOCK 👆

# ... (keep the rest of the file: class ChatRequest, @app.post, etc.) ...

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    user_query = request.message.strip().lower()
    
    if not TRANSCRIPT_DATA:
        return {"response": "⚠️ System Error: Dataset not loaded. Check server terminal."}

    print(f"🔍 SEARCHING for: '{user_query}'")

    best_match_index = -1
    best_match_score = 0.0

    # --- STRATEGY 1: EXACT SUBSTRING SEARCH (FAST) ---
    # We look for the FIRST line where the user's text appears exactly.
    for i, turn in enumerate(TRANSCRIPT_DATA):
        text = str(turn.get("text", "")).lower()
        
        # Skip if this line is not from a Customer (optional, but helps accuracy)
        speaker = turn.get("speaker", "Unknown")
        
        if user_query in text:
            # We found a match!
            best_match_index = i
            best_match_score = 1.0
            print(f"   ✅ Exact match found at index {i}")
            break # Stop searching, we found it.

    # --- STRATEGY 2: FUZZY SEARCH (FALLBACK) ---
    # Only run this if exact match failed
    if best_match_index == -1:
        print("   ⚠️ No exact match. Trying fuzzy search (this might take a moment)...")
        for i, turn in enumerate(TRANSCRIPT_DATA):
            text = str(turn.get("text", "")).lower()
            score = difflib.SequenceMatcher(None, user_query, text).ratio()
            
            # Threshold: Must be at least 60% similar
            if score > 0.6 and score > best_match_score:
                best_match_score = score
                best_match_index = i

    # --- GENERATE REPLY ---
    if best_match_index != -1:
        # We found what the USER said. Now we need the AGENT'S reply.
        # We look at the NEXT lines (index + 1, index + 2...) until we find an Agent.
        
        reply_found = False
        response_text = ""
        
        # Look ahead up to 3 lines to find an Agent reply
        for offset in range(1, 4):
            if best_match_index + offset < len(TRANSCRIPT_DATA):
                next_turn = TRANSCRIPT_DATA[best_match_index + offset]
                next_speaker = next_turn.get("speaker", "Unknown")
                
                # Check if the next person speaking is the Agent
                if next_speaker == "Agent":
                    response_text = next_turn.get("text", "")
                    reply_found = True
                    break
        
        if reply_found:
            return {"response": response_text}
        else:
            return {"response": "[End of conversation or no Agent reply found next]"}

    else:
        return {"response": "I couldn't find that line in the script. Please copy-paste a specific Customer line from your file."}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)