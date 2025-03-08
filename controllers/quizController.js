console.log('quizController.js loaded');
const desktopArea = document.getElementById('desktop-area');
const leavetaskModel = document.getElementById('leave-quiz')
const profileContainer = document.getElementById('profile-container');
const quizContainer = document.getElementById('quiz-container');

export function closeQuizFunction() {
    leavetaskModel.style.display = 'flex'; //working
    desktopArea.classList.add('blurred'); // Apply the blur
}

export function backquizFunction() {
    leavetaskModel.style.display = 'none';
    desktopArea.classList.remove('blurred'); // remove the blur
}

export function resetQuiz() {
    leavetaskModel.style.display = 'none';
    desktopArea.classList.remove('blurred');
}

export function confirmquizFunction() {
    desktopArea.classList.remove('blurred'); // remove the blur
    closeQuiz()
}

function closeQuiz() {
    quizContainer.style.display = 'none';
    desktopArea.style.display = 'flex';
}