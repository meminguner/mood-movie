require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log('OPENAI_API_KEY:', OPENAI_API_KEY ? 'Var' : 'YOK');

if (!OPENAI_API_KEY) {
  console.error('API anahtarı bulunamadı!');
  process.exit(1);
}

async function testOpenAI() {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Sadece "OK" yaz.' },
          { role: 'user', content: 'Test' }
        ],
        max_tokens: 5
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('OpenAI API çalışıyor! Cevap:', response.data.choices[0].message.content);
  } catch (err) {
    console.error('OpenAI API hatası:', err.response ? err.response.data : err.message);
  }
}

testOpenAI(); 