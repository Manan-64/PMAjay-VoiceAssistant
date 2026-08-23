export async function analyzeBeneficiarySituation(transcript, nsqfData) {
  console.log("TRACE 3: AI Matcher started with transcript:", transcript);
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("API KEY IS MISSING FROM ENV!");
  }

  // Fallback Logic: The Safety Net
  const runFallback = () => {
    console.warn("Triggering Hybrid Fallback Keyword Matcher...");
    console.log("TRACE 6: Fallback Triggered. Checking keywords...");
    
    const fallbackMatches = nsqfData.filter(trade => 
      trade.keywords && trade.keywords.some(kw => transcript.toLowerCase().includes(kw.toLowerCase()))
    );
    
    console.log("TRACE 7: Fallback Filtered Matches:", fallbackMatches);
    return fallbackMatches.map(t => t.id);
  };

  if (!apiKey || apiKey === '') {
    console.warn("VITE_GEMINI_API_KEY is missing.");
    return runFallback();
  }

  const prompt = `You are an AI that matches user transcripts to job IDs. Look at the transcript and the available trades. Return ONLY a raw, valid JSON array of the exact 'id' strings (e.g. "AGR-Q4101") that are highly relevant. If nothing matches, return an empty array []. Do not include markdown tags.
  
Transcript: '${transcript}'

Available Trades:
${JSON.stringify(nsqfData)}`;

  try {
    // Step 1: The AI Try
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Step 2: Safe Parsing
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log("TRACE 4: Gemini Raw Response:", rawText);
    
    const aiMatches = nsqfData.filter(trade => 
      rawText.toUpperCase().includes(trade.id.toUpperCase())
    );
    console.log("TRACE 5: AI Filtered Matches:", aiMatches);
    
    // Step 3 & Final Return: The Safety Net Check
    if (aiMatches.length > 0) {
      return aiMatches.map(t => t.id);
    } else {
      console.warn("AI returned 0 matches. Falling back to keywords.");
      return runFallback();
    }
    
  } catch (error) {
    console.error("Gemini AI Fetch Error:", error);
    // Step 3: Trigger Safety Net on exception
    return runFallback();
  }
}
