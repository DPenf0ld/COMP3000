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


//generating search engine
app.post('/generate-answer', async (req, res) => {
    const { userMessage } = req.body; // Get user input from the request body

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            store: true,
            messages: [
                {
                    role: 'user',
                    content: `I want you to provide search results from this input '${userMessage}'. Your result needs to simulate the internet, include headers and a small paragraph per one. Only include 3 fake websites. Do not add any extra feedback and do not number the sites.`
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

//generatin phishing email
app.post('/generate-phishing', async (req, res) => {


    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            store: true,
            messages: [
                {
                    role: 'user',
                    content: `
                Generate a phishing email with the following structure:
                - type: The type of phishing attack (e.g., "Deceptive-Phishing", "Clone-Phishing", "Spear-Phishing").
                - hover: The email address displayed on hover (e.g., "support@securepay.com").
                - sender: The name of the sender (e.g., "SecurePay Solutions").
                - subject: The subject line of the email.
                - body: The HTML body of the email, with potential phishing indicators such as urgency or links.
            Output the response in this JSON format:
            {
                "type": "Deceptive-Phishing",
                "hover": "billing-securepay@securepaysolutions-support.com",
                "sender": "SecurePay Solutions",
                "subject": "Urgent Account Update Required",
                "body": "<html><body>Your message here</body></html>"
            }
            `,
                },
            ],
            max_tokens: 200

        });

        // Send the answer back to the client
        res.json({ email: JSON.parse(response.choices[0].message.content)  });
    } catch (error) {
        console.error('Error generating answer:', error);
        res.status(500).json({ error: 'Failed to generate answer' });
    }
});





// Start the server
const PORT = 3000; // Change this if needed
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
