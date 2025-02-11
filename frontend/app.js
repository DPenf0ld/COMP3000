import { updateClock } from '../controllers/clockController.js';
import { closeProfileFunction, profileInfo } from '../controllers/profileController.js';
import { ConfirmLogOut, BackLogOutFunction, LogOutFunction } from '../controllers/LogOutController.js';
import { check2Function, prevPasswordButtonFunction, nextPasswordButtonFunction, passwordPreviouslyComplete, passwordComplete, resetPasswordFromDesktop, initialisePassword, confirmpasswordFunction, backpasswordFunction, setPasswordOpen, passwordopen, passwordtaskComplete, closePassword, passwordCompleteFunction, checkPasswordStrength, togglePasswordInput, checkButtonFunction, confirmpasswordButtonFunction } from '../controllers/passwordController.js';
import { webPreviouslyComplete, resetWebFromDesktop, initialiseWeb, confirmwebButtonFunction, webfirstOpenFunction, confirmwebFunction, backwebFunction, setWebOpen, webtaskComplete, webopen, closeWeb, askButtonFunction, webComplete, webCompleteFunction } from '../controllers/webController.js';
import { preloademails, emailPreviouslyComplete, emailComplete, resetEmailFromDesktop, initialiseEmail, confirmphishingFunction, backphishingFunction, setEmailOpen, emailtaskComplete, emailopen, closeInbox, submitButtonFunction, backToDesktopPhishing, enableHighlighting, reminder, displayEmail, confirmButtonFunction, firstOpenFunction, prevButtonFunction, nextButtonFunction } from '../controllers/phishingController.js';



document.addEventListener('DOMContentLoaded', function () {
    preloademails()
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};

    if (tasks.passwordtaskComplete) {
        passwordPreviouslyComplete() //password task
    }
    if (tasks.webtaskComplete) {
        webPreviouslyComplete() //web task
    }
    if (tasks.emailtaskComplete) {
        emailPreviouslyComplete() //email task
    }

    //Profile
    const profileInfoButton = document.getElementById('email');
    profileInfoButton.addEventListener('click', profileInfo);

    const profileContainer = document.getElementById('profile-container');


    const closeProfile = document.getElementById('close-profile');
    closeProfile.addEventListener('click', closeProfileFunction);

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

    //Tracks if each task is opened for the first time
    let isFirstOpen = true; //email
    let FirstOpenPassword = true;
    let FirstOpenWeb = true;

    //Desktop code
    const desktopArea = document.getElementById('desktop-area');

    const backLogOut = document.getElementById('backLogOut-button');
    backLogOut.addEventListener('click', BackLogOutFunction);

    const confirmLogout = document.getElementById('confirmLogout-button');
    confirmLogout.addEventListener('click', ConfirmLogOut);

    const LogOut = document.getElementById('LogoutButton');
    LogOut.addEventListener('click', LogOutFunction);

    //Reset Tasks
    const ResetEmail = document.getElementById('reset-email');
    ResetEmail.addEventListener('click', resetEmailFromDesktop);

    const ResetPassword = document.getElementById('reset-password');
    ResetPassword.addEventListener('click', resetPasswordFromDesktop);

    const ResetWeb = document.getElementById('reset-web');
    ResetWeb.addEventListener('click', resetWebFromDesktop);

    //Phishing Task Code
    const inboxContainer = document.getElementById('inbox-container');

    const backToDesktop = document.getElementById('close-inbox');
    backToDesktop.addEventListener('click', backToDesktopPhishing);

    const backphishingbutton = document.getElementById('backphishing-button');
    backphishingbutton.addEventListener('click', backphishingFunction);

    const confirmphishingbutton = document.getElementById('confirmphishing-button');
    confirmphishingbutton.addEventListener('click', confirmphishingFunction);

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
        profileContainer.style.display = 'none' //hides profile
        initialiseEmail();
        displayEmail();
        if (inboxContainer.style.display === 'block') { //closes inbox
            closeInbox()
        } else if ((passwordopen != true && webtaskComplete) || (webopen != true && passwordtaskComplete) || (webtaskComplete && passwordtaskComplete) || (webopen != true && passwordopen != true)) { //opens inbox 
            setEmailOpen(true);
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
    let passwordInput = document.getElementById('password');

    const instructionPasswordModel = document.getElementById('instructions-password');
    const passwordContainer = document.getElementById('password-container');
    const passwordContainerBlur = document.getElementById('password-interface');

    const backpasswordbutton = document.getElementById('backpassword-button');
    backpasswordbutton.addEventListener('click', backpasswordFunction);



    const confirmpasswordbutton = document.getElementById('confirmpassword-button');
    confirmpasswordbutton.addEventListener('click', confirmpasswordFunction);

    const backToDesktopPassword = document.getElementById('close-password');
    backToDesktopPassword.addEventListener('click', closePassword);

    const prevPasswordButton = document.getElementById('prev-password-button');
    prevPasswordButton.addEventListener('click', prevPasswordButtonFunction);

    const nextPasswordButton = document.getElementById('next-password-button');
    nextPasswordButton.addEventListener('click', nextPasswordButtonFunction);

    const confirmpasswordButton = document.getElementById('confirm-password-button');
    confirmpasswordButton.addEventListener('click', confirmpasswordButtonFunction);

    const checkButton = document.getElementById('checkButton');
    checkButton.addEventListener('click', checkButtonFunction);

    const check2 = document.getElementById('Task2-Check');
    check2.addEventListener('click', check2Function);

    //toggle password code
    function togglePassword() {
        profileContainer.style.display = 'none' //hides profile
        initialisePassword()
        console.log(emailopen)
        console.log(emailtaskComplete)
        if (passwordContainer.style.display === 'block') {
            closePassword()
        } else if ((emailopen != true && webtaskComplete) || (webopen != true && emailtaskComplete) || (webtaskComplete && emailtaskComplete) || (webopen != true && emailopen != true)) {
            setPasswordOpen(true); // Call function to update passwordopen
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

    const backToDesktopWeb = document.getElementById('close-web');
    backToDesktopWeb.addEventListener('click', closeWeb);

    const webCompleteButton = document.getElementById('CompleteWeb');
    webCompleteButton.addEventListener('click', webCompleteFunction);

    const confirmwebButton = document.getElementById('confirm-web-button');
    confirmwebButton.addEventListener('click', confirmwebButtonFunction);

    const backwebbutton = document.getElementById('backweb-button');
    backwebbutton.addEventListener('click', backwebFunction);

    const confirmwebbutton = document.getElementById('confirmweb-button');
    confirmwebbutton.addEventListener('click', confirmwebFunction);

    //toggle web task
    function toggleWeb() {
        profileContainer.style.display = 'none' //hides profile
        if (webContainer.style.display === 'block') {
            closeWeb()
        } else if ((passwordopen != true && emailtaskComplete) || (emailopen != true && passwordtaskComplete) || (emailtaskComplete && passwordtaskComplete) || (emailopen != true && passwordopen != true)) {
            initialiseWeb()
            setWebOpen(true);

            // If inbox is not displayed, show it and hide desktop
            webContainer.style.display = 'block';
            passwordContainer.style.display = 'none'
            inboxContainer.style.display = 'none'
            desktopArea.style.display = 'none';

            // Show instructions if it's the first time opening the inbox
            if (FirstOpenWeb) {
                FirstOpenWeb = false;
                webfirstOpenFunction()
            }
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
const firstName = localStorage.getItem('firstName');
const lastName = localStorage.getItem('lastName');
const dob = localStorage.getItem('dob');


if (userEmail) {
    const emailElement = document.getElementById('email');
    emailElement.innerText = userEmail; // Set the email to the div

    const ProfileEmailElement = document.getElementById('Profile-email');
    ProfileEmailElement.innerText = userEmail; // Set the email to the div

    const ProfileFirstName = document.getElementById('firstName');
    ProfileFirstName.innerText = firstName;

    const ProfileLastName = document.getElementById('lastName');
    ProfileLastName.innerText = lastName;



    const ProfileDob = document.getElementById('dob');

    if (dob) {
        const formattedDob = new Date(dob).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        ProfileDob.innerText = formattedDob; // Display formatted date
    }
} else {
    console.log('User email not found');
} 