from pydantic import BaseModel
from typing import List, Optional

class Turn(BaseModel):
    speaker: str
    text: str

class Transcript(BaseModel):
    transcript_id: str
    intent: str
    reason_for_call: str
    conversation: List[Turn]

# This is what Task 1 will return
class CausalAnalysis(BaseModel):
    causal_turn_id: int
    evidence: str
    reasoning: str