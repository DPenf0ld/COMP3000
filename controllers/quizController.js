console.log('quizController.js loaded');

export let quizOpen = false;

const desktopArea = document.getElementById('desktop-area');
const leavetaskModel = document.getElementById('leave-quiz')
const quizContainer = document.getElementById('quiz-container');
const quizInterface = document.getElementById('quiz-interface')
const instructionModel = document.getElementById('instructions-quiz');

let instructionsConfirmed = false;
let currentQuestionIndex = 0;
let phishingCorrect = 0;
let webCorrect = 0;
let passwordCorrect = 0;


document.getElementById('results-header').style.display = 'none';
document.getElementById('results-task-header').style.display = 'none';
document.getElementById('pass/fail-header').style.display = 'none';

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
        document.getElementById('phishing-result').innerHTML = `<span style="color: green;">Phishing task passed ✅</span>`;
    } else {
        document.getElementById('phishing-result').innerHTML = `<span style="color: red;">Phishing task failed ❌</span>`;
    }
    
    if (passwordCorrect >= 7) {
        passwordResult = true;
        document.getElementById('password-result').innerHTML = `<span style="color: green;">Password task passed ✅</span>`;
    } else {
        document.getElementById('password-result').innerHTML = `<span style="color: red;">Password task failed ❌</span>`;
    }
    
    if (webCorrect >= 7) {
        webResult = true;
        document.getElementById('web-result').innerHTML = `<span style="color: green;">Web task passed ✅</span>`;
    } else {
        document.getElementById('web-result').innerHTML = `<span style="color: red;">Web task failed ❌</span>`;
    }
    
    // Check if all tasks are passed
    if (webResult && passwordResult && phishingResult) {
        document.getElementById('pass/fail-text').innerHTML = `<span style="color: green; font-weight: bold;">Congratulations! You passed all tasks 🎉</span>`;
    } else {
        document.getElementById('pass/fail-text').innerHTML = `<span style="color: red; font-weight: bold;">You did not pass all tasks. Try again! 🔄</span>`;
    }
    


    new Chart("pieChart", {
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
    currentQuestionIndex = 0; //reset question number
    phishingCorrect = 0;
    webCorrect = 0;
    passwordCorrect = 0;
    instructionModel.style.display = 'flex'; //working
    quizInterface.classList.add('blurred'); // Apply the blur
}



