import { updateClock } from '../controllers/clockController.js';
import { passwordCompleteFunction, checkPasswordStrength, togglePasswordInput, checkButtonFunction, confirmpasswordButtonFunction } from '../controllers/passwordController.js';
import { askButtonFunction, webComplete, webCompleteFunction } from '../controllers/webController.js';
import { submitButtonFunction, backToDesktopPhishing, enableHighlighting, reminder, displayEmail,  confirmButtonFunction, firstOpenFunction, prevButtonFunction, nextButtonFunction  } from '../controllers/phishingController.js';



document.addEventListener('DOMContentLoaded', function () {

    let passwordtaskComplete = true; //SET TO TRUE SO ANYTHING CAN BE OPEN, FIX TO GET REAL VARIABLE FROM PASSWORDCONTROLLER.JS
    let passwordopen = false;
    let webopen = false;
    let emailopen = false;


    const prevButton = document.getElementById('prev-button');
    let FirstOpenPassword = true; // Track if password exercise is opened for the first time

    const emailIconDesktop = document.getElementById('email-icon');        // Icon for email on desktop
    const emailIconTaskbar = document.getElementById('taskbar-email');     // Icon for email on taskbar
    const emailIconProgress = document.getElementById('progress-email');     // Icon for email on progress tracker

    const passwordIconDesktop = document.getElementById('password-icon');        // Icon for password on desktop
    const passwordIconTaskbar = document.getElementById('taskbar-password');     // Icon for password on taskbar
    const passwordIconProgress = document.getElementById('progress-password');     // Icon for password on progress tracker

    const webIconDesktop = document.getElementById('web-icon');        // Icon for web on desktop
    const webIconTaskbar = document.getElementById('taskbar-web');     // Icon for web on taskbar
    const webIconProgress = document.getElementById('progress-web');     // Icon for web on progress tracker

    let emailtaskComplete = false;
    let webtaskComplete = false;

    const confirmpasswordButton = document.getElementById('confirm-password-button');
    confirmpasswordButton.addEventListener('click', confirmpasswordButtonFunction);

    const checkButton = document.getElementById('checkButton');
    checkButton.addEventListener('click', checkButtonFunction);

    //openai code
    const askButton = document.getElementById('ask-button');
    askButton.addEventListener('click', askButtonFunction);

    //password code
    const instructionPasswordModel = document.getElementById('instructions-password'); // Instruction model
    const passwordContainer = document.getElementById('password-container');
    const passwordContainerBlur = document.getElementById('password-interface');
    let passwordInput = document.getElementById('password');

    //web code
    const webCompleteButton = document.getElementById('CompleteWeb');
    webCompleteButton.addEventListener('click', webComplete);


    //email code
    const inboxContainer = document.getElementById('inbox-container');     // Inbox container
    const nextButton = document.getElementById('next-button');
    const confirmButton = document.getElementById('confirm-button');
    let isFirstOpen = true; // Track if inbox is opened for the first time

    //web code
    const webContainer = document.getElementById('web-container');











    //Desktop code
    const desktopArea = document.getElementById('desktop-area');           // Desktop area
    const backToDesktop = document.getElementById('close-inbox');      // Button or link to return to desktop
    const backToDesktopPassword = document.getElementById('close-password');
    backToDesktopPassword.addEventListener('click', passwordCompleteFunction);
    
    const backToDesktopWeb = document.getElementById('close-web');
    backToDesktopWeb.addEventListener('click', webCompleteFunction);









    //PHISHING EXERCISE CODE 
    //
    //
    //
    //
    //




    // Add event listeners 
    prevButton.addEventListener('click', prevButtonFunction);

    nextButton.addEventListener('click', nextButtonFunction);

    confirmButton.addEventListener('click', confirmButtonFunction);

    // Toggle inbox code
    function toggleInbox() {
        if (inboxContainer.style.display === 'block' && emailtaskComplete == true) { //closes inbox
            emailopen = false;
            // If inbox is currently displayed, hide it and show desktop
            inboxContainer.style.display = 'none';
            desktopArea.style.display = 'flex';
        } else if ((passwordopen != true && webtaskComplete) || (webopen != true && passwordtaskComplete) || (webtaskComplete && passwordtaskComplete) || (webopen != true && passwordopen != true)) { //opens inbox 
            emailopen = true;

            // If inbox is not displayed, show it and hide desktop
            inboxContainer.style.display = 'block';
            passwordContainer.style.display = 'none'
            webContainer.style.display = 'none'
            desktopArea.style.display = 'none';

            // Show instructions if it's the first time opening the inbox
            if (isFirstOpen) {
                isFirstOpen = false;
                firstOpenFunction()
            }
        }
    }

    // Toggle inbox on desktop and taskbar
    emailIconDesktop.addEventListener('click', toggleInbox);
    emailIconTaskbar.addEventListener('click', toggleInbox);
    emailIconProgress.addEventListener('click', toggleInbox);

    // Go back to the desktop
    backToDesktop.addEventListener('click', backToDesktopPhishing);


    //display emails
    let currentEmailIndex = 0;

    

    




    // Initial display
    displayEmail(currentEmailIndex);







    







    const emailBodyElement = document.querySelector('.email-body');
    const emailSubjectElement = document.querySelector('.email-subject-line');
    const submitButton = document.getElementById('submit-highlight');

    

    // Enable highlighting for both the email body and subject
    enableHighlighting(emailBodyElement);
    enableHighlighting(emailSubjectElement);

    // Handle submission when the submit button is clicked
    submitButton.addEventListener('click', submitButtonFunction);



    //function to bring back information

    // Listen for info to be clicked
    document.getElementById('reminder').addEventListener('click', reminder);

    



    

    //PASSWORD EXERCISE CODE 
    function togglePassword() {
        if (passwordContainer.style.display === 'block' && passwordtaskComplete == true) {
            passwordopen = false;
            passwordContainer.style.display = 'none';
            desktopArea.style.display = 'flex';
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

    // Toggle inbox on desktop and taskbar
    passwordIconDesktop.addEventListener('click', togglePassword);
    passwordIconTaskbar.addEventListener('click', togglePassword);
    passwordIconProgress.addEventListener('click', togglePassword);

    passwordInput.addEventListener('input', function (event) {
        checkPasswordStrength(event.target.value);
    });

    //SAFE WEB BROWSING EXERCISE CODE 

    // Toggle inbox on desktop and taskbar
    webIconDesktop.addEventListener('click', toggleWeb);
    webIconTaskbar.addEventListener('click', toggleWeb);
    webIconProgress.addEventListener('click', toggleWeb);

    // Toggle web code
    function toggleWeb() {
        if (webContainer.style.display === 'block' && webtaskComplete == true) {
            webopen = false;
            // If inbox is currently displayed, hide it and show desktop
            webContainer.style.display = 'none';
            desktopArea.style.display = 'flex';
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