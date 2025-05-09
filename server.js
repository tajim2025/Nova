const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// প্রজেক্টকে স্লিপ হতে দিবে না
const keepAlive = () => {
  setInterval(() => {
    axios.get('https://sore-pinnate-crop.glitch.me')
      .then(() => console.log('Keeping alive...'))
      .catch(err => console.error('Keep alive failed:', err));
  }, 240000); // প্রতি 4 মিনিটে ping
};

// মিডলওয়্যার সেটআপ
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// টেস্ট রুট
app.get('/', (req, res) => {
  res.send(`
    <h1>Nova Assistant Backend</h1>
    <p>Status: Active</p>
    <p>Last wake: ${new Date().toLocaleTimeString()}</p>
  `);
});

// চ্যাট API এন্ডপয়েন্ট
app.post('/api/chat', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Query cannot be empty' });
    }

    console.log('Processing query:', query);

    // ChatGPT API কল
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: query }],
        temperature: 0.7,
        max_tokens: 150
      },
      { 
        headers: { 
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 10000 // 10 সেকেন্ড টাইমআউট
      }
    );

    const reply = response.data.choices[0].message.content;
    console.log('Success:', reply.substring(0, 50) + '...');
    
    res.json({ response: reply });

  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({ 
      error: "Internal Server Error",
      details: error.response?.data || error.message 
    });
  }
});

// সার্ভার শুরু
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  keepAlive(); // স্লিপ মোড প্রতিরোধ শুরু
});
