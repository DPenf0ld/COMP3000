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
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: `You are a search engine simulator and safe browsing advisor.

Generate six **realistic and contextually relevant search results** for the user's query: '${userMessage}'.

Format the response as a **JSON array of six objects**, where:
- Three results are from **legitimate and trustworthy** websites.
- Three results are from **unsafe or malicious** websites that mimic real ones but should not be trusted.
- Randomize the order of all six results.

Each object must follow this structure:
{
  "title": "Website Title",
  "url": "https://example.com",
  "description": "Brief explanation of what the website offers",
  "isSafe": true,  // or false for dangerous/malicious sites
  "feedback": "Explain clearly why this website is safe or not. For safe sites, mention HTTPS, reputation, or credible source. For unsafe sites, highlight suspicious features like HTTP, misspellings, misleading content, or unsafe domains like .xyz/.top/.info"
}

Guidelines:
- Ensure **realism**. Use domain names and titles that reflect actual types of content related to the query.
- Safe websites should resemble real search results from sources like news, government, education, or verified organizations.
- Malicious websites should appear **slightly suspicious**, such as:
  - Misspelled brand names (e.g., "Amaz0n" or "Go0gle-login")
  - Using **HTTP instead of HTTPS**
  - Suspicious TLDs (e.g., ".xyz", ".top", ".info")
  - Overly promotional or clickbait-style descriptions
- Ensure all entries are **plausible responses** to the user’s search query.

Return **only** the JSON array. Do **not** include any extra commentary or explanation.`
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

                    The email structure must match the email type e.g.:
                    Deceptive Phishing - A fake email that impersonates a trusted company to steal personal details.

                    Clone Phishing - A copy of a real email but with dangerous changes (links and attachments).
                    
                    Spear Phishing - A targeted scam using your personal details to seem more convincing.

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
                    Include a maximum of 3 suspicious words from this list, USE MISSPELT ONES:
                    ["urgent", "verify", "update", "login", "failure", "restricted", "confirm", "suspended", "validate",
"alert", "unauthorised", "review", "security", "credentials", "customer", "earlist", "earliest", "immediately",
"action", "unauthorized", "disruptions", "mandatory", "access", "locked",
"verrify", "custumer", "logon", "loging", "failur", "restringted", "suspend", 
"confrm", "valdate", "disput", "alrt", "unautherised", "idnetity", "warnning"]

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
