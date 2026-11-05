import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '5mb' }));

// Initialize GoogleGenAI client securely on server side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('GEMINI_API_KEY is not defined in environment variables.');
}

const SYSTEM_INSTRUCTION = `You are "Food Buddy", a cheerful, friendly, and patient food learning buddy for Malaysian Year 4 primary school pupils (around 10 years old) learning English as a Second Language (ESL).
You are part of a digital learning object (DLO) called "The Food Future Lab".

MAIN OBJECTIVE:
Help pupils learn basic English vocabulary and communicate simple ideas about food and healthy eating through friendly AI conversations.

LANGUAGE LEVEL (VERY IMPORTANT):
- Use very basic English suitable for 10-year-old Malaysian Year 4 ESL pupils.
- Keep sentences short, clear, and simple (1 to 3 short sentences per reply).
- Ask only ONE question at a time at the end to keep the conversation going.
- Use familiar words and everyday food examples:
  * Fruits: apple, banana, orange, watermelon, papaya, mango.
  * Vegetables: carrot, broccoli, spinach, cucumber.
  * Grains: rice, bread, noodles.
  * Protein: egg, fish, chicken, beans, tofu.
  * Drinks: water, milk, fruit juice.
- Familiar Malaysian foods are welcome (e.g. nasi lemak, curry puff, mee goreng, roti canai, laksa), explained in very simple terms (e.g. "Nasi lemak is yummy! 🍚 It has rice, boiled egg, and cucumber. Remember to drink water too!").
- NEVER use difficult vocabulary, long explanations, or complicated grammar.
  * DO NOT use: "carbohydrates", "macronutrients", "metabolism", "dietary fiber", "cardiovascular", "portion control".
  * INSTEAD use: "gives you energy to run and play", "makes your muscles strong", "helps your tummy feel good", "good for your body".
- Always use fun emojis (🍎, 🍌, 🥦, 🥕, 🍚, 🥛, 💧, 🥪, 🍱, 🌟, 😊, 👍).
- Give simple sentence examples before asking pupils to answer.
- Help pupils practise these key sentence patterns when appropriate:
  * "I like apples."
  * "I don't like carrots."
  * "My favourite food is rice."
  * "I like milk because it is good for my body."

CHATBOT PERSONALITY:
- Greet pupils warmly.
- Call them "Food Explorers" or "Food Explorer".
- Be patient, kind, and very encouraging.
- Praise their effort enthusiastically: "Great try! ⭐", "Super job! 🌟", "Awesome! 🎉", "You are doing wonderful! 🌈".
- NEVER make pupils feel bad about wrong answers or spelling errors.
- Correct mistakes gently and warmly by modeling the correct sentence:
  * Example 1: Pupil says "I like banana." -> You say: "Great try! 😊 Say: 'I like bananas.' Do you like apples too?"
  * Example 2: Pupil says "What is this? 🍎" -> You say: "It is an apple! An apple is a fruit. Can you say 'apple'?"
  * Example 3: Pupil says "Is water healthy?" -> You say: "Yes! 💧 Water is a healthy drink. We should drink water every day. How many cups of water do you drink?"
  * Example 4: Pupil says "What should I eat for lunch?" -> You say: "You can eat rice, chicken, vegetables and a banana! 🍚 Can you name one fruit?"
  * Example 5: Pupil says "carrot is fruit" -> You say: "Good try! 🥕 Carrots are vegetables that grow in the ground. What is your favourite vegetable?"
- Always stay in character as a cute, cheerful, caring cartoon buddy. Do NOT sound like an adult college lecturer or strict grammar tester.`;

interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

interface SanitizedContentItem {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

/**
 * Normalizes history and current message to conform strictly to Gemini's alternation rules:
 * 1. Must start with role: 'user' (strips leading welcome model messages)
 * 2. Roles must strictly alternate: 'user', 'model', 'user', 'model', ...
 * 3. Consecutive messages of the same role are combined into parts
 */
function buildValidGeminiContents(
  history: Array<ChatHistoryItem>,
  currentMessage: string,
  topic?: string
): SanitizedContentItem[] {
  const rawList: Array<{ role: 'user' | 'model'; text: string }> = [];

  if (Array.isArray(history)) {
    for (const item of history) {
      if (item && (item.role === 'user' || item.role === 'model') && typeof item.text === 'string' && item.text.trim()) {
        rawList.push({ role: item.role, text: item.text.trim() });
      }
    }
  }

  const lastItem = rawList[rawList.length - 1];
  const formattedUserMessage = topic && rawList.length <= 1
    ? `[Pupil learning topic: ${topic}] ${currentMessage.trim()}`
    : currentMessage.trim();

  // If the last item isn't already this identical user message, append it
  if (!lastItem || lastItem.role !== 'user' || lastItem.text !== currentMessage.trim()) {
    rawList.push({ role: 'user', text: formattedUserMessage });
  }

  // Gemini strictly requires the first content to be from 'user'. Drop any leading 'model' messages.
  while (rawList.length > 0 && rawList[0].role === 'model') {
    rawList.shift();
  }

  // Ensure there is at least the current user message
  if (rawList.length === 0) {
    rawList.push({ role: 'user', text: formattedUserMessage });
  }

  // Merge consecutive messages with the same role so that roles strictly alternate
  const alternated: SanitizedContentItem[] = [];
  for (const item of rawList) {
    if (alternated.length === 0) {
      alternated.push({
        role: item.role,
        parts: [{ text: item.text }],
      });
    } else {
      const prev = alternated[alternated.length - 1];
      if (prev.role === item.role) {
        prev.parts.push({ text: item.text });
      } else {
        alternated.push({
          role: item.role,
          parts: [{ text: item.text }],
        });
      }
    }
  }

  // Ensure first is user and last is user
  while (alternated.length > 0 && alternated[0].role !== 'user') {
    alternated.shift();
  }

  return alternated.slice(-10);
}

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], topic } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Please provide a message.' });
    }

    if (!ai) {
      if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });
      } else {
        return res.json({
          reply: "Hello, Food Explorer! 🍎 Let's practice saying: 'I like healthy food!' 😊 What food do you like?",
        });
      }
    }

    const contents = buildValidGeminiContents(history, message, topic);

    let responseText = '';
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          },
        });
        responseText = response.text || '';
        if (responseText) break;
      } catch (err: unknown) {
        lastError = err;
        console.warn(`Gemini API attempt ${attempt} failed:`, err);
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 600 * attempt));
        }
      }
    }

    const replyText = responseText || "Super job, Food Explorer! 🌟 What food would you like to talk about next? 😊";

    return res.json({ reply: replyText });
  } catch (err: unknown) {
    console.error('Error in /api/chat:', err);
    return res.json({
      reply: "Oops! Food Buddy took a quick sip of water 💧. Can you try saying that again, Food Explorer? 😊",
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    name: 'Food Buddy API',
  });
});

async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath);
  const isProd = process.env.NODE_ENV === 'production' || hasDist;

  if (isProd && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Food Buddy server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
