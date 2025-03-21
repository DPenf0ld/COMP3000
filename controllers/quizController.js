console.log('quizController.js loaded');
import { confirmphishingFunction } from '../controllers/phishingController.js';
import { confirmpasswordFunction } from '../controllers/passwordController.js';
import { confirmwebFunction } from '../controllers/webController.js';

export let quizOpen = false;

const desktopArea = document.getElementById('desktop-area');
const leavetaskModel = document.getElementById('leave-quiz')
const resetModel = document.getElementById('reset-quiz-model')
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
let reset=false;


// Quiz Questions 
const Questions = [
    {
        type: "password",
        value: "1",
        question: "What is one of the most important aspects of creating a strong password according to NCSE guidelines?",
        Answer1: "Using at least three random words.",
        Answer2: "Using a single, easily memorable word.",
        Answer3: "Choosing the longest possible password.",
        Answer4: "Including your date of birth for uniqueness."
    },
    {
        type: "phishing",
        value: "4",
        question: "You receive an email from 'support@secure-payments.com' asking you to confirm your bank details. What should you do first?",
        Answer1: "Click the link and verify the request with your bank",
        Answer2: "Reply to the email asking for more details",
        Answer3: "Ignore the email since all support emails are scams",
        Answer4: "Hover over the sender's email and any links to check for inconsistencies"
    },
    {
        type: "web",
        value: "3",
        question: "What does it mean if a website uses HTTPS but still seems suspicious?",
        Answer1: "It is definitely safe to enter your personal information.",
        Answer2: "HTTPS indicates the site is part of an official organisation.",
        Answer3: "HTTPS provides encryption but doesn’t guarantee the site’s legitimacy.",
        Answer4: "If the site uses HTTPS, it can’t be malicious."
    },
    {
        type: "password",
        value: "3",
        question: "What makes credential stuffing such a dangerous attack method?",
        Answer1: "It relies on guessing passwords manually.",
        Answer2: "It uses social engineering to trick users into sharing passwords.",
        Answer3: "It uses previously breached passwords to attack multiple websites at once.",
        Answer4: "It requires a password manager to be successful."
    },
    {
        type: "web",
        value: "1",
        question: "Why is it important to avoid clicking on pop-ups that appear while browsing the web?",
        Answer1: "They can redirect you to malicious websites or install malware.",
        Answer2: "They often contain important announcements from trusted websites.",
        Answer3: "They typically provide discounts or offers from legitimate sources.",
        Answer4: "They are secure if they appear after entering a trusted website."
    },
    {
        type: "phishing",
        value: "3",
        question: "Which of the following is an example of Clone Phishing?",
        Answer1: "An email from an unknown sender offering a free prize",
        Answer2: "An email pretending to be from your bank with a fake warning",
        Answer3: "An email that looks identical to a legitimate one but has modified links or attachments",
        Answer4: "A phishing email that targets a high-profile individual"
    },
    {
        type: "password",
        value: "4",
        question: "Why is it risky to use the same password across multiple accounts?",
        Answer1: "It makes the password easier to remember.",
        Answer2: "It ensures you don’t forget the password.",
        Answer3: "It increases the likelihood of attackers accessing all your accounts if one password is breached.",
        Answer4: "It guarantees better password strength since it's reused."
    },
    {
        type: "web",
        value: "3",
        question: "What is the primary reason attackers use fake login pages in phishing attempts?",
        Answer1: "To provide users with discounts or benefits.",
        Answer2: "To inform users about a potential issue with their account.",
        Answer3: "To collect personal credentials and use them for malicious purposes.",
        Answer4: "To redirect users to a genuine login page."
    },
    {
        type: "phishing",
        value: "2",
        question: "A co-worker receives an email from IT Support requesting their password to 'fix a system issue.' What should they do?",
        Answer1: "Reply with their password since it’s from IT",
        Answer2: "Verify with IT through an official contact method before responding",
        Answer3: "Ignore the email since all IT emails are scams",
        Answer4: "Forward the email to their manager and continue working"
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
        type: "password",
        value: "3",
        question: "How can using a password manager improve security?",
        Answer1: "It allows users to remember all their passwords easily.",
        Answer2: "It stores passwords in an unencrypted format for convenience.",
        Answer3: "It generates strong, random passwords and stores them securely.",
        Answer4: "It makes passwords easier to crack by reducing complexity."
    },
    {
        type: "phishing",
        value: "1",
        question: "What is a common sign that an email is a Deceptive Phishing attempt?",
        Answer1: "A generic greeting such as 'Dear Customer' instead of your actual name",
        Answer2: "An email from a service you recognize",
        Answer3: "A message confirming a recent purchase you made",
        Answer4: "A professional tone with no spelling errors"
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
        type: "phishing",
        value: "3",
        question: "Which of the following best describes a Spear Phishing attack?",
        Answer1: "A general scam email sent to thousands of random people",
        Answer2: "A fake email from a bank warning about a security breach",
        Answer3: "A personalised scam email that includes your name and personal details to gain your trust",
        Answer4: "An email that looks identical to a real one but contains hidden malware"
    },
    {
        type: "password",
        value: "2",
        question: "Why is it important to regularly update your passwords, even if no breach has occurred?",
        Answer1: "It improves the password's strength and makes it harder to remember.",
        Answer2: "It helps reduce the risk of your password being exposed through future breaches.",
        Answer3: "It ensures that your password is always stored in an encrypted format.",
        Answer4: "It makes the password more difficult to guess by attackers."
    }
];





export function loadQuestion() {
    // update progress bar
    const progress = (currentQuestionIndex / 15) * 100;
    progressBar.style.width = `${progress}%`;

    quizOpen = true;
    let questionData = Questions[currentQuestionIndex];

    // Update the results text
    document.getElementById('quiz-counter').innerHTML = `
        Question ${currentQuestionIndex+1}/15 <br><br>
    `;
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
        createChart();
    }
}

function createChart() {
    reset=false;

    const quizBox = document.querySelector('.quiz-multiplechoice-box');
    quizBox.style.display = 'none';  // Hide only the quiz

    document.getElementById('quiz-counter').style.display = 'none';
    progressBar.style.width = `100%`;

    let phishingResult = false;
    let passwordResult = false;
    let webResult = false;

    document.getElementById('results-header').style.display = 'block';
    document.getElementById('results-task-header').style.display = 'block';
    document.getElementById('pass/fail-header').style.display = 'block';
    document.getElementById('reset-quiz').style.display = 'block';

    const totalCorrect = phishingCorrect + passwordCorrect + webCorrect;
    const percentage = ((totalCorrect / 15) * 100).toFixed(2); // Round to 2 decimal places
    localStorage.setItem('currentPercentage', percentage);

    // Update the results text
    document.getElementById('quiz-results-text').innerHTML = `
        Phishing questions correct: ${phishingCorrect}/5 <br><br>
        Password questions correct: ${passwordCorrect}/5 <br><br>
        Web questions correct: ${webCorrect}/5 <br><br>
        <strong>Overall Score:</strong> ${totalCorrect}/15 <br><br>
        <strong>Percentage:</strong> ${percentage}%
    `;

    if (phishingCorrect >= 3) {
        phishingResult = true;
        document.getElementById('phishing-result').innerHTML = `<span style="color: green; font-weight: bold;">Phishing task passed ✅</span>`;
    } else {
        document.getElementById('phishing-result').innerHTML = `<span style="color: red; font-weight: bold;">Phishing task failed ❌</span>`;
        document.getElementById('email-redo').style.display = 'block';
    }

    if (passwordCorrect >= 3) {
        passwordResult = true;
        document.getElementById('password-result').innerHTML = `<span style="color: green; font-weight: bold;">Password task passed ✅</span>`;
    } else {
        document.getElementById('password-result').innerHTML = `<span style="color: red; font-weight: bold;">Password task failed ❌</span>`;
        document.getElementById('password-redo').style.display = 'block';
    }

    if (webCorrect >= 3) {
        webResult = true;
        document.getElementById('web-result').innerHTML = `<span style="color: green; font-weight: bold;">Web task passed ✅</span>`;
    } else {
        document.getElementById('web-result').innerHTML = `<span style="color: red; font-weight: bold;">Web task failed ❌</span>`;
        document.getElementById('web-redo').style.display = 'block';
    }

    // Check if all tasks are passed
    if (webResult && passwordResult && phishingResult) {
        document.getElementById('pass/fail-text').innerHTML = `<span style="color: green; font-weight: bold;">Congratulations! You passed all tasks 🎉</span>`;
        const quizIcon = document.querySelector("#Quiz img");
        if (quizIcon) {
            quizIcon.src = "assets/icons/quiz-tick-icon.png";
        }
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
    sendQuizResults()
}

export function failedTasks() {
    if (quizOpen) {
        confirmquizFunction();
    }
    if (quizComplete) {
        if (phishingCorrect < 3) {
            confirmphishingFunction()
            quizComplete = false;
        }

        if (passwordCorrect < 3) {
            confirmpasswordFunction()
            quizComplete = false;
        }

        if (webCorrect < 3) {
            confirmwebFunction()
            quizComplete = false;
        }
    }
}


// Function to load the next question
function nextQuestion() {
    currentQuestionIndex++;

    // update progress bar
    const progress = (currentQuestionIndex / 15) * 100;
    progressBar.style.width = `${progress}%`;


    if (currentQuestionIndex < Questions.length) {
        loadQuestion();
    }
}

//reset quiz
export function resetQuizFunction() {
    resetModel.style.display = 'flex'; //working
    quizInterface.classList.add('blurred'); // Apply the blur
}

export function resetbackquizFunction() {
    resetModel.style.display = 'none';
    quizInterface.classList.remove('blurred'); // remove the blur
}

export function resetconfirmquizFunction() {
    quizInterface.classList.remove('blurred'); // remove the blur
    resetModel.style.display = 'none';

    quizComplete = false;
    reset=true;

    const quizIcon = document.querySelector("#Quiz img");
    if (quizIcon) {
        quizIcon.src = "assets/icons/quiz.png";
    }


    QuizfirstOpenFunction()
}


//Leave quiz code

export function closeQuizFunction() {
    if (quizComplete) {
        confirmquizFunction()
    } else {
        leavetaskModel.style.display = 'flex'; //working
        quizInterface.classList.add('blurred'); // Apply the blur
    }
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
    quizOpen = true;

    if (pieCreated) {
        const oldPiechart = document.getElementById('pieChart');
        oldPiechart.remove(); // NEED CODE TO DELETE THE OLD PIE CHART
    }

    pieCreated=false;

    // Hide results and buttons
    document.getElementById('results-header').style.display = 'none';
    document.getElementById('results-task-header').style.display = 'none';
    document.getElementById('pass/fail-header').style.display = 'none';
    document.getElementById('email-redo').style.display = 'none';
    document.getElementById('password-redo').style.display = 'none';
    document.getElementById('web-redo').style.display = 'none';
    document.getElementById('reset-quiz').style.display = 'none';

    // Clear results text
    document.getElementById('quiz-results-text').innerHTML = '';
    document.getElementById('phishing-result').innerHTML = '';
    document.getElementById('password-result').innerHTML = '';
    document.getElementById('web-result').innerHTML = '';
    document.getElementById('pass/fail-text').innerHTML = '';

    const quizBox = document.querySelector('.quiz-multiplechoice-box');
    quizBox.style.display = 'block';  // unhide

    document.getElementById('quiz-counter').style.display = 'block';

    const quizResults = JSON.parse(localStorage.getItem('quizscores')) || {};

    if (quizComplete) {
        createChart()
    } else if (quizResults.percentage >= 70 && !reset) {
        phishingCorrect = quizResults.phishingCorrect;
        passwordCorrect = quizResults.passwordCorrect;
        webCorrect = quizResults.webCorrect;
        createChart()
    }
    else {
        currentQuestionIndex = 0; //reset question number
        phishingCorrect = 0;
        webCorrect = 0;
        passwordCorrect = 0;
        instructionModel.style.display = 'flex'; //working
        quizInterface.classList.add('blurred'); // Apply the blur
    }
}


export async function sendQuizResults() {

    const quizscores = JSON.parse(localStorage.getItem('quizscores')) || {};
    const percentage = localStorage.getItem('currentPercentage');
    const userEmail = localStorage.getItem('userEmail');

    if (Number(percentage) > Number(quizscores.percentage) || quizscores.percentage == 0) {  //not working, must turn to int
        try {
            const response = await fetch('/update-scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                    phishingCorrect,
                    passwordCorrect,
                    webCorrect,
                    percentage
                }),
            });

            // Update localStorage with new scores
            localStorage.setItem('quizscores', JSON.stringify({
                phishingCorrect,
                passwordCorrect,
                webCorrect,
                percentage
            }));

            if (!response.ok) { //error handling
                throw new Error(await response.text());
            }

        } catch (error) {
            console.log(error.message || 'Failed to update quiz scores.');
        }

    }
}



