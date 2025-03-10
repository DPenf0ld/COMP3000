console.log('quizController.js loaded');
const desktopArea = document.getElementById('desktop-area');
const leavetaskModel = document.getElementById('leave-quiz')
const profileContainer = document.getElementById('profile-container');
const quizContainer = document.getElementById('quiz-container');
const quizInterface = document.getElementById('quiz-interface')

export function closeQuizFunction() {
    leavetaskModel.style.display = 'flex'; //working
    quizInterface.classList.add('blurred'); // Apply the blur
}

export function backquizFunction() {
    leavetaskModel.style.display = 'none';
    quizInterface.classList.remove('blurred'); // remove the blur
}

export function confirmquizFunction() {
    quizInterface.classList.remove('blurred'); // remove the blur
    quizContainer.style.display = 'none';
    desktopArea.style.display = 'flex'
}


