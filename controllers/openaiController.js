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

//generatin phishing email
app.post('/generate-phishing', async (req, res) => {
    try {
        const { firstName } = req.body; // Get firstName from request body

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: "You are an AI that strictly outputs JSON. Do not include explanations or extra text."
                },
                {
                    role: 'user',
                    content: `Complete this task with UK spelling:
                    Generate a phishing email or a safe email. Each part of the email must be cohesive, and the email must align with its designated type. If a firstName is provided, personalise the email accordingly for **spear-phishing** and **safe emails**.

                    ### **Email Structure:**
                    - **type**: The type of email ("Deceptive-Phishing", "Clone-Phishing", "Spear-Phishing", "Safe-Email").
                    - **hover**: The email address displayed when hovering over a link. If phishing, it should look suspicious (e.g., domain mismatches or typosquatting).
                    - **sender**: The sender’s name.
                    - **subject**: The email subject line.
                    - **body**: The HTML body of the email. Phishing emails must include warning signs (e.g., urgency, fake links, grammatical errors), while safe emails should be professional.

                    ### **Personalisation Rules:**
                    - If **firstName** is provided:
                      - For **Spear-Phishing**: Address the user directly using their first name (e.g., "Hello, ${firstName},").
                      - For **Safe Emails**: Use first name naturally in a greeting (e.g., "Hi ${firstName},").
                    - If no **firstName** is provided, use a generic greeting (e.g., "Dear Customer").

                    ### **Suspicious Words for Phishing Emails:**
                    Use variations (including misspellings) from the following list in **phishing emails**:  
                    ["urgent", "customer", "earlist", "earliest", "verify", "immediately", "action", "login", "failure", "restricted", "confirm", "suspended", "validate", "dispute", "locked", "alert", "refund", "unauthorised", "reset", "identity", "unusual", "warning", "verrify", "custumer", "logon", "loging", "failur", "restringted", "suspend", "confrm", "valdate", "disput", "alrt", "unautherised", "idnetity", "warnning"].

                    ### **Output Format (Ensure Proper HTML Formatting & No Style Changes):**
                    Output the response in **valid JSON format only**, without explanations. Example:
                    {
                        "type": "Spear-Phishing",
                        "hover": "support@paypal-secure.com",
                        "sender": "PayPal Security Team",
                        "subject": "Important Account Verification - Action Required",
                        "body": "<html><body>Dear ${firstName},<br><br>ADD INFORMATION ABOUT EMAIL. ADD FAKE LINK <a href='http://fake-paypal.com' title='support@paypal-secure.com'>here</a> immediately.<br><br>Regards,<br>PayPal Security Team CHANGE</body></html>"
                    }`
                }
            ],
            max_tokens: 350,
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
