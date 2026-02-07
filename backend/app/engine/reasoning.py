import google.generativeai as genai
from app.core.config import config
from .loader import get_transcript_by_id

genai.configure(api_key=config.API_KEY)

def interactive_reasoning(query: str, transcript_id: str, chat_history: list):
    transcript = get_transcript_by_id(transcript_id)
    
    # Task 2 requirement: Grounding the response in the transcript (RAG style)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # We pass the history + the transcript context + the new query
    chat = model.start_chat(history=chat_history)
    
    context_prompt = f"""
    You are a Causal Analysis Expert. Use the following transcript to answer the user's question.
    Transcript context: {transcript['reason_for_call']}
    
    User Query: {query}
    
    Constraint: Your answer must be FAITHFUL to the transcript. If the information isn't there, say you don't know.
    """
    
    response = chat.send_message(context_prompt)
    
    return {
        "answer": response.text,
        "history": chat.history # Return history to the frontend to maintain the loop
    }