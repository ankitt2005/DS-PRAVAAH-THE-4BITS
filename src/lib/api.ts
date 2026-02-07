export async function getCausalAnalysis(transcriptId: string) {
  try {
    // Notice we are NOT using http://127.0.0.1 anymore. 
    // We use the proxy path we just created.
    const response = await fetch(`/api/python/analyze/${transcriptId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Proxy Error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ DATA RECEIVED:", data); 
    return data;
    
  } catch (error) {
    console.error("❌ CONNECTION FAILED:", error);
    return {
      transcript: [],
      causal_turn_id: null,
      confidence_score: "0%"
    };
  }
}