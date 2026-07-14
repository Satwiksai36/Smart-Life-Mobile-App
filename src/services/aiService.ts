/**
 * AI Service Client
 * Outlines pipeline integrations for OpenAI API or Google Gemini API.
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'gemini'; // 'gemini' | 'openai'
const API_KEY = import.meta.env.VITE_AI_API_KEY || '';

/**
 * Sends conversation context list to the configured AI API (Gemini or OpenAI)
 */
export async function queryAiAssistant(messages: ChatMessage[]): Promise<{ text: string; actions?: any[] }> {
  if (!API_KEY) {
    // If no key is set, fallback to mock Aura engine response
    return mockAuraResponse(messages[messages.length - 1].content);
  }

  try {
    if (AI_PROVIDER === 'gemini') {
      return await queryGemini(messages);
    } else {
      return await queryOpenAI(messages);
    }
  } catch (error) {
    console.error('[AIService] Failed to query AI endpoint:', error);
    throw error;
  }
}

/**
 * OpenAI API HTTP Request integration
 */
async function queryOpenAI(messages: ChatMessage[]) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI HTTP Error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices[0]?.message?.content || '';
  return parseActionsFromResponse(text);
}

/**
 * Google Gemini API HTTP Request integration
 */
async function queryGemini(messages: ChatMessage[]) {
  // Convert messages to Gemini's content format
  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  });

  if (!response.ok) {
    throw new Error(`Gemini HTTP Error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return parseActionsFromResponse(text);
}

/**
 * Parses structural cards JSON instructions embedded within AI text blocks
 */
function parseActionsFromResponse(text: string): { text: string; actions?: any[] } {
  // Extract JSON blocks if present in markdown code fences
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = text.match(jsonRegex);
  
  if (match && match[1]) {
    try {
      const actions = JSON.parse(match[1]);
      const cleanText = text.replace(jsonRegex, '').trim();
      return { text: cleanText, actions: Array.isArray(actions) ? actions : [actions] };
    } catch (e) {
      console.warn('[AIService] Failed to parse action block JSON:', e);
    }
  }

  return { text };
}

/**
 * Mock responses for offline/keyless previewing
 */
function mockAuraResponse(userInput: string): Promise<{ text: string; actions?: any[] }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const input = userInput.toLowerCase();
      
      if (input.includes('study') || input.includes('plan')) {
        resolve({
          text: "Here is your study schedule proposal. You can click import below to automatically add it to your tasks list.",
          actions: [
            { type: 'task', label: 'Revise Algorithms (2 hours)', payload: { title: 'Revise Algorithms', notes: 'Study binary search trees and heap structures.', priority: 'high' } },
            { type: 'task', label: 'Complete math assignment', payload: { title: 'Complete math assignment', notes: 'Solve calculus section 4.', priority: 'medium' } }
          ]
        });
      } else if (input.includes('budget') || input.includes('saving')) {
        resolve({
          text: "Based on your recent transactions, I suggest setting a budget constraint. Click import to update your metrics.",
          actions: [
            { type: 'budget', label: 'Cap Dining Out limit at ₹10,000', payload: { category: 'Dining Out', amount: 10000 } }
          ]
        });
      } else {
        resolve({
          text: "I am Aura, your cognitive productivity co-pilot. I can analyze your notes, recommend routine habits, structure calendars, and audit expense scanner receipts. What can I do for you today?"
        });
      }
    }, 1500);
  });
}
