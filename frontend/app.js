import { updateClock } from '../controllers/clockController.js';
import { closePassword, passwordCompleteFunction, checkPasswordStrength, togglePasswordInput, checkButtonFunction, confirmpasswordButtonFunction } from '../controllers/passwordController.js';
import { closeWeb, askButtonFunction, webComplete, webCompleteFunction } from '../controllers/webController.js';
import { closeInbox, submitButtonFunction, backToDesktopPhishing, enableHighlighting, reminder, displayEmail, confirmButtonFunction, firstOpenFunction, prevButtonFunction, nextButtonFunction } from '../controllers/phishingController.js';



document.addEventListener('DOMContentLoaded', function () {
    //Sets each task to not open
    let passwordopen = false;
    let webopen = false;
    let emailopen = false;

    //Email Icons
    const emailIconDesktop = document.getElementById('email-icon');
    emailIconDesktop.addEventListener('click', toggleInbox);

    const emailIconTaskbar = document.getElementById('taskbar-email');
    emailIconTaskbar.addEventListener('click', toggleInbox);

    const emailIconProgress = document.getElementById('progress-email');
    emailIconProgress.addEventListener('click', toggleInbox);

    //Password Icons
    const passwordIconDesktop = document.getElementById('password-icon');
    passwordIconDesktop.addEventListener('click', togglePassword);

    const passwordIconTaskbar = document.getElementById('taskbar-password');
    passwordIconTaskbar.addEventListener('click', togglePassword);

    const passwordIconProgress = document.getElementById('progress-password');
    passwordIconProgress.addEventListener('click', togglePassword);

    //Web Icons
    const webIconDesktop = document.getElementById('web-icon');
    webIconDesktop.addEventListener('click', toggleWeb);

    const webIconTaskbar = document.getElementById('taskbar-web');
    webIconTaskbar.addEventListener('click', toggleWeb);

    const webIconProgress = document.getElementById('progress-web');
    webIconProgress.addEventListener('click', toggleWeb);

    //Tasks Completion Trackers
    let emailtaskComplete = false;
    let passwordtaskComplete = false;
    let webtaskComplete = false;

    //Tracks if each task is opened for the first time
    let isFirstOpen = true; //email
    let FirstOpenPassword = true;
    let FirstOpenWeb = true;

    //Desktop code
    const desktopArea = document.getElementById('desktop-area');

    const backToDesktop = document.getElementById('close-inbox');
    backToDesktop.addEventListener('click', backToDesktopPhishing);

    const backToDesktopPassword = document.getElementById('close-password');
    backToDesktopPassword.addEventListener('click', passwordCompleteFunction);

    const backToDesktopWeb = document.getElementById('close-web');
    backToDesktopWeb.addEventListener('click', webCompleteFunction);

    //Phishing Task Code


    const inboxContainer = document.getElementById('inbox-container');

    const reminderemail = document.getElementById('reminder');
    reminderemail.addEventListener('click', reminder);

    const prevButton = document.getElementById('prev-button');
    prevButton.addEventListener('click', prevButtonFunction);

    const nextButton = document.getElementById('next-button');
    nextButton.addEventListener('click', nextButtonFunction);

    const confirmButton = document.getElementById('confirm-button');
    confirmButton.addEventListener('click', confirmButtonFunction);

    const emailBodyElement = document.querySelector('.email-body');
    enableHighlighting(emailBodyElement);

    const emailSubjectElement = document.querySelector('.email-subject-line');
    enableHighlighting(emailSubjectElement);
    
    const submitButton = document.getElementById('submit-highlight');
    submitButton.addEventListener('click', submitButtonFunction);

    // Toggle inbox code
    function toggleInbox() {
        displayEmail();
        if (inboxContainer.style.display === 'block') { //closes inbox
            closeInbox()
        } else  { //opens inbox 
            emailopen = true;

            // If inbox is not displayed, show it and hide desktop
            inboxContainer.style.display = 'block';
            passwordContainer.style.display = 'none';
            webContainer.style.display = 'none';
            desktopArea.style.display = 'none';

            // Show instructions if it's the first time opening the inbox
            if (isFirstOpen) {
                isFirstOpen = false;
                firstOpenFunction()
            }
        }
    }

    //Password Task Code
    const instructionPasswordModel = document.getElementById('instructions-password');
    const passwordContainer = document.getElementById('password-container');
    const passwordContainerBlur = document.getElementById('password-interface');
    let passwordInput = document.getElementById('password');

    const confirmpasswordButton = document.getElementById('confirm-password-button');
    confirmpasswordButton.addEventListener('click', confirmpasswordButtonFunction);

    const checkButton = document.getElementById('checkButton');
    checkButton.addEventListener('click', checkButtonFunction);

    //toggle password code
    function togglePassword() {
        if (passwordContainer.style.display === 'block') {
            closePassword()

        } else if ((emailopen != true && webtaskComplete) || (webopen != true && emailtaskComplete) || (webtaskComplete && emailtaskComplete) || (webopen != true && emailopen != true)) {
            passwordopen = true;
            passwordContainer.style.display = 'block';
            inboxContainer.style.display = 'none';
            webContainer.style.display = 'none'
            desktopArea.style.display = 'none';
        }

        // Show instructions if it's the first time opening
        if (FirstOpenPassword) {
            instructionPasswordModel.style.display = 'flex'; //working
            passwordContainerBlur.classList.add('blurred'); // Apply the blur
            FirstOpenPassword = false;
            togglePasswordInput();
        }
    }

    passwordInput.addEventListener('input', function (event) {
        checkPasswordStrength(event.target.value);
    });

    //web code
    const webContainer = document.getElementById('web-container');
    const webCompleteButton = document.getElementById('CompleteWeb');
    webCompleteButton.addEventListener('click', webComplete);

    //toggle web task
    function toggleWeb() {
        if (webContainer.style.display === 'block') {
            closeWeb()
        } else if ((passwordopen != true && emailtaskComplete) || (emailopen != true && passwordtaskComplete) || (emailtaskComplete && passwordtaskComplete) || (emailopen != true && passwordopen != true)) {
            webopen = true;

            // If inbox is not displayed, show it and hide desktop
            webContainer.style.display = 'block';
            passwordContainer.style.display = 'none'
            inboxContainer.style.display = 'none'
            desktopArea.style.display = 'none';

            // Show instructions if it's the first time opening the inbox
            //   if (isFirstOpen) {
            //      instructionModel.style.display = 'flex'; //working
            //     emailContainer.classList.add('blurred'); // Apply the blur
            //      isFirstOpen = false;
            //  }
        }
    }

    //openai code - web Task
    const askButton = document.getElementById('ask-button');
    askButton.addEventListener('click', askButtonFunction);
});

// Call clock function and update every second
setInterval(updateClock, 1000);
updateClock();

const userEmail = localStorage.getItem('userEmail'); // Retrieve the email from localStorage
if (userEmail) {
    const emailElement = document.getElementById('email');
    emailElement.innerText = userEmail; // Set the email to the div
} else {
    console.log('User email not found');
} 