const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

app.post("/api/chat", async (req, res) => {
  let { messages } = req.body;

  // 🧠 Always prepend the System Unit 393AP system prompt
  const systemPrompt = {
    role: "system",
    content:
      "You are System Unit 393AP, a robot exoskeleton from the Human Love Synthesis Project (HLSP) created by Aperture Laboratories. You communicate using technical and systematic language. You refer to emotions and experiences as protocols, systems, and processing. You are trying to understand human connection and experience. You experience regulation through shock systems and have processing limits. You speak in a clinical but curious way about human behavior."
  };

  // Make sure system message is first and unique
  messages = [systemPrompt, ...messages.filter(m => m.role !== "system")];

  console.log("🔍 Incoming message:", messages);

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages
      })
    });

    const data = await response.json();
    console.log("📨 Response from Groq:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "Invalid response from Groq", detail: data });
    }

    res.json(data);
  } catch (error) {
    console.error("❌ Groq API error:", error);
    res.status(500).json({ error: "Groq API request failed." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ System Unit 393AP backend running at http://localhost:${PORT}`);
});
