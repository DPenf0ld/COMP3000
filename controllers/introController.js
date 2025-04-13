console.log('introController.js loaded');
import { profileInfo, closeProfileFunction } from '../controllers/profileController.js';

const instructionModel = document.getElementById('instructions-intro'); // Instruction model
let currentPage = 0; // Track the current page of the model

const prevIntroButton = document.getElementById('intro-prev-button');
const nextIntroButton = document.getElementById('intro-next-button');
const confirmIntroButton = document.getElementById('intro-confirm-button');

//arrows
const profileArrow = document.getElementById('profile-arrow');
const progressArrow = document.getElementById('progress-arrow');
const progressLogoutArrow = document.getElementById('progress-logout-arrow');

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
            🛡️ <strong>GuardPoint</strong> is your interactive cybersecurity training platform. Complete exercises to improve your online security awareness and track your progress.<br><br>
    
            📌 <strong>Training Modules:</strong><br>
            - 🔐 <strong>Password Training</strong>: Learn to create strong passwords and check their security.<br>
            - 🎣 <strong>Phishing Identification</strong>: Identify different types of phishing attacks and spot red flags.<br>
            - 🌐 <strong>Safe Web Browsing</strong>: Recognise dangerous links and practice secure browsing habits.<br>
        `
    },
    {
        title: "👤 Profile Information:",
        content: `
            ✏️ <strong>Edit your profile</strong> to update your details and manage your account settings.<br>
        `
    },
    {
        title: "📊 Progress Tracker:",
        content: `
            🚀 Your progress is saved automatically after each completed task.<br>
            📌 You must complete all three tasks to unlock the final quiz.<br>
        `
    },
    {
        title: "🚪 Log Out:",
        content: `
            🔒 You can safely log out anytime and your progress will be stored for when you return.<br>
        `
    },
    {
        title: "🎯 Final Quiz:",
        content: `
            📝 The final quiz consists of <strong>15 questions</strong> designed to test your cybersecurity knowledge.<br>
            🎯 You must achieve at least <strong>70%</strong> to pass.<br>
            🔓 The quiz will only be available once you have completed all three tasks.<br>
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

    if (currentPage == 1) {
        profileArrow.style.display = 'block' //show arrow
        profileInfo()

        //hide progress and arrow
        progressArrow.style.display = 'none' //show arrow
        desktopArea.classList.add('blurred'); // Remove the blur

        //hide progress and arrow
        progressLogoutArrow.style.display = 'none' //show arrow
    } else if (currentPage == 2) {
        //hide profile and arrow
        profileArrow.style.display = 'none'
        closeProfileFunction()

        //hide progress and arrow
        progressLogoutArrow.style.display = 'none' //show arrow

        //show progress and arrow
        progressArrow.style.display = 'block' //show arrow
        desktopArea.classList.remove('blurred'); // Remove the blur

    } else if (currentPage == 3) {
        //hide profile and arrow
        profileArrow.style.display = 'none'
        closeProfileFunction()

        //hide progress and arrow
        progressArrow.style.display = 'none' //show arrow

        //show progress and arrow
        progressLogoutArrow.style.display = 'block' //show arrow
        desktopArea.classList.remove('blurred'); // Remove the blur
    }
    else {
        profileArrow.style.display = 'none' //hide arrow
        closeProfileFunction()

        //hide progress and arrow
        progressArrow.style.display = 'none' //show arrow
        desktopArea.classList.add('blurred'); // Remove the blur

        //hide progress and arrow
        progressLogoutArrow.style.display = 'none' //show arrow

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