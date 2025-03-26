console.log('introController.js loaded');
import { profileInfo, closeProfileFunction } from '../controllers/profileController.js';

const instructionModel = document.getElementById('instructions-intro'); // Instruction model
let currentPage = 0; // Track the current page of the model

const prevIntroButton = document.getElementById('intro-prev-button');
const nextIntroButton = document.getElementById('intro-next-button');
const confirmIntroButton = document.getElementById('intro-confirm-button');
const profileArrow = document.getElementById('profile-arrow')

const desktopArea = document.getElementById('desktop-area');
const profileArea = document.getElementById('profile-container');
const taskbar = document.getElementById('taskbar');

const emailArrow = document.getElementById('email-arrow');
const passwordArrow = document.getElementById('password-arrow');
const webArrow = document.getElementById('web-arrow');

// Pages content
const pages = [
    {
        title: `Welcome to GuardPoint`,
        content: `
            🛡️ This exercise will help you improve your skills in creating strong passwords while also ensuring your current passwords are not compromised.
        `
    },
    {
        title: "🎯 Your Task:",
        content: `
        🔍 <strong>Check a password you currently use</strong> to see if it has appeared in any data breaches.<br>
        🏗️ <strong>Create a new, strong password</strong> that follows security best practices.<br>
        ✅ <strong>Ensure your new password</strong> has not appeared in any breaches before completing the challenge.<br><br>
        `
    },
    {
        title: "🎯 EDIT PROFILE HERE:",
        content: `
        ✅ <strong>Ensure your new password</strong> has not appeared in any breaches before completing the challenge.<br><br>
        `
    }
];

export function initialiseIntro() {
    desktopArea.classList.add("disabled");
    profileArea.classList.add("disabled");
    taskbar.classList.add("disabled");

    instructionModel.style.display = 'flex'; //working
    desktopArea.classList.add('blurred'); // Apply the blur
    updateModelContent()
}



//update the model content based on the current page
export function updateModelContent() {
    //disable home arrows
    emailArrow.style.display = 'none' //hide arrow
    passwordArrow.style.display = 'none' //hide arrow
    webArrow.style.display = 'none' //hide arrow

    console.log(currentPage)
    const titleElement = instructionModel.querySelector('h2');
    const contentElement = instructionModel.querySelector('p');

    if (currentPage == 2) {
        profileArrow.style.display = 'block' //show arrow
        profileInfo()
    } else {
        profileArrow.style.display = 'none' //hide arrow
        closeProfileFunction()
    }

    // Update title and content
    titleElement.textContent = pages[currentPage].title;
    contentElement.innerHTML = pages[currentPage].content;

    // Manage button visibility
    prevIntroButton.classList.toggle('hidden', currentPage === 0);
    nextIntroButton.classList.toggle('hidden', currentPage === pages.length - 1);
    confirmIntroButton.classList.toggle('hidden', currentPage !== pages.length - 1);
}

export function confirmintroButtonFunction() {
    //hide profile and arrow
    closeProfileFunction()
    profileArrow.style.display = 'none' //hide arrow

    instructionModel.style.display = 'none';
    desktopArea.classList.remove('blurred'); // Remove the blur

    //enable home arrows
    emailArrow.style.display = 'block';
    passwordArrow.style.display = 'block';
    webArrow.style.display = 'block';

    //enable divs
    desktopArea.classList.remove("disabled");
    profileArea.classList.remove("disabled");
    taskbar.classList.remove("disabled");

}

export function prevIntroButtonFunction() {
    if (currentPage > 0) {
        currentPage--;
        updateModelContent();
    }
}

export function nextIntroButtonFunction() {
    if (currentPage < pages.length - 1) {
        currentPage++;
        updateModelContent();
    }
}