// controllers/chatbotController.js
const Faq = require('../models/faq');
const Message = require('../models/message');
const { generateResponse } = require('../services/groqService'); // keep using Groq

async function handleChat(req, res) {
  try {
    const tenantId = req.tenantKey || 'default';
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 1) Save the user message
    await Message.create({ tenantId, role: 'user', text: message });

    // 2) Try FAQ first (very simple fuzzy match)
    const faqs = await Faq.find({ tenantId }).lean();
    let picked = null;
    const msg = message.toLowerCase();
    for (const f of faqs) {
      const q = (f.question || '').toLowerCase();
      const overlap = intersectionSize(words(msg), words(q));
      if (overlap >= Math.max(2, Math.ceil(q.split(/\s+/).length * 0.35))) {
        picked = f; break;
      }
    }

    let reply, source;
    if (picked) {
      reply = picked.answer;
      source = 'FAQ';
    } else {
      // 3) Fall back to AI
      reply = await generateResponse(message, { tenantId });
      source = 'AI';
    }

    // 4) Save assistant message
    await Message.create({ tenantId, role: 'assistant', text: reply, source });

    res.json({ reply, source });
  } catch (err) {
    console.error('chatbot error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

function words(s) {
  return new Set(String(s).toLowerCase().match(/[a-z0-9]+/g) || []);
}
function intersectionSize(a, b) {
  let n = 0; for (const w of a) if (b.has(w)) n++; return n;
}

module.exports = { handleChat };
