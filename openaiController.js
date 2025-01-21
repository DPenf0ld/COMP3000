const { OpenAI } = require('openai');
require('dotenv').config();
const express = require('express');

const cors = require('cors'); // Allow cross-origin requests
const app = express();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse JSON bodies

app.post('/generate-answer', async (req, res) => {
    const { userMessage } = req.body; // Get user input from the request body

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            store: true,
            messages: [
                {
                    role: 'user',
                    content: `I want you to provide search results from this input '${userMessage}'. Your result needs to simulate the internet. Only include 3 fake websites. Do not add any extra feedback and do not number the sites.`
                },
            ],
            max_tokens: 100

        });

        // Send the answer back to the client
        res.json({ answer: response.choices[0].message.content });
    } catch (error) {
        console.error('Error generating answer:', error);
        res.status(500).json({ error: 'Failed to generate answer' });
    }
});


// Start the server
const PORT = 3000; // Change this if needed
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
