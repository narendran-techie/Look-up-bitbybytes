const axios = require('axios');
const { GEMINI_API_URL } = require('../config/constants');

const extractAnswer = (payload) => {
  const candidate = payload?.candidates?.[0];
  if (!candidate) return null;

  if (typeof candidate.output === 'string') {
    return candidate.output;
  }

  if (Array.isArray(candidate.output)) {
    return candidate.output.map((item) => item?.text || '').join(' ').trim();
  }

  if (candidate?.content) {
    return Array.isArray(candidate.content)
      ? candidate.content.map((item) => item?.text || '').join(' ').trim()
      : candidate.content?.text || null;
  }

  return null;
};

const askGemini = async (question) => {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Gemini Loaded');
  console.log('Gemini API Key present:', Boolean(apiKey));

  if (!apiKey) {
    const err = new Error('Gemini API key is not configured. Please add GEMINI_API_KEY to your environment.');
    err.statusCode = 500;
    throw err;
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        prompt: {
          text: question
        },
        temperature: 0.3
      },
      { timeout: 12000 }
    );

    const answer = extractAnswer(response.data);
    return answer || 'Gemini returned an unexpected response. Please try again later.';
  } catch (error) {
    console.error('[Gemini Error]', error.response ? error.response.data : error.message || error);
    const message = error.response
      ? `Gemini API error: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`
      : `Gemini API error: ${error.message}`;
    const err = new Error(message);
    err.statusCode = error.response?.status || 500;
    throw err;
  }
};

module.exports = { askGemini };
