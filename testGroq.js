// testGroq.js
const Groq = require('groq-sdk');
require('dotenv').config();

(async () => {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  try {
    const r = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant', // or 'llama3-8b-8192'
      messages: [{ role: 'user', content: 'Say OK if you can read this.' }],
    });
    console.log('Groq says:', r.choices?.[0]?.message?.content);
  } catch (e) {
    console.error('Groq error:', e?.response?.data || e);
  }
})();
