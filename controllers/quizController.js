console.log('quizController.js loaded');
import { confirmphishingFunction } from '../controllers/phishingController.js';
import { confirmpasswordFunction } from '../controllers/passwordController.js';
import { confirmwebFunction } from '../controllers/webController.js';

export let quizOpen = false;

const desktopArea = document.getElementById('desktop-area');
const leavetaskModel = document.getElementById('leave-quiz')
const quizContainer = document.getElementById('quiz-container');
const quizInterface = document.getElementById('quiz-interface')
const instructionModel = document.getElementById('instructions-quiz');
const resultsInfo = document.getElementById('result-info');
const progressBar = document.getElementById('progressBar');


let instructionsConfirmed = false;
let currentQuestionIndex = 0;
let phishingCorrect = 0;
let webCorrect = 0;
let passwordCorrect = 0;
let pieCreated = false;
let quizComplete = false;

// Quiz Questions 
const Questions = [
    {
        type: "password",
        value: "3", // Correct answer
        question: "What should you do if you find that one of your passwords has appeared in a data breach?",
        Answer1: "Ignore it and continue using the password.",
        Answer2: "Only change the password on the account where it was breached.",
        Answer3: "Change the password immediately on all accounts where it’s used.",
        Answer4: "Assume no harm will come from the breach, as no damage has occurred yet."
    },
    {
        type: "phishing",
        value: "1", // Correct answer
        question: "You receive an email from 'admin@yourbank.com' stating, 'Your account has been locked due to suspicious activity. Click here to verify your identity.' What is the most likely red flag?",
        Answer1: "The urgency and demand for immediate action",
        Answer2: "The use of the bank’s official name",
        Answer3: "The presence of a clickable link in the email",
        Answer4: "The fact that you have a bank account with them"
    },
    {
        type: "phishing",
        value: "4", // Correct answer
        question: "How can you verify if a link in an email is suspicious before clicking on it?",
        Answer1: "Click on the link and see if it looks legitimate",
        Answer2: "Trust the email if it includes a company logo",
        Answer3: "Reply to the email asking for confirmation",
        Answer4: "Hover over the link to check the actual URL"
    },
    {
        type: "web",
        value: "3", // Correct answer now is Answer3
        question: "What should you do if you’re unsure about a website’s safety after reviewing its link?",
        Answer1: "Click the link to confirm it’s safe.",
        Answer2: "Visit the site anyway, as most websites are safe.",
        Answer3: "Search for reviews or reports about the site online before visiting.",
        Answer4: "Ignore your doubts and trust the description provided."
    },
    {
        type: "phishing",
        value: "2", // Correct answer
        question: "A phishing email claims to be from PayPal, stating that your account will be suspended unless you act immediately. What should you do?",
        Answer1: "Click the link to check your account status",
        Answer2: "Log in to PayPal by typing the official website address in your browser",
        Answer3: "Reply to the email asking for further clarification",
        Answer4: "Assume it's real since PayPal sends security alerts"
    },
    {
        type: "password",
        value: "3", // Correct answer
        question: "What makes credential stuffing such a dangerous attack method?",
        Answer1: "It relies on guessing passwords manually.",
        Answer2: "It uses social engineering to trick users into sharing passwords.",
        Answer3: "It uses previously breached passwords to attack multiple websites at once.",
        Answer4: "It requires a password manager to be successful."
    },
    {
        type: "phishing",
        value: "4", // Correct answer
        question: "What should you do if you suspect an email is a phishing attempt?",
        Answer1: "Ignore it and delete it without taking any action",
        Answer2: "Forward it to everyone in your company as a warning",
        Answer3: "Respond to the sender to see if they reply",
        Answer4: "Report the email to your IT department or the official company it claims to be from"
    },
    {
        type: "web",
        value: "3",
        question: "What does it mean if a website uses HTTPS but still seems suspicious?",
        Answer1: "It is definitely safe to enter your personal information.",
        Answer2: "HTTPS indicates the site is part of an official organization.",
        Answer3: "HTTPS provides encryption but doesn’t guarantee the site’s legitimacy.",
        Answer4: "If the site uses HTTPS, it can’t be malicious."
    },
    {
        type: "password",
        value: "4", // Correct answer
        question: "Why is it risky to use the same password across multiple accounts?",
        Answer1: "It makes the password easier to remember.",
        Answer2: "It ensures you don’t forget the password.",
        Answer3: "It increases the likelihood of attackers accessing all your accounts if one password is breached.",
        Answer4: "It guarantees better password strength since it's reused."
    },
    {
        type: "web",
        value: "1",
        question: "What does it mean if a URL has unusual characters or misspellings?",
        Answer1: "It is likely a fake or malicious site.",
        Answer2: "It may just be a typo and should be trusted.",
        Answer3: "It is probably a secure website that uses a variation for marketing.",
        Answer4: "It’s harmless as long as the website looks professional."
    },
    {
        type: "phishing",
        value: "1", // Correct answer
        question: "What is a common sign that an email is a Deceptive Phishing attempt?",
        Answer1: "A generic greeting such as 'Dear Customer' instead of your actual name",
        Answer2: "An email from a service you recognise",
        Answer3: "A message confirming a recent purchase you made",
        Answer4: "A professional tone with no spelling errors"
    },
    {
        type: "phishing",
        value: "3", // Correct answer
        question: "Which of the following is an example of Clone Phishing?",
        Answer1: "An email from an unknown sender offering a free prize",
        Answer2: "An email pretending to be from your bank with a fake warning",
        Answer3: "An email that looks identical to a legitimate one but has modified links or attachments",
        Answer4: "A phishing email that targets a high-profile individual"
    },
    {
        type: "password",
        value: "1", // Correct answer
        question: "What is one of the most important aspects of creating a strong password according to NCSE guidelines?",
        Answer1: "Using at least three random words.",
        Answer2: "Using a single, easily memorable word.",
        Answer3: "Choosing the longest possible password.",
        Answer4: "Including your date of birth for uniqueness."
    },
    {
        type: "web",
        value: "4",
        question: "What is one of the main goals of a phishing attack?",
        Answer1: "To provide users with helpful information.",
        Answer2: "To redirect traffic to a legitimate website.",
        Answer3: "To improve user awareness about online threats.",
        Answer4: "To trick users into revealing sensitive information such as passwords or credit card details."
    },
    {
        type: "phishing",
        value: "4", // Correct answer
        question: "You receive an email from 'support@secure-payments.com' asking you to confirm your bank details. What should you do first?",
        Answer1: "Click the link and verify the request with your bank",
        Answer2: "Reply to the email asking for more details",
        Answer3: "Ignore the email since all support emails are scams",
        Answer4: "Hover over the sender's email and any links to check for inconsistencies"
    },
    {
        type: "web",
        value: "1", // Correct answer now is Answer1
        question: "Why is it important to avoid clicking on pop-ups that appear while browsing the web?",
        Answer1: "They can redirect you to malicious websites or install malware.",
        Answer2: "They often contain important announcements from trusted websites.",
        Answer3: "They typically provide discounts or offers from legitimate sources.",
        Answer4: "They are secure if they appear after entering a trusted website."
    },
    {
        type: "password",
        value: "2", // Correct answer
        question: "What is one of the primary reasons short passwords are less secure?",
        Answer1: "They are easier for humans to guess.",
        Answer2: "They can be brute-forced faster by attackers.",
        Answer3: "They can be hard to remember.",
        Answer4: "They are more likely to be unique."
    },
    {
        type: "password",
        value: "1", // Correct answer
        question: "What is a key reason why using personal details (e.g. pet names, birthdates) in a password is a security risk?",
        Answer1: "Such details can often be easily guessed or found through social media.",
        Answer2: "They make passwords longer and harder to remember.",
        Answer3: "They are more likely to be encrypted by security systems.",
        Answer4: "They guarantee that the password will not be part of a common dictionary."
    },
    {
        type: "web",
        value: "4",
        question: "If you notice a domain name ending in '.xyz' instead of '.com' or '.org,' what does it potentially indicate?",
        Answer1: "It is more likely to be a legitimate website.",
        Answer2: "The domain ending is just a marketing strategy.",
        Answer3: "The site is highly secure because it has a unique domain.",
        Answer4: "The website could be unreliable and potentially unsafe."
    },
    {
        type: "password",
        value: "3", // Correct answer
        question: "How can using a password manager improve security?",
        Answer1: "It allows users to remember all their passwords easily.",
        Answer2: "It stores passwords in an unencrypted format for convenience.",
        Answer3: "It generates strong, random passwords and stores them securely.",
        Answer4: "It makes passwords easier to crack by reducing complexity."

    },
    {
        type: "phishing",
        value: "2", // Correct answer
        question: "A co-worker receives an email from IT Support requesting their password to 'fix a system issue.' What should they do?",
        Answer1: "Reply with their password since it’s from IT",
        Answer2: "Verify with IT through an official contact method before responding",
        Answer3: "Ignore the email since all IT emails are scams",
        Answer4: "Forward the email to their manager and continue working"
    },
    {
        type: "web",
        value: "2",
        question: "What is the best way to ensure a link you find in a search result is safe before clicking?",
        Answer1: "Trust any link that appears on the first page of results.",
        Answer2: "Hover over the link to check its true destination.",
        Answer3: "Always click on the first link as it’s the most relevant.",
        Answer4: "Ignore the URL, as the content description is more important."
    },
    {
        type: "password",
        value: "2", // Correct answer
        question: "Why is it important to regularly update your passwords, even if no breach has occurred?",
        Answer1: "It improves the password's strength and makes it harder to remember.",
        Answer2: "It helps reduce the risk of your password being exposed through future breaches.",
        Answer3: "It ensures that your password is always stored in an encrypted format.",
        Answer4: "It makes the password more difficult to guess by attackers."
    },
    {
        type: "password",
        value: "4", // Correct answer
        question: "What is a critical reason to follow the NCSE guideline of avoiding common words in passwords?",
        Answer1: "They are easier to remember but also more likely to be part of a dictionary attack.",
        Answer2: "They make passwords longer and harder to guess.",
        Answer3: "They are less likely to be cracked by brute force.",
        Answer4: "They are frequently used in attacks where attackers rely on common knowledge and previous data breaches."
    },
    {
        type: "web",
        value: "4",
        question: "What do URL shortening services (e.g., bit.ly) tell you about the website?",
        Answer1: "They are generally secure, as they only redirect to trusted sites.",
        Answer2: "They can help you track where the link is being clicked from.",
        Answer3: "They are a common feature of official promotions.",
        Answer4: "They can hide the actual destination, making it hard to assess the site’s safety."
    },
    {
        type: "phishing",
        value: "2", // Correct answer
        question: "A friend sends you an email saying, 'Hey, check out this amazing deal I found! Click here!' What is the best way to handle this?",
        Answer1: "Click the link because it's from a friend",
        Answer2: "Check with your friend through another contact method before clicking anything",
        Answer3: "Ignore it since all promotional emails are scams",
        Answer4: "Report your friend’s email as phishing immediately"
    },
    {
        type: "web",
        value: "2",
        question: "If you encounter a website offering an unbelievable deal, what should you be cautious about?",
        Answer1: "It’s likely a legitimate offer with no risks involved.",
        Answer2: "It might be a scam designed to steal your personal information.",
        Answer3: "The offer might be genuine if it’s on a well-known website.",
        Answer4: "The deal may just be promotional and not a scam."
    },
    {
        type: "password",
        value: "2", // Correct answer
        question: "Which of the following is NOT a best practice for creating strong passwords?",
        Answer1: "Including a mix of uppercase, lowercase, numbers, and special characters.",
        Answer2: "Reusing passwords across multiple accounts for easier management.",
        Answer3: "Using at least three random words for greater complexity.",
        Answer4: "Avoiding common words and predictable phrases."
    },
    {
        type: "web",
        value: "3", // Correct answer
        question: "What is the primary reason attackers use fake login pages in phishing attempts?",
        Answer1: "To provide users with discounts or benefits.",
        Answer2: "To inform users about a potential issue with their account.",
        Answer3: "To collect personal credentials and use them for malicious purposes.",
        Answer4: "To redirect users to a genuine login page."
    },
    {
        type: "phishing",
        value: "3", // Correct answer
        question: "Which of the following best describes a Spear Phishing attack?",
        Answer1: "A general scam email sent to thousands of random people",
        Answer2: "A fake email from a bank warning about a security breach",
        Answer3: "A personalised scam email that includes your name and personal details to gain your trust",
        Answer4: "An email that looks identical to a real one but contains hidden malware"
    },
];




export function loadQuestion() {

    // update progress bar
    const progress = (currentQuestionIndex / 30) * 100;
    progressBar.style.width = `${progress}%`;

    quizOpen = true;
    let questionData = Questions[currentQuestionIndex];

    // update the question
    document.querySelector(".quiz-multiplechoice-box h1").textContent = questionData.question;

    // update answer choices
    let options = document.querySelectorAll(".quiz-radio-section label");
    options[0].innerHTML = `<input type="radio" name="option" value="1">${questionData.Answer1}`;
    options[1].innerHTML = `<input type="radio" name="option" value="2">${questionData.Answer2}`;
    options[2].innerHTML = `<input type="radio" name="option" value="3">${questionData.Answer3}`;
    options[3].innerHTML = `<input type="radio" name="option" value="4">${questionData.Answer4}`;


    // Clear previous
    document.querySelectorAll('input[name="option"]').forEach(input => input.checked = false);
}

// Function to check the answer
export function checkAnswer() {
    let selectedOption = document.querySelector('input[name="option"]:checked');

    if (!selectedOption) {
        alert("Please select an answer!"); //change to text feedback
        return;
    }

    let selectedValue = selectedOption.value;
    let correctValue = Questions[currentQuestionIndex].value;
    let type = Questions[currentQuestionIndex].type;

    if (selectedValue === correctValue) {
        if (type == "phishing") {
            phishingCorrect++;
            console.log(phishingCorrect);
        } else if (type == "password") {
            passwordCorrect++;
            console.log(passwordCorrect);
        } else if (type == "web") {
            webCorrect++;
            console.log(webCorrect);
        }
    }

    // Show the "Next" button if there are more questions
    if (currentQuestionIndex < Questions.length - 1) {
        nextQuestion()
    } else {
        const quizBox = document.querySelector('.quiz-multiplechoice-box');
        quizBox.style.display = 'none';  // Hide only the quiz

        createChart();
    }
}

function createChart() {
    progressBar.style.width = `100%`;

    let phishingResult = false;
    let passwordResult = false;
    let webResult = false;

    document.getElementById('results-header').style.display = 'block';
    document.getElementById('results-task-header').style.display = 'block';
    document.getElementById('pass/fail-header').style.display = 'block';

    const totalCorrect = phishingCorrect + passwordCorrect + webCorrect;
    const percentage = ((totalCorrect / 30) * 100).toFixed(2); // Round to 2 decimal places

    // Update the results text
    document.getElementById('quiz-results-text').innerHTML = `
        Phishing questions correct: ${phishingCorrect}/10 <br><br>
        Password questions correct: ${passwordCorrect}/10 <br><br>
        Web questions correct: ${webCorrect}/10 <br><br>
        <strong>Overall Score:</strong> ${totalCorrect}/30 <br><br>
        <strong>Percentage:</strong> ${percentage}%
    `;

    if (phishingCorrect >= 7) {
        phishingResult = true;
        document.getElementById('phishing-result').innerHTML = `<span style="color: green; font-weight: bold;">Phishing task passed ✅</span>`;
    } else {
        document.getElementById('phishing-result').innerHTML = `<span style="color: red; font-weight: bold;">Phishing task failed ❌</span>`;
        document.getElementById('email-redo').style.display = 'block';
    }

    if (passwordCorrect >= 7) {
        passwordResult = true;
        document.getElementById('password-result').innerHTML = `<span style="color: green; font-weight: bold;">Password task passed ✅</span>`;
    } else {
        document.getElementById('password-result').innerHTML = `<span style="color: red; font-weight: bold;">Password task failed ❌</span>`;
        document.getElementById('password-redo').style.display = 'block';
    }

    if (webCorrect >= 7) {
        webResult = true;
        document.getElementById('web-result').innerHTML = `<span style="color: green; font-weight: bold;">Web task passed ✅</span>`;
    } else {
        document.getElementById('web-result').innerHTML = `<span style="color: red; font-weight: bold;">Web task failed ❌</span>`;
        document.getElementById('web-redo').style.display = 'block';
    }

    // Check if all tasks are passed
    if (webResult && passwordResult && phishingResult) {
        document.getElementById('pass/fail-text').innerHTML = `<span style="color: green; font-weight: bold;">Congratulations! You passed all tasks 🎉</span>`;
    } else {
        document.getElementById('pass/fail-text').innerHTML = `<span style="color: red; font-weight: bold;">You did not pass all tasks. Try again! 🔄</span>`;
    }

    //MUST CREATE ID IN HERE NOT HTML TO ALLOW THE ID TO BE DELETED AND REMADE EVERY TIME A PIE CHART IS NEEDED
    // Create a new canvas element
    const canvas = document.createElement("canvas");
    //create new id
    const uniqueId = "pieChart"
    //assign the id to canvas
    canvas.id = uniqueId;

    resultsInfo.appendChild(canvas);

    new Chart(uniqueId, {
        type: "pie",
        data: {
            labels: ["Phishing", "Password", "Web"],
            datasets: [{
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], // Customize colors
                data: [phishingCorrect, passwordCorrect, webCorrect]
            }]
        },
        options: {
            title: {
                display: true,
                text: "GuardPoint Results"
            }
        }
    });
    pieCreated = true;
    quizComplete = true;
}

export function failedTasks() {
    if (quizOpen) {
        confirmquizFunction();
    }
    if (quizComplete) {
        if (phishingCorrect < 7) {
            confirmphishingFunction()
        }

        if (passwordCorrect < 7) {
            confirmpasswordFunction()
        }

        if (webCorrect < 7) {
            confirmwebFunction()
        }
        quizComplete = false;
    }
}


// Function to load the next question
function nextQuestion() {
    currentQuestionIndex++;

    // update progress bar
    const progress = (currentQuestionIndex / 30) * 100;
    progressBar.style.width = `${progress}%`;


    if (currentQuestionIndex < Questions.length) {
        loadQuestion();
    }
}

//Leave quiz code

export function closeQuizFunction() {
    leavetaskModel.style.display = 'flex'; //working
    quizInterface.classList.add('blurred'); // Apply the blur
}

export function backquizFunction() {
    leavetaskModel.style.display = 'none';
    quizInterface.classList.remove('blurred'); // remove the blur
}

export function confirmquizFunction() {
    quizOpen = false;
    quizInterface.classList.remove('blurred'); // remove the blur
    leavetaskModel.style.display = 'none';
    quizContainer.style.display = 'none';
    desktopArea.style.display = 'flex'
    failedTasks()
}

export function confirmquizButtonFunction() {
    instructionModel.style.display = 'none';
    instructionsConfirmed = true; // listener to display instructions once user confirms
    quizInterface.classList.remove('blurred'); // Remove the blur
    loadQuestion()
}
export function QuizfirstOpenFunction() {


    if (pieCreated) {
        const oldPiechart = document.getElementById('pieChart');
        oldPiechart.remove(); // NEED CODE TO DELETE THE OLD PIE CHART
    }

    // Hide results and buttons
    document.getElementById('results-header').style.display = 'none';
    document.getElementById('results-task-header').style.display = 'none';
    document.getElementById('pass/fail-header').style.display = 'none';
    document.getElementById('email-redo').style.display = 'none';
    document.getElementById('password-redo').style.display = 'none';
    document.getElementById('web-redo').style.display = 'none';

    // Clear results text
    document.getElementById('quiz-results-text').innerHTML = '';
    document.getElementById('phishing-result').innerHTML = '';
    document.getElementById('password-result').innerHTML = '';
    document.getElementById('web-result').innerHTML = '';
    document.getElementById('pass/fail-text').innerHTML = '';

    const quizBox = document.querySelector('.quiz-multiplechoice-box');
    quizBox.style.display = 'block';  // unhide

    currentQuestionIndex = 0; //reset question number
    phishingCorrect = 0;
    webCorrect = 0;
    passwordCorrect = 0;
    instructionModel.style.display = 'flex'; //working
    quizInterface.classList.add('blurred'); // Apply the blur
}



