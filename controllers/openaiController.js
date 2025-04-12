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

//generating GAME search engine
app.post('/generate-game', async (req, res) => {
    const { userMessage } = req.body; // Get user input from the request body

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    
                    role: 'user',
                    content: `I want you to generate twelve search results for the query: '${userMessage}'.
                    
                    - Provide **twelve results**: 
                      - Produce a total of Twelve Results
                      - Six should be **legitimate** websites.
                      - Six should be **malicious** scam/phishing websites.
                      - Put these 12 websites in a random order
                     
                    
                    - Format the response as a **JSON array** with objects structured like this:
                      {
                        "title": "Website Name",
                        "url": "https://example.com",
                        "description": "A short description of what the site offers.",
                        "isSafe": true  // or false for malicious sites
                      }
                    
                    - For **malicious sites**, make them appear suspicious by:
                      - Using **HTTP instead of HTTPS**.
                      - Slightly misspelling well-known brand names (e.g., "PaypaI.com" instead of "Paypal.com").
                      - Making exaggerated claims (e.g., "Win a Free iPhone! Click Now").
                      - Using domains like ".xyz", ".info", ".top".
                    
                    - Return ONLY the JSON array. Do NOT include any extra text or explanations.`
               
                },
            ],
            max_tokens: 700
        });

        // turn into json (if needed)
        const searchResults = JSON.parse(response.choices[0].message.content);

        // Send array back 
        res.json({ answer: searchResults });


    } catch (error) {
        console.error('Error generating answer:', error);
        res.status(500).json({ error: 'Failed to generate answer' });
    }
});



//generating search engine
app.post('/generate-answer', async (req, res) => {
    const { userMessage } = req.body; // Get user input from the request body

    try {
        const response = await openai.chat.completions.create({
            model: ' ',
            messages: [
                {
                    role: 'user',
                    content: `I want you to generate six search results for the query: '${userMessage}'.
                    
                    - Provide **six results**: 
                      - Produce a total of 6 Results
                      - Three should be **legitimate** websites.
                      - Three should be **malicious** scam/phishing websites.
                      - Put these 6 websites in a random order
                     
                    
                    - Format the response as a **JSON array** with objects structured like this:
                      {
                        "title": "Website Name",
                        "url": "https://example.com",
                        "description": "A short description of what the site offers.",
                        "isSafe": true  // or false for malicious sites
                        "feedback": Explain why the information is safe or not
                      }
                    
                    - For **malicious sites**, make them appear suspicious by:
                      - Using **HTTP instead of HTTPS**.
                      - Slightly misspelling well-known brand names (e.g., "PaypaI.com" instead of "Paypal.com").
                      - Making exaggerated claims (e.g., "Win a Free iPhone! Click Now").
                      - Using domains like ".xyz", ".info", ".top".
                    
                    - Return ONLY the JSON array. Do NOT include any extra text or explanations.`
               
                },
            ],
            max_tokens: 500
        });

        // turn into json (if needed)
        const searchResults = JSON.parse(response.choices[0].message.content);

        // Send array back 
        res.json({ answer: searchResults });


    } catch (error) {
        console.error('Error generating answer:', error);
        res.status(500).json({ error: 'Failed to generate answer' });
    }
});


// Generating phishing email
app.post('/generate-phishing', async (req, res) => {
    try {
        const { firstName } = req.body;

        const emailTypes = ['Deceptive-Phishing', 'Clone-Phishing', 'Spear-Phishing', 'Safe-Email'];
        const randomType = emailTypes[Math.floor(Math.random() * emailTypes.length)];

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
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
                      - For **Spear-Phishing** and **Safe Emails**, **use the provided first name exactly as given** in \`${firstName}\`. Do not replace or modify it.
                      - If no **firstName** is provided, use a generic greeting (e.g., "Dear Customer").

                    ### **Phishing Email Differences:**
                    - **Deceptive Phishing**: The email appears to be from a real company but has altered details. The sender’s name may look real, but the **email domain is fake** (e.g., "support@paypal-secure.com").
                    - **Clone Phishing**: The email **closely mimics a real email** the user might have received before but contains **malicious changes**, such as altered links or attachments. The **email address has small changes** (e.g., "admin@paypa1.com" instead of "admin@paypal.com").

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
            max_tokens: 500,
        });

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
