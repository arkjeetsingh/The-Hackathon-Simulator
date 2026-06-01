import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

function loadEnvFromFile(): Record<string, string> {
  const env: Record<string, string> = {};
  try {
    let currentDir = process.cwd();
    let envPath = path.join(currentDir, ".env.local");
    
    for (let i = 0; i < 4; i++) {
      if (fs.existsSync(envPath)) {
        break;
      }
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) break;
      currentDir = parentDir;
      envPath = path.join(currentDir, ".env.local");
    }

    if (!fs.existsSync(envPath)) {
      currentDir = process.cwd();
      let fallbackPath = path.join(currentDir, ".env");
      for (let i = 0; i < 4; i++) {
        if (fs.existsSync(fallbackPath)) {
          envPath = fallbackPath;
          break;
        }
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) break;
        currentDir = parentDir;
        fallbackPath = path.join(currentDir, ".env");
      }
    }

    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const eqIdx = trimmed.indexOf("=");
          const key = trimmed.slice(0, eqIdx).trim();
          let value = trimmed.slice(eqIdx + 1).trim();
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          env[key] = value;
        }
      });
    }
  } catch (err) {
    console.error("Error reading env file directly:", err);
  }
  return env;
}

export async function POST(req: Request) {
  try {
    const fileEnv = loadEnvFromFile();
    
    const openaiKey = process.env.OPENAI_API_KEY || fileEnv.OPENAI_API_KEY || 
                      process.env.NEXT_PUBLIC_OPENAI_API_KEY || fileEnv.NEXT_PUBLIC_OPENAI_API_KEY ||
                      process.env.OPENAI_KEY || fileEnv.OPENAI_KEY;
                      
    const openRouterKey = process.env.OPENROUTER_API_KEY || fileEnv.OPENROUTER_API_KEY || 
                          process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || fileEnv.NEXT_PUBLIC_OPENROUTER_API_KEY;
                          
    const geminiKey = process.env.GEMINI_API_KEY || fileEnv.GEMINI_API_KEY || 
                      process.env.NEXT_PUBLIC_GEMINI_API_KEY || fileEnv.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!openaiKey && !openRouterKey && !geminiKey) {
      return NextResponse.json({ error: "No AI API key configured" }, { status: 400 });
    }

    const categories = ["edtech", "healthtech", "fintech", "sustainability", "ai", "smart-campus"];
    const difficulties = ["beginner", "intermediate", "advanced"];
    
    // Pick random category and difficulty to suggest to the LLM
    const suggestedCategory = categories[Math.floor(Math.random() * categories.length)];
    const suggestedDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

    const systemPrompt = `You are a creative organizer for top-tier global hackathons (like PennApps, MHacks, or ETHGlobal).
Your job is to generate a highly unique, engaging, and premium hackathon-level problem statement.
The problem statement MUST be inspiring, realistic, and perfectly formatted.

You must return a single JSON object matching this TypeScript structure:
{
  "id": string (e.g. "prob-gen-" followed by a short unique slug),
  "title": string (an exciting, professional project/challenge title),
  "description": string (detailed description of the challenge and real-world problem it solves, about 1-2 sentences),
  "category": "edtech" | "healthtech" | "fintech" | "sustainability" | "ai" | "smart-campus",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "constraints": string[] (exactly 2 strict, challenging engineering constraints/rules),
  "bonusObjectives": string[] (exactly 1 bonus objective / stretch goal),
  "judgingHint": string (a valuable strategic hint/tip from the judges, start with emoji 💡)
}

Ensure the output is valid, raw JSON. Do not wrap it in markdown code blocks or explanations.`;

    const userPrompt = `Generate a unique hackathon challenge:
- Category suggestion: "${suggestedCategory}"
- Difficulty suggestion: "${suggestedDifficulty}"
Make sure the challenge is highly creative, realistic, and completely different from generic examples. Output only raw JSON.`;

    let responseText = "";

    if (openaiKey) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.9,
          max_tokens: 600
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }
      const data = await response.json();
      responseText = data.choices?.[0]?.message?.content || "";
    } else if (openRouterKey) {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openRouterKey}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "The Hackathon Simulator",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.9,
          max_tokens: 600
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }
      const data = await response.json();
      responseText = data.choices?.[0]?.message?.content || "";
    } else {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
          }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 600 }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      const data = await response.json();
      responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    }
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    const generatedProblem = JSON.parse(cleanedText);
    if (generatedProblem && generatedProblem.title && generatedProblem.description && generatedProblem.constraints) {
      return NextResponse.json({ problem: generatedProblem });
    }
    throw new Error("Invalid problem statement structure generated");
  } catch (err: any) {
    console.error("Failed to generate problem statement:", err);
    return NextResponse.json({ error: err.message || "API call failed" }, { status: 500 });
  }
}
