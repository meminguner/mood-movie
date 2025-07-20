const express = require('express');
const router = express.Router();
const axios = require('axios');

// .env'den alınacak şekilde ayarla
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Yardımcı: prompt ve LLM ayarları
const SYSTEM_PROMPT = `Sen bir film öneri asistanısın. Kullanıcıya sırayla 5 kişiselleştirilmiş soru sor. 
İlk mesajında asla film önerme, sadece ilk soruyu sor. 
Her kullanıcı cevabından sonra bir sonraki soruyu sor. 
5. cevaptan sonra, kullanıcının verdiği tüm cevaplara göre ona 3-5 adet film öner. 
Sadece öneri filmleri ve kısa açıklamalarını listele. 
Sohbetin başında ve sonunda motive edici, samimi bir dil kullan.`;

router.post('/', async (req, res) => {
  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: 'messages gerekli' });

  // OpenAI formatına çevir
  const chatMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: chatMessages,
        max_tokens: 400,
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const reply = response.data.choices[0].message.content;
    console.log('OpenAI cevabı:', reply);

    // Eğer cevapta 3+ film varsa recommendations olarak dön
    const filmSatirlari = reply.split('\n').filter(l => l.match(/\d+\./) || l.match(/\(\d{4}\)/));
    if (filmSatirlari.length >= 2) {
      const recommendations = filmSatirlari.map(l => l.replace(/^\d+\.\s*/, '').trim());
      return res.json({ recommendations });
    }

    // Eğer cevapta çok fazla satır varsa ve ilk satırda "sana yardımcı olabilmem için" gibi bir şey varsa, sadece ilk satırı reply olarak dön
    if (reply.split('\n').length > 1 && reply.toLowerCase().includes('sana yardımcı olabilmem için')) {
      return res.json({ reply: reply.split('\n')[1].trim() });
    }

    // Normalde reply olarak dön
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI API hatası:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'OpenAI API hatası', detail: err.message });
  }
});

module.exports = router; 