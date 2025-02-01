console.log('passwordController.js loaded');

let passwordopen = false;
let passwordtaskComplete = false;
let passwordblur = true;
let passwordtask1 = false;
let passwordtask2 = false;
let passwordtask3 = false;
let passwordStrengths = document.querySelectorAll('.password-strength')

const desktopArea = document.getElementById('desktop-area');
const instructionPasswordModel = document.getElementById('instructions-password'); // Instruction model
const passwordContainer = document.getElementById('password-container');
const passwordContainerBlur = document.getElementById('password-interface');
const pwnedpasswordContainerBlur = document.getElementById('Pwned');

export function confirmpasswordButtonFunction() {
    instructionPasswordModel.style.display = 'none';
    passwordContainerBlur.classList.remove('blurred'); // Remove the blur
    pwnedpasswordContainerBlur.classList.add('blurred'); // Apply the to right side
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
                <p style="color: red;">This password has been pwned! It has appeared in ${matchedBreach.count} breaches.</p>
                <p style="color: red;"><strong>Why is this a problem?</strong></p>
                <p style="color: red;">When your password is involved in a breach, attackers can potentially use it to gain unauthorized access to your accounts, putting your personal data at risk. It's recommended to change it immediately.</p>
                <p style="color: red;"><strong>How to improve your password:</strong></p>
                <ul>
                <li style="color: red;">Use a combination of uppercase and lowercase letters, numbers, and special characters.</li>
                <li style="color: red;">Avoid using easily guessable information like your name, birthdate, or common words.</li>
                <li style="color: red;">Consider using a password manager to create and store strong, unique passwords for each account.</li>
                </ul>
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
                    <p style="color: green;">This password has not been pwned. It appears safe to use.</p>
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
    const passwordInput = document.getElementById('passwordPWNED');
    passwordblur = false;
    passwordInput.disabled = false; // Enable
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

// Function to mark all password tasks as complete
export function passwordComplete() {
    // Check if all tasks are complete
    if (passwordtask1 && passwordtask2 && passwordtask3 && passwordtaskComplete != true) {
        passwordtaskComplete = true;

        // Update the icon to show the completed status
        const passwordIcon = document.querySelector("#progress-password img");
        if (passwordIcon) {
            passwordIcon.src = "assets/icons/password-tick-icon.png";
        }

        // Add a message at the bottom for next steps
        const taskPasswordElement = document.querySelector(".Taskpassword");
        taskPasswordElement.innerHTML += `
        <div class="next-steps">
            <p>You can test more passwords or minimise this tab and move on to the next task.</p>
        </div>
    `;
        passwordopen = false;
    } else {
        console.log("Not all tasks are complete yet.");
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
            passwordtask1 = true;

            // Update the task list status for Task 1
            const task1Status = document.querySelector("#task-1-status");
            task1Status.textContent = "Complete";
            task1Status.classList.remove("incomplete");
            task1Status.classList.add("complete");
            pwnedpasswordContainerBlur.classList.remove('blurred'); // Remove the blur from right side

            togglePasswordInput();
            // Call passwordComplete to check all tasks
            passwordComplete();
        }
    });
    text.textContent = strengthText;
    text.style.color = gradientColor;
}

