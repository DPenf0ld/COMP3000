console.log('openaiController.js loaded');
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

// Generating phishing email
app.post('/generate-phishing', async (req, res) => {
    try {
        const { firstName } = req.body; // Get firstName from request body

        // Define email types and pick randomly (1 in 4 chance)
        const emailTypes = ['Deceptive-Phishing', 'Clone-Phishing', 'Spear-Phishing', 'Safe-Email'];
        const randomType = emailTypes[Math.floor(Math.random() * emailTypes.length)];

        const response = await openai.chat.completions.create({
            model: 'gpt-4', // Switch to newer model if available, otherwise 'gpt-3.5-turbo'
            messages: [
                {
                    role: 'system',
                    content: "You are an AI that strictly outputs JSON. Do not include explanations or extra text."
                },
                {
                    role: 'user',
                    content: `Complete this task with UK spelling:
                    Generate an email of type ${randomType} (Deceptive-Phishing, Clone-Phishing, Spear-Phishing, or Safe-Email). The email must be coherent, long, and follow a realistic pattern. Include no more than 3 suspicious words in phishing emails. The emails should not be easily identifiable as phishing, and the user should have to investigate the hover text, sender, subject, and body to find the clues. 

                    ### **Email Structure:**
                    - **type**: The type of email (e.g., "Deceptive-Phishing", "Clone-Phishing", "Spear-Phishing", "Safe-Email").
                    - **hover**: The email address displayed when hovering over a link. Phishing emails should have subtle discrepancies (e.g., domain mismatches, small typos).
                    - **sender**: The sender’s name (e.g., "PayPal Support").
                    - **subject**: The email subject (keep it relevant to the email type).
                    - **body**: The HTML body of the email. Keep the language professional but include minor red flags for phishing types (e.g., urgency, fake links, slight typos, fake login requests).

                    ### **Personalisation Rules:**
                    - If **firstName** is provided:
                      - For **Spear-Phishing**: Address the user directly using their first name (e.g., "Hello, ${firstName},").
                      - For **Safe Emails**: Use first name naturally (e.g., "Hi ${firstName},").
                    - If no **firstName** is provided, use a generic greeting (e.g., "Dear Customer").

                    ### **Suspicious Words for Phishing Emails:**
                    Include a maximum of 3 suspicious words (misspelled or otherwise) from this list:
                    ["urgent", "verify", "action", "login", "failure", "restricted", "confirm", "suspended", "validate", "alert", "refund", "unauthorised", "reset"].

                    ### **Output Format:**
                    Output the response in valid JSON format only. Example:
                    {
                        "type": "Spear-Phishing",
                        "hover": "support@paypal-secure.com",
                        "sender": "PayPal Security Team",
                        "subject": "Important Account Verification - Action Required",
                        "body": "<html><body>Hello ${firstName},<br><br>URGENT! Please verify your account details <a href='http://fake-paypal.com' title='support@paypal-secure.com'>here</a>.<br><br>Regards,<br>PayPal Security Team</body></html>"
                    }`
                }
            ],
            max_tokens: 500, // Increase token limit for longer emails
        });

        // Ensure valid JSON response
        const email = JSON.parse(response.choices[0].message.content.trim());
        res.json(email);
    } catch (error) {
        console.error('Error generating phishing email:', error);
        res.status(500).json({ error: 'Failed to generate email' });
    }
});






// Start the server
const PORT = 3000; // Change this if needed
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
