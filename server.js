const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
  const userQuery = req.body.query;

  // Static response (demo)
  let reply = "Sorry, I didn’t understand.";

  if (userQuery.toLowerCase().includes("time")) {
    reply = `The time is ${new Date().toLocaleTimeString()}`;
  } else if (userQuery.toLowerCase().includes("hi")) {
    reply = "Hello! I’m Nova, your voice assistant.";
  }

  res.json({ response: reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
