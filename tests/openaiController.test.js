import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

// Mock OpenAI API
vi.mock('openai', () => ({
    OpenAI: vi.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: vi.fn()
            }
        }
    }))
}));

//copy routes - ALLOWS TESTING IN A SAFE ENVIRONMENT

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
                      - Six should be **legitimate** websites.
                      - Six should be **malicious** scam/phishing websites.
                      - Mix them in a **random order** to make them hard to differentiate.
                    
                    - Format the response as a **JSON array** with objects structured like this:
                      {
                        "title": "Website Name",
                        "url": "https://example.com",
                        "description": "A short description of what the site offers.",
                        "isSafe": true  // or false for malicious sites
                      }
                    
                    - For **malicious websites**, make them look **convincing but subtly off**:
                      - Use realistic-looking domains with **small changes** (e.g., extra letters, swapped characters, use of zero instead of "o").
                      - Use **HTTPS** occasionally to appear more trustworthy.
                      - Slightly **exaggerated language**, but not too obvious (e.g., “Special deal just for you” instead of “Win free iPhone!”).
                      - Use uncommon but real-looking TLDs (e.g., ".support", ".store", ".site").
                      - Make the descriptions sound helpful or professional to increase believability.
                      
                    - For **legitimate sites**, use accurate and trustworthy sources relevant to the query.
                    - Make **all titles and descriptions** sound plausible and professional to increase the challenge.
                    - Avoid obvious giveaways like broken English, all caps, or spammy punctuation.
                    
                    - Return ONLY the JSON array. Do NOT include any extra text or explanations.`

                },
            ],
            max_tokens: 1000
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
                    content: `You are a simulated search engine and safe browsing advisor.

                    Generate six highly realistic and contextually relevant search results for the query: '${userMessage}'.
                    
                    Requirements:
                    - Return a **JSON array** of six objects.
                    - Exactly **three should be legitimate** and **three should be unsafe** (e.g., phishing, scams, fake support sites).
                    - Randomize the order to avoid any patterns.
                    
                    Each object must follow this structure:
                    {
                      "title": "Website Title",
                      "url": "https://example.com",
                      "description": "What the site appears to offer",
                      "isSafe": true,  // or false
                      "feedback": "A brief explanation of why this site is either trustworthy or dangerous"
                    }
                    
                    Detailed Guidelines:
                    
                    Safe websites:
                    - Use real and recognizable domains (.gov, .org, .edu, major .com sites).
                    - Always use HTTPS.
                    - Provide accurate, helpful, and professional-sounding descriptions.
                    - Titles should match what a real search engine would display.
                    
                    Unsafe websites:
                    - Mimic real sites using **minor domain tricks**:
                      - Character swaps (e.g., "go0gle", "micr0soft", "amaz0n-pay").
                      - Extra or missing characters (e.g., "netfl1x-help.com", "facebok-login.xyz").
                    - May use HTTPS to **appear trustworthy**, but not always.
                    - Use **less common or suspicious TLDs** (e.g., .xyz, .top, .support, .store, .online).
                    - Descriptions should sound **plausible or helpful**, but subtly sketchy (e.g., “Reset your account access now”, “Quick support chat for billing issues”).
                    - Avoid overly obvious spam language; make the deception subtle and realistic.
                    - Feedback should **explain the red flag(s)** (e.g., unusual domain, urgency, imitation).
                    
                    Return only the **raw JSON array** — no extra text or comments.
                    `                    
                },
            ],
            max_tokens: 800
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

// ======================== TESTS ==========================

beforeEach(() => {
    openai.chat.completions.create.mockReset();
});

describe('POST /generate-game', () => {
    it('should return a JSON array of search results', async () => {
        const mockResponse = [
            { title: 'Safe Site 1', url: 'https://safesite1.com', description: 'A legitimate site', isSafe: true },
            { title: 'Malicious Site 1', url: 'https://malicious1.com', description: 'A suspicious site', isSafe: false }
        ];

        openai.chat.completions.create.mockResolvedValue({ choices: [{ message: { content: JSON.stringify(mockResponse) } }] });

        const res = await request(app)
            .post('/generate-game')
            .send({ userMessage: 'test query' });

        expect(res.status).toBe(200);
        expect(res.body.answer).toEqual(mockResponse);
    });

    it('should handle errors properly', async () => {
        openai.chat.completions.create.mockRejectedValue(new Error('Error generating answer'));

        const res = await request(app)
            .post('/generate-game')
            .send({ userMessage: 'test query' });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Failed to generate answer');
    });
});

describe('POST /generate-answer', () => {
    it('should return a JSON array of search results', async () => {
        const mockResponse = [
            { title: 'Safe Site 1', url: 'https://safesite1.com', description: 'A legitimate site', isSafe: true, feedback: 'This site is trustworthy' },
            { title: 'Malicious Site 1', url: 'https://malicious1.com', description: 'A suspicious site', isSafe: false, feedback: 'This site is a phishing attempt' }
        ];

        openai.chat.completions.create.mockResolvedValue({ choices: [{ message: { content: JSON.stringify(mockResponse) } }] });

        const res = await request(app)
            .post('/generate-answer')
            .send({ userMessage: 'test query' });

        expect(res.status).toBe(200);
        expect(res.body.answer).toEqual(mockResponse);
    });

    it('should handle errors properly', async () => {
        openai.chat.completions.create.mockRejectedValue(new Error('Error generating answer'));

        const res = await request(app)
            .post('/generate-answer')
            .send({ userMessage: 'test query' });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Failed to generate answer');
    });
});
