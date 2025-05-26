/** @format */

const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/translate", async (req, res) => {
  const { text } = req.body;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Translate to Korean: ${text}` }],
    });

    res.json({ result: chat.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`OpenAI proxy server running at http://localhost:${port}`);
});
