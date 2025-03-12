console.log('passwordController.js loaded');

export let passwordopen = false;
export let passwordtaskComplete = false;

let pwnedpasswords = 0;
let feedback = false;
let currentPage = 0; // Track the current page of the model
let confirmClose = false;
let passwordblur = true;
let passwordtask1 = false;
let passwordtask2 = false;
let passwordtask3 = false;
let passwordStrengths = document.querySelectorAll('.password-strength')


const profileContainer = document.getElementById('profile-container');
const task2CheckButton = document.getElementById('Task2-Check');
const desktopArea = document.getElementById('desktop-area');
const instructionPasswordModel = document.getElementById('instructions-password'); // Instruction model
const passwordContainer = document.getElementById('password-container');
const passwordContainerBlur = document.getElementById('password-interface');


const middleContainerBlur = document.getElementById('middle');
const bottomContainerBlur = document.getElementById('bottom');

const leavetaskModel = document.getElementById('leave-password-task')

const prevPasswordButton = document.getElementById('prev-password-button');
const nextPasswordButton = document.getElementById('next-password-button');
const confirmPasswordButton = document.getElementById('confirm-password-button');

const resetPassword = document.getElementById('reset-password');
const instructionModel = document.getElementById('instructions-password'); // Instruction model

const resultElement = document.getElementById('result');
const resulttask2Element = document.getElementById('resulttask2');

// Pages content
const pages = [
    {
        title: `🔐 Welcome to the Password Security Challenge!`,
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
        title: "We will follow NCSE password guidance, which recommends:",
        content: `
        ✅ Use at least <strong>three random words</strong> instead of a single word.<br>
        🚫 <strong>Avoid common words</strong> (e.g., “password” or “123456”).<br>
        🔢 Use a mix of <strong>uppercase, lowercase, numbers, and special characters.</strong><br>
        🔄 <strong>Never reuse passwords</strong> across different accounts.<br><br>
        🔓 <strong>Click Confirm to start the challenge!</strong><br><br>
        `
    },
    {
        title: "🔍 Why Checking Passwords Matters",
        content: `
        🏴‍☠️ <strong>Hackers use leaked databases</strong> to try stolen passwords on different websites.<br>
        🔓 <strong>Even strong passwords can be compromised</strong> if they have been exposed in a data breach.<br>
        🔄 <strong>Attackers use credential stuffing</strong>—testing stolen credentials on multiple sites to gain access.<br><br>
        <strong>💡 Key takeaway:</strong> Even if your password seems strong, it’s unsafe if it has been exposed in a past breach!
        `
    },
    {
        title: "❌ Common Password Mistakes",
        content: `
        🚫 Using personal details (e.g., birthdates, pet names).<br>
        🚫 Short passwords—longer is always better!<br>
        🚫 Predictable sequences (e.g., "qwerty", "123456", "password").<br>
        🚫 Reusing the same password across multiple accounts.<br><br>
        <strong>💡 Solution:</strong> Use unique passwords for each account, preferably with a password manager to securely store and generate them.
        `
    },
    {
        title: "🔑 Why Reusing Passwords is Dangerous",
        content: `
        🔄 <strong>If one account is hacked, all accounts with the same password are at risk.</strong><br>
        🚨 Attackers use <strong>automated tools</strong> to try breached passwords on different sites.<br>
        🔓 <strong>Once breached, attackers can steal personal data, money, or impersonate you.</strong><br><br>
        <strong>💡 Always use a unique password for each account!</strong><br><br>
        🔄 <strong>Update your passwords regularly</strong> to ensure ongoing security, even if no breach has occurred. Regular updates help protect you against future vulnerabilities.
    `
    }
];






export function initialisePassword() {

    document.getElementById("passwordPWNED").value = "";
    document.getElementById("password").value = "";
    // Clear previous results
    resulttask2Element.textContent = "";
    resulttask2Element.style.color = "";
    resultElement.textContent = "";
    resultElement.style.color = "";
    checkPasswordStrength("")



    if (passwordtaskComplete == false) {
        instructionPasswordModel.style.display = 'flex'; //working
        passwordContainerBlur.classList.add('blurred'); // Apply the blur

        passwordtask1 = false;
        document.querySelector("#task-1-status").textContent = "incomplete";
        document.querySelector("#task-1-status").classList.remove("complete");
        document.querySelector("#task-1-status").classList.add("incomplete");

        passwordtask2 = false;
        document.querySelector("#task-2-status").textContent = "Incomplete";
        document.querySelector("#task-2-status").classList.remove("complete");
        document.querySelector("#task-2-status").classList.add("incomplete");

        passwordtask3 = false;
        document.querySelector("#task-3-status").textContent = "incomplete";
        document.querySelector("#task-3-status").classList.remove("complete");
        document.querySelector("#task-3-status").classList.add("incomplete");

        passwordComplete()
        togglePasswordInput()
        updateModelContent()

    }

}

export function resetPasswordTask() {
    leavetaskModel.style.display = 'none';
    desktopArea.classList.remove('blurred');
}

export function closePassword() {
    if (passwordtaskComplete || confirmClose) {
        confirmClose = false;
        passwordopen = false;
        // If inbox is currently displayed, hide it and show desktop
        passwordContainer.style.display = 'none';
        desktopArea.style.display = 'flex';
    }
    else {
        //disable inputs and buttons 
        document.getElementById("passwordPWNED").disabled = true; 
        document.getElementById("checkButton").disabled = true; 
        document.getElementById("password").disabled = true; 
        document.getElementById("Task2-Check").disabled = true; 

        leavetaskModel.style.display = 'flex'; //working
        passwordContainer.classList.add('blurred'); // Apply the blur
    }
}

export function backpasswordFunction() {
    leavetaskModel.style.display = 'none';
    passwordContainer.classList.remove('blurred'); // remove the blur
    document.getElementById("passwordPWNED").disabled = false; 
    document.getElementById("checkButton").disabled = false; 
    document.getElementById("password").disabled = false; 
    document.getElementById("Task2-Check").disabled = false; 
}

export function confirmpasswordFunction() {
    document.getElementById("passwordPWNED").disabled = false; 
    document.getElementById("checkButton").disabled = false; 
    document.getElementById("password").disabled = false; 
    document.getElementById("Task2-Check").disabled = false; 
    passwordContainer.classList.remove('blurred'); // remove the blur
    task2CheckButton.classList.add('hidden');
    confirmClose = true;
    passwordopen = false;
    passwordtaskComplete = false;
    pwnedpasswords = 0;
    const passwordIcon = document.querySelector("#progress-password img");
    if (passwordIcon) {
        passwordIcon.src = "assets/icons/password-icon.png";
    }

    //disable reset 
    if (resetPassword.style.display === 'block') {
        resetPassword.style.display = 'none';
    }

    
    //disable reset 
    if (profileContainer.style.display === 'block') {
        profileContainer.style.display = 'none' //hides profile
    }



    currentPage = 0,
        console.log(currentPage);
    markTaskIncomplete()
    resetPasswordTask()
    closePassword()
}

export function resetPasswordFromDesktop() {
    leavetaskModel.style.display = 'flex'; //working
    desktopArea.classList.add('blurred'); // Apply the blur
}

//update the model content based on the current page
export function updateModelContent() {
    console.log(currentPage)
    const titleElement = instructionModel.querySelector('h2');
    const contentElement = instructionModel.querySelector('p');

    // Update title and content
    titleElement.textContent = pages[currentPage].title;
    contentElement.innerHTML = pages[currentPage].content;

    // Manage button visibility
    prevPasswordButton.classList.toggle('hidden', currentPage === 0);
    nextPasswordButton.classList.toggle('hidden', currentPage === pages.length - 1);
    confirmPasswordButton.classList.toggle('hidden', currentPage !== pages.length - 1);
}

export function confirmpasswordButtonFunction() {
    instructionPasswordModel.style.display = 'none';
    passwordContainerBlur.classList.remove('blurred'); // Remove the blur
    middleContainerBlur.classList.add('blurred'); // Apply blur to middle and bottom
    bottomContainerBlur.classList.add('blurred');
    document.getElementById("passwordPWNED").disabled = false; 
    document.getElementById("checkButton").disabled = false; 
}

export function prevPasswordButtonFunction() {
    if (currentPage > 0) {
        currentPage--;
        updateModelContent();
    }
}

export function nextPasswordButtonFunction() {
    if (currentPage < pages.length - 1) {
        currentPage++;
        updateModelContent();
    }
}


export function passwordCompleteFunction() {
    if (passwordtaskComplete) {
        passwordContainer.style.display = 'none';
        desktopArea.style.display = 'flex';
    }
}

export async function checkButtonFunction() {

    const passwordPWNED = document.getElementById('passwordPWNED').value;
    const resultElement = document.getElementById('result');
    // Clear previous results
    resultElement.textContent = "";
    resultElement.style.color = "";


    if (!passwordPWNED) {
        resultElement.textContent = "Please enter a password.";
        resultElement.style.color = "red"; // works
        return;
    }

    try {
        // Hash the password 
        const hashedPassword = await encrypt(passwordPWNED);

        // Extract the first 5 characters of the hash
        const hashPrefix = hashedPassword.substring(0, 5);
        const hashSuffix = hashedPassword.substring(5).toUpperCase();

        // Fetch data from the Pwned Passwords API
        const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);

        if (!response.ok) {
            resultElement.textContent = "Error fetching data. Please try again later.";
            resultElement.style.color = "red"; // works
            return;
        }

        const data = await response.text();
        const breaches = data.split('\n').map(line => {
            const [suffix, count] = line.split(':');
            return { suffix, count: parseInt(count) };
        });

        // Find the match for the password
        const matchedBreach = breaches.find(breach => breach.suffix === hashSuffix);

        // If the password has been pwned
        if (matchedBreach) {


            pwnedpasswords++;
            if (pwnedpasswords >= 5) {
                passwordtask1 = true;

                resultElement.innerHTML = `
                <p style="color: red;">This password has been pwned and therefore compromised! It has appeared in <strong>${matchedBreach.count} breaches. You should stop using it immediately!</strong></p>
                <p style="color: red;"><strong>Proceed to Task 2 to create a new, secure password.</strong></p>
                `;

                // Update the task list status
                document.querySelector("#task-1-status").textContent = "Complete";
                document.querySelector("#task-1-status").classList.remove("incomplete");
                document.querySelector("#task-1-status").classList.add("complete");
                middleContainerBlur.classList.remove('blurred');
                togglePasswordInput()
                passwordComplete()
            } else {
                resultElement.innerHTML = `
                <p style="color: red;">This password has been pwned and therefore compromised! It has appeared in <strong>${matchedBreach.count} breaches. You should stop using it immediately!</strong></p>
                <p style="color: red;"><strong>Test ${5 - pwnedpasswords} more passwords to move onto Task 2</strong></p>
                `;

            }
        } else {
            pwnedpasswords++;
            if (pwnedpasswords >= 5) {
                passwordtask1 = true;
                resultElement.innerHTML = `
                <p style="color: green;">Great your password has not appeared in a breach! But remember, just because a password hasn’t been exposed doesn’t mean it’s strong. <strong>Proceed to Task 2 to create a stronger one.</strong></p>
                <p style="color: green;"><strong>Proceed to Task 2 to create a new, secure password.</strong></p>
                `;
                // Update the task list status
                document.querySelector("#task-1-status").textContent = "Complete";
                document.querySelector("#task-1-status").classList.remove("incomplete");
                document.querySelector("#task-1-status").classList.add("complete");
                middleContainerBlur.classList.remove('blurred');
                togglePasswordInput()
                passwordComplete()
            } else {
                resultElement.innerHTML = `
                <p style="color: green;">Great your password has not appeared in a breach! But remember, just because a password hasn’t been exposed doesn’t mean it’s strong.</p>
                <p style="color: green;"><strong>Test ${5 - pwnedpasswords} more passwords to move onto Task 2</strong></p>
                `;
            }
        }

    } catch (error) {
        resultElement.textContent = "Error checking password. Please try again later.";
        resultElement.style.color = "red"; // works
        console.error(error);
    }

    document.getElementById('passwordPWNED').value = "";



}

export async function check2Function() {

    const passwordPWNED = document.getElementById('password').value;
    const resultElement = document.getElementById('resulttask2');
    // Clear previous results
    resultElement.textContent = "";
    resultElement.style.color = "";

    if (passwordblur == false) {
        if (!passwordPWNED) {
            resultElement.textContent = "Please enter a password.";
            resultElement.style.color = "red"; // works
            return;
        }

        try {
            // Hash the password 
            const hashedPassword = await encrypt(passwordPWNED);

            // Extract the first 5 characters of the hash
            const hashPrefix = hashedPassword.substring(0, 5);
            const hashSuffix = hashedPassword.substring(5).toUpperCase();

            // Fetch data from the Pwned Passwords API
            const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);

            if (!response.ok) {
                resultElement.textContent = "Error fetching data. Please try again later.";
                resultElement.style.color = "red"; // works
                return;
            }

            const data = await response.text();
            const breaches = data.split('\n').map(line => {
                const [suffix, count] = line.split(':');
                return { suffix, count: parseInt(count) };
            });

            // Find the match for the password
            const matchedBreach = breaches.find(breach => breach.suffix === hashSuffix);

            // If the password has been pwned
            if (matchedBreach) {
                resultElement.innerHTML = `
                <p style="color: red;">This password has been pwned and therefore compromised! It has appeared in <strong>${matchedBreach.count} breaches.</strong></p>
                <p style="color: red;"><strong>You should stop using it immediately!</strong></p>
                <p style="color: red;"><strong>You must create a different one.</strong></p>
                `;
                passwordtask2 = true;

                // Update the task list status
                document.querySelector("#task-2-status").textContent = "Complete";
                document.querySelector("#task-2-status").classList.remove("incomplete");
                document.querySelector("#task-2-status").classList.add("complete");

                passwordComplete()
            } else {
                passwordtask2 = true;

                // Update the task list status
                document.querySelector("#task-2-status").textContent = "Complete";
                document.querySelector("#task-2-status").classList.remove("incomplete");
                document.querySelector("#task-2-status").classList.add("complete");

                passwordtask3 = true;

                // Update the task list status
                document.querySelector("#task-3-status").textContent = "Complete";
                document.querySelector("#task-3-status").classList.remove("incomplete");
                document.querySelector("#task-3-status").classList.add("complete");

                resultElement.innerHTML = `
                    <p style="color: green;">Your password is strong and has never been found in a breach. Well done!</strong></p>
                    `;
                passwordComplete()
            }

        } catch (error) {
            resultElement.textContent = "Error checking password. Please try again later.";
            resultElement.style.color = "red"; // works
            console.error(error);
        }
    }
}

export function togglePasswordInput() {
    if (passwordtask1) {
        const passwordInput = document.getElementById('password');
        passwordblur = false;
        passwordInput.disabled = false; // Enable
    }
    else {
        const passwordInput = document.getElementById('password');
        passwordblur = true;
        passwordInput.disabled = true; // disable
    }

}

// SHA-1 Hashing Function (to hash the password)
export function encrypt(str) {
    const utf8 = new TextEncoder().encode(str);
    return crypto.subtle.digest('SHA-1', utf8).then(hashBuffer => {
        return Array.from(new Uint8Array(hashBuffer))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    });
}

export function passwordPreviouslyComplete() {
    passwordtaskComplete = true;
    // Update the icon to show the completed status
    const passwordIcon = document.querySelector("#progress-password img");
    if (passwordIcon) { //cannot find
        passwordIcon.src = "assets/icons/password-tick-icon.png";
    }

    //enable reset since task is complete
    if (resetPassword.style.display === 'none') {
        resetPassword.style.display = 'block';
    }
}

// Function to mark all password tasks as complete
export function passwordComplete() {
    // Check if all tasks are complete
    if (passwordtask1 && passwordtask2 && passwordtask3 || passwordtaskComplete) {
        markTaskComplete()
        passwordtaskComplete = true;

        // Update the icon to show the completed status
        const passwordIcon = document.querySelector("#progress-password img");
        if (passwordIcon) { //cannot find
            passwordIcon.src = "assets/icons/password-tick-icon.png";
        }

        //enable reset since task is complete
        if (resetPassword.style.display === 'none') {
            resetPassword.style.display = 'block';
        }

        if (feedback == false) {
            // Add a message at the bottom for next steps
            const taskPasswordElement = document.querySelector(".Taskpassword");
            taskPasswordElement.innerHTML += `
        <div class="next-steps">
            <p>You can test more passwords or minimise this tab and move on to the next task.</p>
        </div>
    `;
            feedback = true;
        }

        passwordopen = false;
    } else {

        console.log("Not all tasks are complete yet.");
        // remove next steps
        const taskPasswordElement = document.querySelector(".Taskpassword");
        const nextStepsDiv = taskPasswordElement.querySelector(".next-steps");
        if (nextStepsDiv) {
            nextStepsDiv.remove();
        }
    }
}

export function checkPasswordStrength(password) {
    let strength = 0;

    // strength improves if password is 8 or more characters
    if (password.length >= 8) {
        strength += 1;
    }
    if (password.length >= 12) {
        strength += 1;
    }

    // Check for use of numbers, special characters, and uppercase letters
    if (/[0-9]/.test(password)) {
        strength += 1;
    }
    // Check for use of special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        strength += 1;
    }
    // Check for use of uppercase letters
    if (/[A-Z]/.test(password)) {
        strength += 1;
    }

    // Determine the degree and text based on strength score
    let degree = (strength / 5) * 360; // 5 is the maximum score
    let gradientColor = strength <= 2 ? '#ff2c1c' : (strength <= 4 ? '#ff9800' : '#12ff12');
    let strengthText = strength <= 2 ? 'Weak' : (strength <= 4 ? 'Medium' : 'Strong');

    passwordStrengths.forEach(passwordStrength => {
        passwordStrength.style.background = `conic-gradient(${gradientColor} ${degree}deg, #1115 ${degree}deg)`;
        // Check if password strength is Strong
        if (strengthText === 'Strong') {
            passwordtask2 = true;
            bottomContainerBlur.classList.remove('blurred')

            task2CheckButton.classList.remove('hidden');


            // Update the task list status for Task 1
            const task2Status = document.querySelector("#task-2-status");
            task2Status.textContent = "Complete";
            task2Status.classList.remove("incomplete");
            task2Status.classList.add("complete");

            bottomContainerBlur.classList.remove('blurred');
            togglePasswordInput();
            // Call passwordComplete to check all tasks
            passwordComplete();
        }
        else if (passwordtask2 == false) {
            // Update the task list status for Task 1
            const task2Status = document.querySelector("#task-2-status");
            task2Status.textContent = "Incomplete";
            task2Status.classList.remove("Complete");
            task2Status.classList.add("incomplete");
            bottomContainerBlur.classList.add('blurred');
            togglePasswordInput();
        }
    });
    text.textContent = strengthText;
    text.style.color = gradientColor;
}



export function setPasswordOpen(value) {
    passwordopen = value;
}

async function markTaskComplete(passwordtaskComplete) {
    const email = localStorage.getItem('userEmail'); // Get logged-in user's email
    if (!email) return; // Ensure user is logged in

    const response = await fetch('/update-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, taskName: 'passwordtaskComplete', status: true }) // Send task name & status
    });

    if (response.ok) {
        // Update local storage to reflect completed tasks
        const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
        tasks[passwordtaskComplete] = true;
        localStorage.setItem('tasks', JSON.stringify(tasks));

        console.log(`${passwordtaskComplete} marked as complete.`);
    }
}

async function markTaskIncomplete(passwordtaskComplete) {
    const email = localStorage.getItem('userEmail'); // Get logged-in user's email
    if (!email) return; // Ensure user is logged in

    const response = await fetch('/update-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, taskName: 'passwordtaskComplete', status: false }) // Send task name & status
    });

    if (response.ok) {
        // Update local storage to reflect completed tasks
        const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
        tasks[passwordtaskComplete] = false;
        localStorage.setItem('tasks', JSON.stringify(tasks));

        console.log(`${passwordtaskComplete} marked as incomplete.`);
    }
}