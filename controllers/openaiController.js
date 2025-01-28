import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors'; // Allow cross-origin requests

// Load environment variables
dotenv.config();

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
            messages: [
                {
                    role: 'user',
                    content: `Complete this task with UK spelling:
                    Generate a phishing email or safe email. Each part of the email needs to link together, the email must follow the type it is. Use the following structure:
                    type: The type of email ("Deceptive-Phishing", "Clone-Phishing", "Spear-Phishing", "Safe-Email").
                    hover: The email address displayed on hover. If it is a phishing email, it should be suspicious (e.g., domain mismatches or typosquatting).
                    sender: The sender's name.
                    subject: The subject line of the email.
                    body: The HTML body of the email. For phishing emails, include suspicious indicators (e.g., urgency, grammatical errors, fake links) and embed clickable links or phrases where hovering shows a suspicious address. For safe emails, avoid suspicious indicators.
                    Use the following suspicious words where appropriate for phishing emails, and include possible misspellings for variation:
                    ["urgent", "customer", "earlist", "earliest", "verify", "immediately", "action", "login", "failure", "restricted", "confirm", "suspended", "validate", "dispute", "locked", "alert", "refund", "unauthorised", "reset", "identity", "unusual", "warning", "verrify", "custumer", "logon", "loging", "failur", "restringted", "suspend", "confrm", "valdate", "disput", "alrt", "unautherised", "idnetity", "warnning"].

                        Output the response in this JSON format. Ensure the email content is formatted correctly with HTML line breaks (<br>), this is an example. There should be a hover for safe emails too. DO NOT CHANGE THE COLOUR, SIZE OR FONT OF THE TEXT:
                        {
                            "type": "Deceptive-Phishing",
                            "hover": "SecurePay@example.com",
                            "sender": "SecurePay Solutions",
                            "subject": "Urgent Account Update Required",
                            "body": "<html><body>Message Here</body></html>"
                        }`

                    ,
                },
            ],
            max_tokens: 300,
        });

        // JSON for email structure
        const email = JSON.parse(response.choices[0].message.content);
        res.json(email);
    } catch (error) {
        console.error('Error generating phishing email:', error);
        res.status(500).json({ error: 'Failed to generate email' });
    }
});





// Start the server
const PORT = 3000; // Change this if needed
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
