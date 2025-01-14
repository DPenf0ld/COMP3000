document.addEventListener('DOMContentLoaded', function () {
    //desktop code
    const emailIconDesktop = document.getElementById('email-icon');        // Icon for email on desktop
    const emailIconTaskbar = document.getElementById('taskbar-email');     // Icon for email on taskbar
    const emailIconProgress = document.getElementById('progress-email');     // Icon for email on progress tracker

    //email code
    const inboxContainer = document.getElementById('inbox-container');     // Inbox container
    const emailContainer = document.getElementById('email-interface');     // Inbox container
    const emailContentContainer = document.querySelector('.email-content');
    const emailListContainer = document.querySelector('.email-list');
    let emailtypereminder = false;

    const instructionModel = document.getElementById('instructions-email'); // Instruction model
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const confirmButton = document.getElementById('confirm-button');

    let instructionsConfirmed = false; //used to display example email instructions

    //Phishing information code
    let isFirstOpen = true; // Track if inbox is opened for the first time
    let currentPage = 0; // Track the current page of the model
    let displaynextemailbutton = false; //do not show next email button orginally
    let selectedoption = false;
    let correctselectedoption= false;

    let emailtaskComplete = false;
    let emailtask1 = false;
    let emailtask2 = false;
    let emailtask3 = false;

    //password code
    let FirstOpenPassword = true; // Track if password exercise is opened for the first time
    let passwordtaskComplete = false;

    let passwordtask1 = false;
    let passwordtask2 = false;
    let passwordtask3 = false;

    const passwordIconDesktop = document.getElementById('password-icon');        // Icon for password on desktop
    const passwordIconTaskbar = document.getElementById('taskbar-password');     // Icon for password on taskbar
    const passwordIconProgress = document.getElementById('progress-password');     // Icon for password on progress tracker

    const instructionPasswordModel = document.getElementById('instructions-password'); // Instruction model
    const confirmpasswordButton = document.getElementById('confirm-password-button');


    const passwordContainer = document.getElementById('password-container');
    const passwordContainerBlur = document.getElementById('password-interface');

    let passwordInput = document.getElementById('password');
    let passwordStrengths = document.querySelectorAll('.password-strength')


    //Desktop code
    const desktopArea = document.getElementById('desktop-area');           // Desktop area
    const backToDesktop = document.getElementById('close-inbox');      // Button or link to return to desktop
    const backToDesktopPassword = document.getElementById('close-password');




    //PHISHING EXERCISE CODE 
    //
    //
    //
    //
    //


    // Pages content
    const pages = [
        {
            title: "Welcome to the Email Inbox",
            content: "This exercise will help improve your skills in identifying emails that are fraudulent attempts to steal sensitive information. These are known as phishing emails. These emails often contain suspicious links or attachments designed to trick you."
        },
        {
            title: "What are Phishing Emails?",
            content: "Phishing emails aim to deceive recipients into believing they are from legitimate sources. They use techniques such as fake sender addresses, urgent language, and malicious links or attachments."
        },
        {
            title: "Types of Phishing Emails",
            content: "There are many types of phishing emails, but we will look at the most common types. Each has unique methods but shares the goal of extracting sensitive information."
        },
        {
            title: "Deceptive Phishing (Social Engineering attack)",
            content: "The attacker impersonates a legitimate entity, such as a bank, online service, or company, through fraudulent emails designed to trick individuals into revealing sensitive information like passwords, credit card numbers, or personal details. These emails often exploit human emotions such as trust, fear, or urgency by including messages about account suspensions, fraudulent activities, or limited-time offers. Deceptive phishing often directs victims to fake websites resembling legitimate ones, where their credentials or data can be stolen."
        },
        {
            title: "Clone Phishing",
            content: "The attacker creates an almost identical replica of a legitimate email the victim has previously received. However, links or attachments are replaced with malicious versions. The email may claim to be a 'resend' or an 'updated version' of the original, leveraging the victim’s familiarity with the initial communication to bypass suspicion. Clone phishing is particularly effective when attackers intercept legitimate email exchanges."
        },
        {
            title: "Spear Phishing",
            content: "These are highly targeted phishing attacks aimed at a specific individual or organization. Attackers often gather personal information about their target, such as job roles, colleagues, or recent activities, to craft convincing emails. These emails may appear to come from trusted sources like a colleague, manager, or a service the victim uses, often requesting sensitive information or financial transactions."
        },
        {
            title: "Indications of Phishing Emails",
            content: `
                Be on the lookout for these common signs to protect yourself from phishing attempts:<br><br>
                • <strong>Typos and Mistakes:</strong> Poor spelling or grammar can be a red flag.<br>
                • <strong>Strange Email Addresses:</strong> Check if the sender’s email looks unusual or doesn’t match the official domain.<br>
                • <strong>Unexpected Attachments:</strong> Be cautious of files you weren’t expecting to receive.<br>
                • <strong>Urgent Requests:</strong> Emails that pressure you to act quickly may be trying to trick you.<br>
                • <strong>Suspicious Links:</strong> Hover over links to see where they lead before clicking.<br>
                • <strong>Unusual Greetings:</strong> Generic greetings like "Dear Customer" instead of your name can indicate phishing.<br>
                • <strong>Too Good to Be True Offers:</strong> Be skeptical of offers that seem overly generous or unrealistic.<br><br>
                <strong>Always Remember:</strong><br>
                • <strong>Verify the Sender:</strong> If you're unsure, contact the company or person directly using a trusted method.<br>
                • <strong>Think Twice Before Clicking:</strong> Take a moment to assess the email’s legitimacy before interacting with any links or attachments.<br>
                • <strong>Don’t Share Personal Info:</strong> Legitimate organizations won’t ask for sensitive information via email.<br><br>
                Staying alert and following these tips can help you avoid falling victim to phishing scams!
            `
        },
        {
            title: "Instructions",
            content: `
                Remember, this is a safe environment with no way of causing harm. Your task:<br><br>
                • <strong>Highlight suspicious words:</strong> Look out for poor spelling, time urgency, and suspicious links.<br>
                • <strong>Select the type of email:</strong> After highlighting, decide what type of email you believe it could be – remember, it may not always be a phishing email.<br>
                • <strong>Complete the exercises:</strong> Have a go at the quiz at the end to test your knowledge.<br><br>
                Not all of these are phishing emails, but the ones used are real-world examples. Let's identify the phishing attempts!
            `
        }
    ];


    //update the model content based on the current page
    function updateModelContent() {
        const titleElement = instructionModel.querySelector('h2');
        const contentElement = instructionModel.querySelector('p');

        // Update title and content
        titleElement.textContent = pages[currentPage].title;
        contentElement.innerHTML = pages[currentPage].content;

        // Manage button visibility
        prevButton.classList.toggle('hidden', currentPage === 0);
        nextButton.classList.toggle('hidden', currentPage === pages.length - 1);
        confirmButton.classList.toggle('hidden', currentPage !== pages.length - 1);
    }

    // Add event listeners 
    prevButton.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateModelContent();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < pages.length - 1) {
            currentPage++;
            updateModelContent();
        }
    });

    confirmButton.addEventListener('click', () => {
        instructionModel.style.display = 'none';
        instructionsConfirmed = true; // listener to display instructions once user confirms
        emailContainer.classList.remove('blurred'); // Remove the blur
        displayEmail(currentEmailIndex);
    });

    // Toggle inbox code
    function toggleInbox() {
        if (inboxContainer.style.display === 'block') {
            // If inbox is currently displayed, hide it and show desktop
            inboxContainer.style.display = 'none';
            desktopArea.style.display = 'flex';
        } else {
            // If inbox is not displayed, show it and hide desktop
            inboxContainer.style.display = 'block';
            passwordContainer.style.display = 'none'
            desktopArea.style.display = 'none';

            // Show instructions if it's the first time opening the inbox
            if (isFirstOpen) {
                instructionModel.style.display = 'flex'; //working
                emailContainer.classList.add('blurred'); // Apply the blur
                isFirstOpen = false;
            }
        }
    }

    // Toggle inbox on desktop and taskbar
    emailIconDesktop.addEventListener('click', toggleInbox);
    emailIconTaskbar.addEventListener('click', toggleInbox);
    emailIconProgress.addEventListener('click', toggleInbox);

    // Go back to the desktop
    backToDesktop.addEventListener('click', function () {
        inboxContainer.style.display = 'none';
        desktopArea.style.display = 'flex';
    });


    //display emails
    let currentEmailIndex = 0;

    const emails = [
        {
            type: "Deceptive-Phishing",
            hover: "billing-securepay@securepaysolutions-support.com", //example email
            sender: "SecurePay Solutions",
            subject: "Urgent Account Update Required EXAMPLE",
            body: `Dear Customer,<br><br>
                   Your invoice #[12345] is now ready.<br><br>
                   Please find the attached invoice for your review. Kindly make the payment at your earlist convenience to avoid service disruptions.<br><br>
                   Invoice Amount: $2,540.00 <br><br>
                   Due Date: [Date] <br><br>                 
                   To view your invoice, click the link below:<br><br>
                   <span class="email-hover-text" title="securepaysolutions-support.com">SecurePay Solutions</span><br><br>
                   Thank you for your prompt attention to this matter.<br><br>
                   Sincerely, <br><br> 
                   Billing Department <br><br>
                   SecurePay Solutions`
        },
        {
            type: "Clone-Phishing",
            hover: "test2",
            sender: "Bob",
            subject: "Important Security Update",
            body: `Dear User,<br><br>
                   Your account is at risk due to outdated software. Please click the link below to immediately update your system to the latest version.<br><br>
                   <a href="http://malicious-update.com">Update Now</a><br><br>
                   This update is critical for your account's security. Failure to do so will leave your account vulnerable.<br><br>
                   Best regards,<br>
                   The Security Team`
        },
        {
            type: "Spear-Phishing",
            hover: "test3",
            sender: "Charlie",
            subject: "Reminder: Action Required to Secure Your Account",
            body: `Dear User,<br><br>
                   We have detected unusual activity in your account. To secure your account, please log in immediately by clicking the link below.<br><br>
                   <a href="http://phishing-login.com">Login Now</a><br><br>
                   If you do not act now, your account will be locked.<br><br>
                   Regards,<br>
                   The Account Security Team`
        }
    ];


    function displayEmail(index) {
        clearTickboxSelection()
        displaynextemailbutton = false;
        const email = emails[index];
        if (email) {
            const emailSenderElement = document.querySelector('.email-sender');
            emailSenderElement.textContent = email.sender[0]; // First letter only
            emailSenderElement.setAttribute('title', email.hover); // using tooltip
            document.querySelector('.email-subject-line').textContent = email.subject;
            document.querySelector('.email-body').innerHTML = email.body; //inner HTML to allow for line breaks
            if (index === 0 && instructionsConfirmed) {
                exampleInstructions()
            }

        }
        displaynextemailbutton = false;
        nextemailbutton()
    }

    function showNextEmail() {
        if (currentEmailIndex < emails.length - 1) {
            currentEmailIndex++;
            displayEmail(currentEmailIndex);
        }
    }

    // Initial display
    displayEmail(currentEmailIndex);


    function nextemailbutton() {
        const nextEmailButton = document.getElementById('next-email');
        if (displaynextemailbutton) { //check if true
            nextEmailButton.style.display = 'block';
            nextEmailButton.addEventListener('click', showNextEmail);
        } else {
            nextEmailButton.style.display = 'none';
            nextEmailButton.removeEventListener('click', showNextEmail);
        }
    }




    //Code for exmaple instructions

    function exampleInstructions() {
        let currentSlide = 0; // Track the current slide
        const slides = [
            {
                title: "Introduction",
                content: `<p>First, we will look at an example phishing email. These instructions will help equip you with appropriate methods to identify phishing emails and even further the types.</p>`
            },
            {
                title: "Identifying Suspicious Words",
                content: `<p>Suspicious words are ones which indicate a phishing email. You can highlight the words by double clicking a word or clicking at the start of the word and dragging the cursor over it. The next slides will help you identify the ones in this example. Take a moment to read through the example email and highlight any words which you belive could be suspicious</p>`
            },
            {
                title: "Step 1: Informal Greeting",
                content: `<p>A key indicator of a phishing email is an informal and generic greeting. For example, in this email, they use the term "Customer," which is generic and not specific. Furthermore, highlight the word “Customer” to complete this step.</p>`
            },
            {
                title: "Step 2: Time Urgency",
                content: `<p>Phishing emails often use time urgency to pressure the recipient into acting quickly. Look for phrases like “Immediate action required” or “Act now” to create a sense of urgency. In this example highlight the word “urgent” to complete this step.</p>`
            },
            {
                title: "Step 3: Poor Grammar",
                content: `<p>A common sign of a phishing email is poor grammar, such as misspellings, incorrect punctuation, or awkward phrasing. In the example email, the word "earlist" instead of "earliest" is an indication of phishing. Highlight the word “earlist” to complete this step.</p>`
            },
            {
                title: "Step 4: Unnecessary Subdomains",
                content: `<p>The real company might use a simple, professional domain like securepay.com or securepaysolutions.com. However, when hovering on the payment link, the true address is revealed. Try hovering now to reveal the real address.</p>`
            },
            {
                title: "Step 5: Hyphen Usage",
                content: `<p>Likewise, the real company might use a straightforward email address such as Billing@securepay.com. Instead, when hovering on the profile picture, the true email address is long and suspicious. Try hovering on the profile picture now to see the real address.</p>`
            }
        ];



        // Create the instruction box
        const instructionBox = document.createElement('div');
        instructionBox.className = 'instruction-box';
        instructionBox.innerHTML = `
            <strong id="instruction-title"></strong>
            <div id="instruction-content"></div>
            <div class="instruction-buttons">
                <button id="prev-slide" class="nav-button hidden">Previous</button>
                <button id="next-slide" class="nav-button">Next</button>
            </div>
        `;

        // Append instruction box
        emailContentContainer.appendChild(instructionBox);


        // load elments
        const titleElement = document.getElementById('instruction-title');
        const contentElement = document.getElementById('instruction-content');
        const prevButton = document.getElementById('prev-slide');
        const nextButton = document.getElementById('next-slide');

        // Update slide content
        function updateSlide() {
            titleElement.innerHTML = slides[currentSlide].title;
            contentElement.innerHTML = slides[currentSlide].content;

            // Toggle button visibility
            prevButton.classList.toggle('hidden', currentSlide === 0); //no previous on slide 1
            nextButton.textContent = currentSlide === slides.length - 1 ? "Finish" : "Next"; //replace next with finish on last slide
        }

        // Event listeners for buttons
        prevButton.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlide();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentSlide < slides.length - 1) {
                currentSlide++;
                updateSlide();
            } else {
                instructionBox.remove(); // Close the instruction box when "Finish" is clicked
                unhideInstructionBox()
            }
        });

        // open first slide when function is called
        updateSlide();
    }

    //hints for example email
    //Highlight phishing words code
    //suspicious words to check for highlighting
    const suspiciousWords = [
        "urgent", "customer", "earlist"
    ];

    const emailBodyElement = document.querySelector('.email-body');
    const emailSubjectElement = document.querySelector('.email-subject-line');
    const submitButton = document.getElementById('submit-highlight');

    // Allows highlighting of body elements words
    function enableHighlighting(element) {
        element.addEventListener('mouseup', () => {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);

            if (range && !range.collapsed) {
                const selectedText = selection.toString().trim();

                if (selectedText) {
                    const span = document.createElement('span');
                    span.classList.add('highlighted');
                    span.style.backgroundColor = 'yellow';
                    range.surroundContents(span);
                    selection.removeAllRanges();
                }
            }
        });
    }

    // Enable highlighting for both the email body and subject
    enableHighlighting(emailBodyElement);
    enableHighlighting(emailSubjectElement);

    // Handle submission when the submit button is clicked
    submitButton.addEventListener('click', () => {


        tickboxanswer(currentEmailIndex)


        if (selectedoption) {
            let correctCount = 0;
            let missedCount = 0;

            // Get all highlighted elements from both body and subject
            const highlightedBodyElements = emailBodyElement.querySelectorAll('.highlighted');
            const highlightedSubjectElements = emailSubjectElement.querySelectorAll('.highlighted');

            // Combine the highlighted elements from body and subject
            const allHighlightedElements = [...highlightedBodyElements, ...highlightedSubjectElements];

            // Check each highlighted element to see if it matches a suspicious word
            allHighlightedElements.forEach(span => {
                const word = span.textContent.trim().toLowerCase();
                if (suspiciousWords.includes(word)) {
                    span.style.backgroundColor = 'green';  // Correct word - green
                    correctCount++;
                } else {
                    span.style.backgroundColor = 'red';  // Incorrect word - red
                }
            });

            // Check for any suspicious words that were not highlighted
            suspiciousWords.forEach(word => {
                const wordFoundInBody = emailBodyElement.innerText.toLowerCase().includes(word);
                const wordFoundInSubject = emailSubjectElement.innerText.toLowerCase().includes(word);

                // If the word was found but not highlighted
                if (!Array.from(allHighlightedElements).some(span => span.textContent.trim().toLowerCase() === word)) {
                    missedCount++;
                    if (wordFoundInBody) {
                        highlightMissedWord(word, emailBodyElement);  // Highlight missed word in body
                    }
                    if (wordFoundInSubject) {
                        highlightMissedWord(word, emailSubjectElement);  // Highlight missed word in subject
                    }
                }
            });


            console.log(`Correct: ${correctCount}, Missed: ${missedCount}`);

            if (correctselectedoption) {
                displaynextemailbutton = true;
                nextemailbutton()
            }
        }
    });

    // Function to highlight missed suspicious word
    function highlightMissedWord(word, element) {
        const regex = new RegExp(word, 'gi');
        element.innerHTML = element.innerHTML.replace(regex, match =>
            `<span class="missed" style="background-color: orange;">${match}</span>`
        );
    }

    //function to bring back information

    // Listen for info to be clicked
    document.getElementById('reminder').addEventListener('click', reminder);

    function reminder() {
        if (emailtypereminder != true) {
            // Create the info box
            const reminder = document.createElement('div');
            reminder.className = 'reminder-box';

            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.innerHTML = '&times;'; // The cross symbol


            // Set the inner HTML for the information box with line breaks
            reminder.innerHTML = `
            <strong>Deceptive Phishing</strong><br>
            Fraudulent emails that impersonate legitimate entities to steal sensitive information like passwords or credit card details.<br><br>
            
            <strong>Clone Phishing</strong><br>
            Replicas of legitimate emails with malicious links or attachments, often using 'resend' or 'updated version' to trick the victim.<br><br>
            
            <strong>Spear Phishing</strong><br>
            Targeted attacks aimed at specific individuals or organizations, often using personal information to craft convincing emails.<br><br>
        `;

            emailListContainer.appendChild(reminder);
            // Append the close button to the info box
            reminder.appendChild(closeButton);
            emailtypereminder = true;


            closeButton.addEventListener('click', () => {
                reminder.remove();
                emailtypereminder = false;
            });

        }
    }


    //function to check tickbox answer
    function tickboxanswer(currentEmailIndex) {
        // Get the current email type
        const currentEmailType = emails[currentEmailIndex].type; // Fetch type from the emails array
        const options = document.getElementsByName("option"); //store all possible options
        let selectedValue = null;

        // Find the selected radio button value
        for (const option of options) {
            if (option.checked) {
                selectedValue = option.value;
                break;
            }
        }

        // Feedback container
        const feedbackElement = document.getElementById("feedback");

        // Check if the selected value matches the current email type
        if (selectedValue === currentEmailType) {
            selectedoption = true;
            correctselectedoption= true;
            feedbackElement.textContent = `Correct! The answer is ${currentEmailType}.`;
            feedbackElement.style.color = "green"; // Change feedback text color for correct answer
            if (currentEmailIndex == 0) {
                emailtask1 = true;
                console.log("Task 1 correct")

                // Update the task list status for Task 1
                const task1Status = document.querySelector("#email-task-1-status");
                task1Status.textContent = "Complete";
                task1Status.classList.remove("incomplete");
                task1Status.classList.add("complete");

                // Call passwordComplete to check all tasks
                emailComplete();
            }
            else if (currentEmailIndex === 1) {
                emailtask2 = true;
                console.log("Task 2 correct")
                // Update the task list status for Task 2
                const task2Status = document.querySelector("#email-task-2-status");
                task2Status.textContent = "Complete";
                task2Status.classList.remove("incomplete");
                task2Status.classList.add("complete");

                // Call emailComplete to check all tasks
                emailComplete();
            } else if (currentEmailIndex === 2) {
                emailtask3 = true;
                console.log("Task 3 correct")

                // Update the task list status for Task 3
                const task3Status = document.querySelector("#email-task-3-status");
                task3Status.textContent = "Complete";
                task3Status.classList.remove("incomplete");
                task3Status.classList.add("complete");

                // Call emailComplete to check all tasks
                emailComplete();
            }
        } else if (selectedValue) {
            selectedoption = true;
            correctselectedoption= false;
            feedbackElement.textContent = `Incorrect. You selected: ${selectedValue}. The correct answer is ${currentEmailType}.`;
            feedbackElement.style.color = "red"; // Change feedback text color for incorrect answer
        } else {
            selectedoption = false;
            correctselectedoption= false;
            feedbackElement.textContent = "Please select an option before submitting.";
            feedbackElement.style.color = "orange"; // Change feedback text color for no selection
        }
    }

    function clearTickboxSelection() {
        const options = document.getElementsByName("option");
        for (const option of options) {
            option.checked = false; // clearing selection
        }
        // Clear feedback
        const feedbackElement = document.getElementById("feedback");
        feedbackElement.textContent = "";
    }

    // Function to unhide the entire instruction box
    function unhideInstructionBox() {
        const multiplechoiceBox = document.querySelector('.multiplechoice-box');
        multiplechoiceBox.classList.remove('hidden'); // unhide the box by removing hidden
    }


    // Function to mark all email tasks as complete
    function emailComplete() {
        // Check if all tasks are complete
        if (emailtask1 && emailtask2 && emailtask3 && emailtaskComplete != true) {
            emailtaskComplete = true;
            // Add a message at the bottom for next steps
            const taskElement = document.querySelector(".Taskemail");
            taskElement.innerHTML += `
            <div class="next-steps">
                <p>Task Complete</p>
            </div>
        `;
        } else {
            console.log("Not all tasks are complete yet.");
        }
    }

    //PASSWORD EXERCISE CODE 
    //
    //
    //
    //
    //

    function togglePassword() {
        if (passwordContainer.style.display === 'block') {
            passwordContainer.style.display = 'none';
            desktopArea.style.display = 'flex';
        } else {
            passwordContainer.style.display = 'block';
            inboxContainer.style.display = 'none';
            desktopArea.style.display = 'none';
        }

        // Show instructions if it's the first time opening
        if (FirstOpenPassword) {
            instructionPasswordModel.style.display = 'flex'; //working
            passwordContainerBlur.classList.add('blurred'); // Apply the blur
            FirstOpenPassword = false;
        }
    }


    confirmpasswordButton.addEventListener('click', () => {
        instructionPasswordModel.style.display = 'none';
        passwordContainerBlur.classList.remove('blurred'); // Remove the blur
    });





    // Toggle inbox on desktop and taskbar
    passwordIconDesktop.addEventListener('click', togglePassword);
    passwordIconTaskbar.addEventListener('click', togglePassword);
    passwordIconProgress.addEventListener('click', togglePassword);

    // Go back to the desktop
    backToDesktopPassword.addEventListener('click', function () {
        passwordContainer.style.display = 'none';
        desktopArea.style.display = 'flex';
    });

    passwordInput.addEventListener('input', function (event) {
        let password = event.target.value;
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
            // Check if password strength is "Strong" (green color)
            if (strengthText === 'Strong') {
                passwordtask1 = true;

                // Update the task list status for Task 1
                const task1Status = document.querySelector("#task-1-status");
                task1Status.textContent = "Complete";
                task1Status.classList.remove("incomplete");
                task1Status.classList.add("complete");

                // Call passwordComplete to check all tasks
                passwordComplete();
            }
        });

        text.textContent = strengthText;
        text.style.color = gradientColor;
    });


    //IMPLEMENTATION OF PWNED API

    // SHA-1 Hashing Function (to hash the password)
    function encrypt(str) {
        const utf8 = new TextEncoder().encode(str);
        return crypto.subtle.digest('SHA-1', utf8).then(hashBuffer => {
            return Array.from(new Uint8Array(hashBuffer))
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join('');
        });
    }

    document.getElementById('checkButton').addEventListener('click', async () => {
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
    });


    // Function to mark all password tasks as complete
    function passwordComplete() {
        // Check if all tasks are complete
        if (passwordtask1 && passwordtask2 && passwordtask3 && passwordtaskComplete != true) {
            passwordtaskComplete = true;
            // Add a message at the bottom for next steps
            const taskPasswordElement = document.querySelector(".Taskpassword");
            taskPasswordElement.innerHTML += `
            <div class="next-steps">
                <p>You can test more passwords or minimise this tab and move on to the next task.</p>
            </div>
        `;
        } else {
            console.log("Not all tasks are complete yet.");
        }
    }
});


//Clock Functionality

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Format hours and minutes to always show two digits
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Display time
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;

    // Update clock with current time
    document.getElementById('clock').textContent = timeString;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Call the function once to show the initial time
updateClock();


const userEmail = localStorage.getItem('userEmail'); // Retrieve the email from localStorage

if (userEmail) {
    const emailElement = document.getElementById('email');
    emailElement.innerText = userEmail; // Set the email to the div
} else {
    console.log('User email not found');
}