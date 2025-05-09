const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// API key config
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// POST endpoint
app.post("/api/chat", async (req, res) => {
  const { query } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: query }],
    });

    const response = completion.data.choices[0].message.content;
    res.json({ response });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ response: "Something went wrong with the AI response." });
  }
});

// Root
app.get("/", (req, res) => {
  res.send("Nova GPT API is running!");
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
