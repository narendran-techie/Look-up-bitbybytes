const geminiService = require('../services/geminiService');

const askGemini = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'A question is required in the request body.'
      });
    }

    const answer = await geminiService.askGemini(question.trim());
    res.status(200).json({ answer });
  } catch (error) {
    console.error('[Gemini Controller Error]', error.message || error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Gemini request failed.',
      details: error.response?.data || null
    });
  }
};

module.exports = { askGemini };
