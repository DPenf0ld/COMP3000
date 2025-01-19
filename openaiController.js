const { OpenAI } = require('openai');
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Allow cross-origin requests
const path = require('path');  // resolving file paths
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
                    content: userMessage
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

// Serve the desktop.html file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'desktop.html'));
});

// Start the server
const PORT = 3000; // Change this if needed
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
