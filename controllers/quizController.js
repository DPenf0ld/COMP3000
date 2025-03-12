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
        value: "3", //this is the correct answer
        question: "Question 1" ,
        Answer1:"This is answer 1" ,
        Answer2:"This is answer 2",
        Answer3:"This is answer 3" ,
        Answer4:"This is answer 4" 
    },
    {
        value: "4", //this is the correct answer
        question: "Question 2" ,
        Answer1:"This is answer 1" ,
        Answer2:"This is answer 2",
        Answer3:"This is answer 3" ,
        Answer4:"This is answer 4" 
    },
    {
        value: "1", //this is the correct answer
        question: "Question 3" ,
        Answer1:"This is answer 1" ,
        Answer2:"This is answer 2",
        Answer3:"This is answer 3" ,
        Answer4:"This is answer 4" 
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
        document.getElementById("next-quiz").style.display = "block";
    } else {
        alert("Quiz completed!");
    }
}

// Function to load the next question
export function nextQuestion() {
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
}
export function QuizfirstOpenFunction() {
    instructionModel.style.display = 'flex'; //working
    quizInterface.classList.add('blurred'); // Apply the blur
}



