const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/recommend", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",  // ✅ Updated working model
      messages: [
        {
          role: "system",
          content:
            "You are a plant expert AI. Recommend plants based on sunlight, indoor/outdoor, watering, medicinal uses, and air purification."
        },
        { role: "user", content: question }
      ]
    });

    const aiMessage = completion.choices[0].message.content;

    res.json({ answer: aiMessage });

  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({
      message: "AI request failed",
      error: error.message
    });
  }
});

module.exports = router;
