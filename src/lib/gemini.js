const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.0-flash";

function extractJson(text) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  return JSON.parse(cleaned);
}

function buildErrorFromResponse(status, payload) {
  const apiMessage = payload?.error?.message;
  if (apiMessage) {
    return new Error(`Gemini API error (${status}): ${apiMessage}`);
  }
  return new Error(`Gemini request failed with status ${status}.`);
}

export async function generateTripPlanWithGemini(formData) {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env");
  }
  if (!GEMINI_API_KEY.startsWith("AIza")) {
    throw new Error(
      "Invalid Gemini API key format. Use a Google AI Studio API key that starts with 'AIza'.",
    );
  }

  const prompt = `
Generate a practical travel plan in JSON only.
Return valid JSON with this exact shape:
{
  "summary": "short summary",
  "bestTimeToVisit": "text",
  "estimatedBudgetNote": "text",
  "suggestions": ["Day 1 ...", "Day 2 ..."],
  "hotelAreaSuggestions": ["area 1", "area 2"],
  "foodSuggestions": ["food/place 1", "food/place 2"],
  "travelTips": ["tip 1", "tip 2"]
}

User input:
- Destination: ${formData.destination}
- Start Date: ${formData.startDate}
- Total Days: ${formData.days}
- Budget: ${formData.budget}
- Interests: ${formData.interests || "Not specified"}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    let errorPayload = null;
    try {
      errorPayload = await response.json();
    } catch {
      // Ignore JSON parse failure and throw generic status error below.
    }
    throw buildErrorFromResponse(response.status, errorPayload);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  try {
    return extractJson(text);
  } catch {
    throw new Error(
      "Gemini returned non-JSON output. Retry once or tighten your prompt.",
    );
  }
}
