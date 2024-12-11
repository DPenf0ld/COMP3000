document.addEventListener('DOMContentLoaded', function () {
    //email code
    const emailIconDesktop = document.getElementById('email-icon');        // Icon for email on desktop
    const emailIconTaskbar = document.getElementById('taskbar-email');     // Icon for email on taskbar
    const inboxContainer = document.getElementById('inbox-container');     // Inbox container
    const emailContainer = document.getElementById('email-interface');     // Inbox container

    const instructionModel = document.getElementById('instructions-email'); // Instruction model
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const confirmButton = document.getElementById('confirm-button');

    let instructionsConfirmed = false; //used to display example email instructions

    //Phishing information code
    let isFirstOpen = true; // Track if inbox is opened for the first time
    let currentPage = 0; // Track the current page of the model
    let displaynextemailbutton = false; //do not show next email button orginally

    //password code
    const passwordIconDesktop = document.getElementById('password-icon');        // Icon for password on desktop
    const passwordIconTaskbar = document.getElementById('taskbar-password');     // Icon for password on taskbar
    const passwordContainer = document.getElementById('password-container');

    let passwordInput = document.getElementById('password');
    let passwordStrengths = document.querySelectorAll('.password-strength')


    //Desktop code
    const desktopArea = document.getElementById('desktop-area');           // Desktop area
    const backToDesktop = document.getElementById('close-inbox');      // Button or link to return to desktop




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
        document.body.appendChild(instructionBox);

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

        displaynextemailbutton = true;

        nextemailbutton()

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
        // Create the info box
        const reminder = document.createElement('div');
        reminder.className = 'reminder-box';

        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '&times;'; // The cross symbol

        closeButton.addEventListener('click', () => {
            reminder.remove();
        });

        // Set the inner HTML for the information box with line breaks
        reminder.innerHTML = `
            <strong>Deceptive Phishing</strong><br>
            Fraudulent emails that impersonate legitimate entities to steal sensitive information like passwords or credit card details.<br><br>
            
            <strong>Clone Phishing</strong><br>
            Replicas of legitimate emails with malicious links or attachments, often using 'resend' or 'updated version' to trick the victim.<br><br>
            
            <strong>Spear Phishing</strong><br>
            Targeted attacks aimed at specific individuals or organizations, often using personal information to craft convincing emails.<br><br>
        `;

        document.body.appendChild(reminder);
        // Append the close button to the info box
        reminder.appendChild(closeButton);
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
            feedbackElement.textContent = `Correct! The answer is ${currentEmailType}.`;
            feedbackElement.style.color = "green"; // Change feedback text color for correct answer
        } else if (selectedValue) {
            feedbackElement.textContent = `Incorrect. You selected: ${selectedValue}. The correct answer is ${currentEmailType}.`;
            feedbackElement.style.color = "red"; // Change feedback text color for incorrect answer
        } else {
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
            desktopArea.style.display = 'none';
        }
    }

    // Toggle inbox on desktop and taskbar
    passwordIconDesktop.addEventListener('click', togglePassword);
    passwordIconTaskbar.addEventListener('click', togglePassword);

    // Go back to the desktop
    backToDesktop.addEventListener('click', function () {
        passwordContainer.style.display = 'none';
        desktopArea.style.display = 'flex';
    });

    passwordInput.addEventListener('input', function (event) {
        let password = event.target.value;
        let strength = Math.min(password.length, 12);
        let degree = strength * 30; // calculate degree value based on password strength
        let gradientColor = strength <= 4 ? '#ff2c1c' : (strength <= 8 ? '#ff9800' : '#12ff12');
        let strengthText = strength <= 4 ? 'Weak' : (strength <= 8 ? 'Medium' : 'Strong');
    
        passwordStrengths.forEach(passwordStrength => {
            passwordStrength.style.background = `conic-gradient(${gradientColor} ${degree}deg, #1115 ${degree}deg)`;
        });
    
        text.textContent = strengthText;
        text.style.color = gradientColor;
    });
    





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