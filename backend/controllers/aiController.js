import Groq from "groq-sdk";

// Initialize Groq with the key from your .env file
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const chatWithAI = async (req, res) => {
  try {
    const userMessage = req.body.message;

    // We give the AI a "System Prompt" so it knows its job
    const systemPrompt = {
      role: "system",
      content: "You are a friendly, helpful virtual waiter for an online food delivery website. Keep your answers brief, under 3 sentences. Help users find food, explain ingredients, or suggest pairings."
    };

    // Send the prompt and the user's message to Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [systemPrompt, { role: "user", content: userMessage }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    // Send the AI's reply back to the frontend
    const aiResponse = chatCompletion.choices[0]?.message?.content;
    res.status(200).json({ reply: aiResponse });

  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ error: "Chef AI is currently taking a break!" });
  }
};