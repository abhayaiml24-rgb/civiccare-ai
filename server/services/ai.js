function ruleBasedAnalysis({ title, description, location }) {
  const text = `${title} ${description}`.toLowerCase();

  const rules = [
    { category: 'Electricity', words: ['streetlight', 'light', 'electric', 'power', 'wire', 'transformer'] },
    { category: 'Water', words: ['water', 'leak', 'pipe', 'drain', 'tap', 'sewage'] },
    { category: 'Roads', words: ['pothole', 'road', 'footpath', 'traffic', 'bridge'] },
    { category: 'Sanitation', words: ['garbage', 'trash', 'waste', 'dustbin', 'smell', 'toilet'] },
    { category: 'Safety', words: ['theft', 'unsafe', 'fire', 'accident', 'harass', 'dog'] }
  ];

  let category = 'Other';
  for (const rule of rules) {
    if (rule.words.some(w => text.includes(w))) {
      category = rule.category;
      break;
    }
  }

  let priority = 'Medium';
  if (['urgent', 'danger', 'fire', 'accident', 'injury', 'shock'].some(w => text.includes(w))) {
    priority = 'High';
  } else if (['minor', 'small', 'paint'].some(w => text.includes(w))) {
    priority = 'Low';
  }

  return { category, priority, summary: `${title} (reported at ${location}).` };
}

async function callAI(prompt) {
  const model = process.env.AI_MODEL || 'gemini-3.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.AI_API_KEY
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { thinkingConfig: { thinkingLevel: 'LOW' } }
    })
  });

  const data = await res.json();
  if (!data.candidates) throw new Error(JSON.stringify(data.error || data));
  return data.candidates[0].content.parts[0].text;
}

async function analyzeComplaint(complaint) {
  if (!process.env.AI_API_KEY) return ruleBasedAnalysis(complaint);

  const prompt = `You classify civic complaints. Reply with ONLY valid JSON, no extra text:
{"category": "Electricity|Water|Roads|Sanitation|Safety|Other", "priority": "Low|Medium|High", "summary": "one short sentence"}

Title: ${complaint.title}
Description: ${complaint.description}
Location: ${complaint.location}`;

  try {
    const text = await callAI(prompt);
    const result = JSON.parse(text.replace(/```json|```/g, '').trim());
    console.log('Real AI used for complaint analysis');
    return result;
  } catch (err) {
    console.log('AI failed, using rules:', err.message);
    return ruleBasedAnalysis(complaint);
  }
}

function faqReply(message) {
  const m = message.toLowerCase();
  if (m.includes('report') || m.includes('complain'))
    return "Click 'Report a Problem', enter a clear title, a short description and the exact location, then submit. Our AI will categorize it and set a priority.";
  if (m.includes('status') || m.includes('track'))
    return 'Every complaint moves through Pending, In Progress and Resolved. You can see the current status on the dashboard.';
  if (m.includes('water') || m.includes('leak'))
    return 'For a water leak, mention the exact spot, how long it has been leaking, and whether it is flooding. These details help set the priority.';
  return 'I can help you report a problem or understand complaint statuses. Try asking: how do I report a pothole?';
}

async function chatReply(message) {
  if (!process.env.AI_API_KEY) return faqReply(message);

  const prompt = `You are the help assistant for CivicCare AI, a community complaint reporting web app.
Facts about the app (do not mention any feature that is not listed here):
- To report a problem, the user fills in exactly three fields: Title, Description and Location, then clicks Submit Report.
- The AI then automatically assigns a Category, a Priority and a one-line summary.
- There is NO photo upload, NO map and NO login for users.
- Each complaint has a status: Pending, In Progress or Resolved. An admin updates the status.
- The dashboard shows counts and can filter by category, status and priority.
Answer the user's question in plain text, in at most 60 words, with no markdown formatting.

User question: ${message}`;

  try {
    return await callAI(prompt);
  } catch (err) {
    console.log('Chat AI failed, using FAQ:', err.message);
    return faqReply(message);
  }
}

module.exports = { analyzeComplaint, chatReply };