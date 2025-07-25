import { updateClock } from '../controllers/clockController.js';
import { initialiseIntro, confirmintroButtonFunction, prevIntroButtonFunction, nextIntroButtonFunction } from '../controllers/introController.js';
import { quizPreviouslyComplete, resetconfirmquizFunction, resetbackquizFunction, resetQuizFunction, failedTasks, quizOpen, checkAnswer, loadQuestion, QuizfirstOpenFunction, confirmquizButtonFunction, closeQuizFunction, backquizFunction, confirmquizFunction } from '../controllers/quizController.js';
import { cancelProfileFunction, saveProfileFunction, editProfileFunction, closeProfileFunction, profileInfo } from '../controllers/profileController.js';
import { confirmDeleteFunction, BackdeleteProfileFunction, deleteProfileFunction, ConfirmLogOut, BackLogOutFunction, LogOutFunction } from '../controllers/LogOutController.js';
import { firstOpenPasswordFunction, PasswordHideEnd, check2Function, prevPasswordButtonFunction, nextPasswordButtonFunction, passwordPreviouslyComplete, passwordComplete, resetPasswordFromDesktop, initialisePassword, confirmpasswordFunction, backpasswordFunction, setPasswordOpen, passwordopen, passwordtaskComplete, closePassword, passwordCompleteFunction, checkPasswordStrength, togglePasswordInput, checkButtonFunction, confirmpasswordButtonFunction } from '../controllers/passwordController.js';
import { confirmGameInstructions, WebHideEnd, prevWebButtonFunction, nextWebButtonFunction, webPreviouslyComplete, resetWebFromDesktop, initialiseWeb, confirmwebButtonFunction, webfirstOpenFunction, confirmwebFunction, backwebFunction, setWebOpen, webtaskComplete, webopen, closeWeb, askButtonFunction, webComplete, webCompleteFunction, gameFunction } from '../controllers/webController.js';
import { removeOpenAIFunction, PhishingHideEnd, preloademails, emailPreviouslyComplete, resetEmailFromDesktop, initialiseEmail, confirmphishingFunction, backphishingFunction, setEmailOpen, emailtaskComplete, emailopen, closeInbox, submitButtonFunction, enableHighlighting, reminder, displayEmail, confirmButtonFunction, firstOpenFunction, prevButtonFunction, nextButtonFunction } from '../controllers/phishingController.js';



document.addEventListener('DOMContentLoaded', function () {
    preloademails()
    const quizscores = JSON.parse(localStorage.getItem('quizscores')) || {};
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};

    //initial intro
    if (!tasks.emailtaskComplete && !tasks.webtaskComplete && !tasks.passwordtaskComplete) {
        initialiseIntro()
    }

    if (tasks.passwordtaskComplete) {
        passwordPreviouslyComplete() //password task
    }
    if (tasks.webtaskComplete) {
        webPreviouslyComplete() //web task
    }
    if (tasks.emailtaskComplete) {
        emailPreviouslyComplete() //email task
    }
    if (quizscores.percentage >= 70) {
        quizPreviouslyComplete()
    }


    const nextIntro = document.getElementById('intro-next-button');
    nextIntro.addEventListener('click', nextIntroButtonFunction);

    const prevIntro = document.getElementById('intro-prev-button');
    prevIntro.addEventListener('click', prevIntroButtonFunction);

    const confirmIntro = document.getElementById('intro-confirm-button');
    confirmIntro.addEventListener('click', confirmintroButtonFunction);

    //Redo Tasks
    const RedoEmail = document.getElementById('email-redo');
    RedoEmail.addEventListener('click', RedoEmailFunction);

    function RedoEmailFunction() {
        failedTasks();
        toggleInbox();
    }

    const RedoPassword = document.getElementById('password-redo');
    RedoPassword.addEventListener('click', RedoPasswordFunction);

    function RedoPasswordFunction() {
        failedTasks();
        togglePassword();
    }

    const RedoWeb = document.getElementById('web-redo');
    RedoWeb.addEventListener('click', RedoWebFunction);

    function RedoWebFunction() {
        failedTasks();
        toggleWeb();
    }

    //End Cards
    //phishing end
    const backPhishingEnd = document.getElementById('back-leave-phishing');
    backPhishingEnd.addEventListener('click', PhishingHideEnd);

    const confirmPhishingEnd = document.getElementById('confirm-leave-phishing');
    confirmPhishingEnd.addEventListener('click', toggleInbox);

    //password end
    const backPasswordEnd = document.getElementById('back-leave-password');
    backPasswordEnd.addEventListener('click', PasswordHideEnd);

    const confirmPasswordEnd = document.getElementById('confirm-leave-password');
    confirmPasswordEnd.addEventListener('click', togglePassword);

    //web end
    const backWebEnd = document.getElementById('back-leave-web');
    backWebEnd.addEventListener('click', WebHideEnd);

    const confirmWebEnd = document.getElementById('confirm-leave-web');
    confirmWebEnd.addEventListener('click', toggleWeb);



    //Profile
    const profileInfoButton = document.getElementById('email');
    profileInfoButton.addEventListener('click', profileInfo);

    const profileContainer = document.getElementById('profile-container');

    const closeProfile = document.getElementById('close-profile');
    closeProfile.addEventListener('click', closeProfileFunction);

    const editProfile = document.getElementById('edit-profile-btn');
    editProfile.addEventListener('click', editProfileFunction);

    const deleteProfile = document.getElementById('delete-profile-btn');
    deleteProfile.addEventListener('click', deleteProfileFunction);

    const BackdeleteProfile = document.getElementById('back-delete');
    BackdeleteProfile.addEventListener('click', BackdeleteProfileFunction);

    const confirmDelete = document.getElementById('confirm-delete');
    confirmDelete.addEventListener('click', confirmDeleteFunction);

    const cancelProfile = document.getElementById('cancel-profile-btn');
    cancelProfile.addEventListener('click', cancelProfileFunction);

    const saveProfile = document.getElementById('save-profile-btn');
    saveProfile.addEventListener('click', saveProfileFunction);

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
    document.getElementById("reminder").disabled = true;

    const inboxContainer = document.getElementById('inbox-container');

    const backToDesktop = document.getElementById('close-inbox');
    backToDesktop.addEventListener('click', toggleInbox);

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

    const OpenAIEmails = document.getElementById('openai-inbox');
    OpenAIEmails.addEventListener('click', removeOpenAIFunction);

    const confirmButton = document.getElementById('confirm-button');
    confirmButton.addEventListener('click', confirmButtonFunction);

    const emailBodyElement = document.querySelector('.email-body');
    enableHighlighting(emailBodyElement);

    const emailSubjectElement = document.querySelector('.email-subject-line');
    enableHighlighting(emailSubjectElement);

    const submitButton = document.getElementById('submit-highlight');
    submitButton.addEventListener('click', submitButtonFunction);

    // Quiz code
    const completeTasks = document.querySelector('.complete-tasks');

    const resetQuiz = document.getElementById('reset-quiz');
    resetQuiz.addEventListener('click', resetQuizFunction);

    const submitQuiz = document.getElementById('submit-quiz');
    submitQuiz.addEventListener('click', checkAnswer);


    const confirmquizButton = document.getElementById('confirm-quiz-button');
    confirmquizButton.addEventListener('click', confirmquizButtonFunction);

    const QuizIcon = document.getElementById('quiz-icon');
    QuizIcon.addEventListener('click', toggleQuiz);

    const QuizTaskbar = document.getElementById('taskbar-quiz');
    QuizTaskbar.addEventListener('click', toggleQuiz);

    const QuizButton = document.getElementById('Quiz');
    QuizButton.addEventListener('click', toggleQuiz);

    const CloseQuiz = document.getElementById('close-quiz');
    CloseQuiz.addEventListener('click', closeQuizFunction);

    const quizContainer = document.getElementById('quiz-container');

    const resetbackquizbutton = document.getElementById('reset-backquiz-button');
    resetbackquizbutton.addEventListener('click', resetbackquizFunction);

    const resetconfirmquizbutton = document.getElementById('reset-confirmquiz-button');
    resetconfirmquizbutton.addEventListener('click', resetconfirmquizFunction);

    const backquizbutton = document.getElementById('backquiz-button');
    backquizbutton.addEventListener('click', backquizFunction);

    const confirmquizbutton = document.getElementById('confirmquiz-button');
    confirmquizbutton.addEventListener('click', confirmquizFunction);

    function toggleQuiz() {
        document.getElementById('quiz-feedback').style.display = 'none'; //hide any old feedback
        profileContainer.style.display = 'none' //hides profile
        if (quizContainer.style.display === 'block') { //closes quiz
            closeQuizFunction()
        } else if (webtaskComplete && passwordtaskComplete && emailtaskComplete) { //make sure everything else is complete
            //remove end card inbox
            const phishingEndModel = document.getElementById('phishing-end');
            phishingEndModel.style.display = 'none';

            //remove end card password
            const passwordEndModel = document.getElementById('password-end');
            passwordEndModel.style.display = 'none';

            //remove end card web
            const webEndModel = document.getElementById('web-end');
            webEndModel.style.display = 'none';

            // remove any desktop blur
            desktopArea.classList.remove('blurred');

            //close everything
            inboxContainer.style.display = 'none';
            passwordContainer.style.display = 'none';
            webContainer.style.display = 'none';
            desktopArea.style.display = 'none';

            //show quiz
            quizContainer.style.display = 'block'

            QuizfirstOpenFunction() //always show instructions


        } else if (!webtaskComplete || !passwordtaskComplete || !emailtaskComplete) {
            completeTasks.innerHTML = `<p class="error">Complete Remaining Tasks before accessing Quiz!</p>`; // Show error message
        }
    }

    // Toggle inbox code
    function toggleInbox() {
        profileContainer.style.display = 'none' //hides profile
        if (inboxContainer.style.display === 'block') { //closes inbox
            if (webtaskComplete && passwordtaskComplete && emailtaskComplete) { //checks if all tasks have been completed and displays quiz arrow
                //show arrow
                const quizArrow = document.getElementById("quiz-arrow")
                quizArrow.style.display = 'block'
            }
            closeInbox()
        } else if ((passwordopen != true && webtaskComplete && quizOpen != true) || (webopen != true && passwordtaskComplete && quizOpen != true) || (webtaskComplete && passwordtaskComplete && quizOpen != true) || (webopen != true && passwordopen != true && quizOpen != true)) { //opens inbox 
            //re-enable buttons
            document.getElementById("reminder").disabled = false;
            document.getElementById('submit-highlight').disabled = false;

            //remove end card password
            const passwordEndModel = document.getElementById('password-end');
            passwordEndModel.style.display = 'none';

            //remove end card web
            const webEndModel = document.getElementById('web-end');
            webEndModel.style.display = 'none';

            // remove any desktop blur
            desktopArea.classList.remove('blurred');

            initialiseEmail();
            displayEmail();
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
    document.getElementById("passwordPWNED").disabled = true;
    document.getElementById("checkButton").disabled = true;

    let passwordInput = document.getElementById('password');

    const passwordContainer = document.getElementById('password-container');

    const backpasswordbutton = document.getElementById('backpassword-button');
    backpasswordbutton.addEventListener('click', backpasswordFunction);

    const confirmpasswordbutton = document.getElementById('confirmpassword-button');
    confirmpasswordbutton.addEventListener('click', confirmpasswordFunction);

    const backToDesktopPassword = document.getElementById('close-password');
    backToDesktopPassword.addEventListener('click', togglePassword);

    const prevPasswordButton = document.getElementById('prev-password-button');
    prevPasswordButton.addEventListener('click', prevPasswordButtonFunction);

    const nextPasswordButton = document.getElementById('next-password-button');
    nextPasswordButton.addEventListener('click', nextPasswordButtonFunction);

    const confirmpasswordButton = document.getElementById('confirm-password-button');
    confirmpasswordButton.addEventListener('click', confirmpasswordButtonFunction);

    const checkButton = document.getElementById('checkButton');
    checkButton.addEventListener('click', checkButtonFunction);

    document.getElementById("passwordPWNED").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("checkButton").click();
        }
    });

    const check2 = document.getElementById('Task2-Check');
    check2.addEventListener('click', check2Function);

    //toggle password code
    function togglePassword() {
        profileContainer.style.display = 'none' //hides profile
        if (passwordContainer.style.display === 'block') {
            if (webtaskComplete && passwordtaskComplete && emailtaskComplete) { //checks if all tasks have been completed and displays quiz arrow
                //show arrow
                const quizArrow = document.getElementById("quiz-arrow")
                quizArrow.style.display = 'block'
            }
            closePassword()
        } else if ((emailopen != true && webtaskComplete && quizOpen != true) || (webopen != true && emailtaskComplete && quizOpen != true) || (webtaskComplete && emailtaskComplete && quizOpen != true) || (webopen != true && emailopen != true && quizOpen != true)) {
            //re-enable buttons
            document.getElementById("passwordPWNED").disabled = false;
            document.getElementById("checkButton").disabled = false;
            document.getElementById("password").disabled = false;
            document.getElementById("Task2-Check").disabled = false;


            //remove end card inbox
            const phishingEndModel = document.getElementById('phishing-end');
            phishingEndModel.style.display = 'none';

            //remove end card web
            const webEndModel = document.getElementById('web-end');
            webEndModel.style.display = 'none';

            // remove any desktop blur
            desktopArea.classList.remove('blurred');
            initialisePassword()
            setPasswordOpen(true); // Call function to update passwordopen
            passwordContainer.style.display = 'block';
            inboxContainer.style.display = 'none';
            webContainer.style.display = 'none'
            desktopArea.style.display = 'none';
        }
        // Show instructions if it's the first time opening
        if (FirstOpenPassword) {
            FirstOpenPassword = false;
            firstOpenPasswordFunction();

        }
    }

    passwordInput.addEventListener('input', function (event) {
        checkPasswordStrength(event.target.value);
    });

    //web code
    document.getElementById("ask-button").disabled = true;
    document.getElementById("user-input").disabled = true;

    const webContainer = document.getElementById('web-container');

    const backToDesktopWeb = document.getElementById('close-web');
    backToDesktopWeb.addEventListener('click', toggleWeb);

    const playGame = document.getElementById('play-game-button');
    playGame.addEventListener('click', confirmGameInstructions);

    const prevwebButton = document.getElementById('prev-web-button');
    prevwebButton.addEventListener('click', prevWebButtonFunction);

    const nextwebButton = document.getElementById('next-web-button');
    nextwebButton.addEventListener('click', nextWebButtonFunction);


    const confirmwebButton = document.getElementById('confirm-web-button');
    confirmwebButton.addEventListener('click', confirmwebButtonFunction);

    const backwebbutton = document.getElementById('backweb-button');
    backwebbutton.addEventListener('click', backwebFunction);

    const confirmwebbutton = document.getElementById('confirmweb-button');
    confirmwebbutton.addEventListener('click', confirmwebFunction);

    //openai code - web Task
    const askButton = document.getElementById('ask-button');
    askButton.addEventListener('click', () => {
        askButton.disabled = true; //disable button
        askButton.textContent = 'Loading'; //change button text

        askButtonFunction();

        setTimeout(() => {  //wait 5 seconds before enabling button again
            askButton.disabled = false;
            askButton.textContent = 'Search';
        }, 5000);
    });


    //game function
    const gameButton = document.getElementById('game-button');
    gameButton.addEventListener('click', () => {
        gameButton.disabled = true; //disable button
        gameButton.textContent = 'Loading'; //change button text

        gameFunction();

        setTimeout(() => {  //wait 5 seconds before enabling button again
            gameButton.disabled = false;
            gameButton.textContent = 'Play Game';
        }, 5000);
    });

    document.getElementById("user-input").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("ask-button").click();
        }
    });

    //toggle web task
    function toggleWeb() {
        profileContainer.style.display = 'none' //hides profile
        if (webContainer.style.display === 'block') {
            if (webtaskComplete && passwordtaskComplete && emailtaskComplete) { //checks if all tasks have been completed and displays quiz arrow
                //show arrow
                const quizArrow = document.getElementById("quiz-arrow")
                quizArrow.style.display = 'block'
            }
            closeWeb()
        } else if ((passwordopen != true && emailtaskComplete && quizOpen != true) || (emailopen != true && passwordtaskComplete && quizOpen != true) || (emailtaskComplete && passwordtaskComplete && quizOpen != true) || (emailopen != true && passwordopen != true && quizOpen != true)) {
            //re-enable buttons
            document.getElementById("ask-button").disabled = false;
            document.getElementById("user-input").disabled = false;

            //remove end card inbox
            const phishingEndModel = document.getElementById('phishing-end');
            phishingEndModel.style.display = 'none';

            //remove end card password
            const passwordEndModel = document.getElementById('password-end');
            passwordEndModel.style.display = 'none';

            // remove any desktop blur
            desktopArea.classList.remove('blurred');

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
});

// Call clock function and update every second
setInterval(updateClock, 1000);
updateClock();

const userEmail = localStorage.getItem('userEmail'); // Retrieve the email from localStorage
const firstName = localStorage.getItem('firstName');
const lastName = localStorage.getItem('lastName');
const organisation = localStorage.getItem('organisation');


if (userEmail) {
    const emailElement = document.getElementById('email');
    emailElement.innerText = userEmail; // Set the email to the div

    const ProfileEmailElement = document.getElementById('Profile-email');
    ProfileEmailElement.innerText = userEmail; // Set the email to the div

    const ProfileFirstName = document.getElementById('firstName');
    ProfileFirstName.innerText = firstName;

    const ProfileLastName = document.getElementById('lastName');
    ProfileLastName.innerText = lastName;

    const ProfileOrganisation = document.getElementById('organisation')
    ProfileOrganisation.innerText = organisation;
} else {
    console.log('User email not found');
} 