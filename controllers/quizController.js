console.log('quizController.js loaded');

export let quizOpen = false;

const desktopArea = document.getElementById('desktop-area');
const leavetaskModel = document.getElementById('leave-quiz')
const quizContainer = document.getElementById('quiz-container');
const quizInterface = document.getElementById('quiz-interface')
const instructionModel = document.getElementById('instructions-quiz');

let instructionsConfirmed = false;
let currentQuestionIndex = 0;

// Quiz Questions 
const Questions = [
    {
        value: "4", // Correct answer
        question: "You receive an email from 'support@secure-payments.com' asking you to confirm your bank details. What should you do first?",
        Answer1: "Click the link and verify the request with your bank",
        Answer2: "Reply to the email asking for more details",
        Answer3: "Ignore the email since all support emails are scams",
        Answer4: "Hover over the sender's email and any links to check for inconsistencies"
    },
    {
        value: "2", // Correct answer
        question: "A friend sends you an email saying, 'Hey, check out this amazing deal I found! Click here!' What is the best way to handle this?",
        Answer1: "Click the link because it's from a friend",
        Answer2: "Check with your friend through another contact method before clicking anything",
        Answer3: "Ignore it since all promotional emails are scams",
        Answer4: "Report your friend’s email as phishing immediately"
    },
    {
        value: "3", // Correct answer
        question: "Which of the following best describes a Spear Phishing attack?",
        Answer1: "A general scam email sent to thousands of random people",
        Answer2: "A fake email from a bank warning about a security breach",
        Answer3: "A personalised scam email that includes your name and personal details to gain your trust",
        Answer4: "An email that looks identical to a real one but contains hidden malware"
    },
    {
        value: "1", // Correct answer
        question: "You receive an email from 'admin@yourbank.com' stating, 'Your account has been locked due to suspicious activity. Click here to verify your identity.' What is the most likely red flag?",
        Answer1: "The urgency and demand for immediate action",
        Answer2: "The use of the bank’s official name",
        Answer3: "The presence of a clickable link in the email",
        Answer4: "The fact that you have a bank account with them"
    },
    {
        value: "2", // Correct answer
        question: "A co-worker receives an email from IT Support requesting their password to 'fix a system issue.' What should they do?",
        Answer1: "Reply with their password since it’s from IT",
        Answer2: "Verify with IT through an official contact method before responding",
        Answer3: "Ignore the email since all IT emails are scams",
        Answer4: "Forward the email to their manager and continue working"
    },
    {
        value: "4", // Correct answer
        question: "How can you verify if a link in an email is suspicious before clicking on it?",
        Answer1: "Click on the link and see if it looks legitimate",
        Answer2: "Trust the email if it includes a company logo",
        Answer3: "Reply to the email asking for confirmation",
        Answer4: "Hover over the link to check the actual URL"
    },
    {
        value: "1", // Correct answer
        question: "What is a common sign that an email is a Deceptive Phishing attempt?",
        Answer1: "A generic greeting such as 'Dear Customer' instead of your actual name",
        Answer2: "An email from a service you recognise",
        Answer3: "A message confirming a recent purchase you made",
        Answer4: "A professional tone with no spelling errors"
    },
    {
        value: "3", // Correct answer
        question: "Which of the following is an example of Clone Phishing?",
        Answer1: "An email from an unknown sender offering a free prize",
        Answer2: "An email pretending to be from your bank with a fake warning",
        Answer3: "An email that looks identical to a legitimate one but has modified links or attachments",
        Answer4: "A phishing email that targets a high-profile individual"
    },
    {
        value: "2", // Correct answer
        question: "A phishing email claims to be from PayPal, stating that your account will be suspended unless you act immediately. What should you do?",
        Answer1: "Click the link to check your account status",
        Answer2: "Log in to PayPal by typing the official website address in your browser",
        Answer3: "Reply to the email asking for further clarification",
        Answer4: "Assume it's real since PayPal sends security alerts"
    },
    {
        value: "4", // Correct answer
        question: "What should you do if you suspect an email is a phishing attempt?",
        Answer1: "Ignore it and delete it without taking any action",
        Answer2: "Forward it to everyone in your company as a warning",
        Answer3: "Respond to the sender to see if they reply",
        Answer4: "Report the email to your IT department or the official company it claims to be from"
    }
];




export function loadQuestion() {
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

    // Hide Next button
    document.getElementById("next-quiz").style.display = "none";

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

    if (selectedValue === correctValue) {
        alert("Correct!");
    } else {
        alert("Incorrect!");
    }

    // Show the "Next" button if there are more questions
    if (currentQuestionIndex < Questions.length - 1) {
        nextQuestion()
    } else {
        alert("Quiz completed!");
    }
}

// Function to load the next question
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < Questions.length) {
        loadQuestion();
    } else {
        alert("You've completed the quiz!");
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
}

export function confirmquizButtonFunction() {
    instructionModel.style.display = 'none';
    instructionsConfirmed = true; // listener to display instructions once user confirms
    quizInterface.classList.remove('blurred'); // Remove the blur
    loadQuestion()
}
export function QuizfirstOpenFunction() {
    instructionModel.style.display = 'flex'; //working
    quizInterface.classList.add('blurred'); // Apply the blur
}



