import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Changed to match your exact variable name
    API_KEY = os.getenv("API_KEY") 
    DATA_PATH = os.path.join(os.path.dirname(__file__), "../../../data/Conversational_Transcript_Dataset.json")

config = Config()