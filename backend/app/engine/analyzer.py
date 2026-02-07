from .loader import get_transcript_by_id

def identify_causal_factor(transcript_id: str):
    transcript = get_transcript_by_id(transcript_id)
    if not transcript:
        return {"error": "Transcript not found"}

    # Format transcript for the AI
    formatted_chat = ""
    for i, turn in enumerate(transcript['conversation']):
        formatted_chat += f"Turn {i}: {turn['speaker']}: {turn['text']}\n"

    # HACKATHON LOGIC: 
    # You will send this 'formatted_chat' and the 'intent' to an LLM.
    # The LLM must return: 
    # 1. The Turn Index (e.g., 4)
    # 2. Reasoning (e.g., "Agent ignored the refund request")

    # Placeholder for the AI Result:
    return {
        "transcript_id": transcript_id,
        "causal_turn_index": 4, # The AI identifies this
        "evidence": transcript['conversation'][4]['text'],
        "reasoning": f"In Turn 4, the agent failed to address the {transcript['intent']}, which directly led to the outcome."
    }