document.addEventListener('DOMContentLoaded', function () {
    const emailIconDesktop = document.getElementById('email-icon');        // Icon for email on desktop
    const emailIconTaskbar = document.getElementById('taskbar-email');     // Icon for email on taskbar
    const desktopArea = document.getElementById('desktop-area');           // Desktop area
    const inboxContainer = document.getElementById('inbox-container');     // Inbox container
    const backToDesktop = document.getElementById('close-inbox');      // Button or link to return to desktop

    const instructionModel = document.getElementById('instructions-email'); // Instruction model
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const confirmButton = document.getElementById('confirm-button');

    let instructionsConfirmed = false; //used to display example email instructions


    //Phishing information code
    let isFirstOpen = true; // Track if inbox is opened for the first time
    let currentPage = 0; // Track the current page of the model

    // Pages content
    const pages = [
        {
            title: "Welcome to the Email Inbox!",
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
            hover: "billing-securepay@securepaysolutions-support.com", //example email
            sender: "SecurePay Solutions",
            subject: "Urgent Account Update Required EXAMPLE",
            body: `Dear Customer,<br><br>
                   Your invoice #[12345] is now ready.<br><br>
                   Please find the attached invoice for your review. Kindly make the payment at your earliest convenience to avoid service disruptions.<br><br>
                   <br><br>
                   Invoice Amount: $2,540.00 <br><br>
                   Due Date: [Date] <br><br>
                   <br><br>                   
                   To view your invoice, click the link below:<br><br>
                   <span class="email-hover-text" title="securepaysolutions-support.com">SecurePay Solutions</span><br><br>
                   <br><br>
                   Thank you for your prompt attention to this matter.<br><br>
                   <br><br>
                   Sincerely, <br><br> 
                   Billing Department <br><br>
                   SecurePay Solutions`
        },
        {
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
        const email = emails[index];
        if (email) {
            const emailSenderElement = document.querySelector('.email-sender');
            emailSenderElement.textContent = email.sender[0]; // First letter only
            emailSenderElement.setAttribute('title', email.hover); // using tooltip
            document.querySelector('.email-subject-line').textContent = email.subject;
            document.querySelector('.email-body').innerHTML = email.body; //inner HTML to allow for line breaks
            if (index===0 && instructionsConfirmed) {
                // Create an instruction box
                const instructionBox = document.createElement('div');
                instructionBox.className = 'instruction-box';
                instructionBox.innerHTML = `
                    <strong>Instructions:</strong>
                    <p>Hover over the sender to see their true email address.</p>
                    <p>Notice the subject uses urgency to create panic.</p>
                    <p>The body is informal and uses the generic term "Customer."</p>
                    <button id="close-instruction" class="close-button">Close</button>
                `;
    
                // Append instruction box to the body or a parent container
                document.body.appendChild(instructionBox);
    
                // Add close functionality for the instruction box
                const closeButton = document.getElementById('close-instruction');
                closeButton.addEventListener('click', () => {
                    instructionBox.remove();
                });
            }

        }
    }

   






    function showNextEmail() {
        if (currentEmailIndex < emails.length - 1) {
            currentEmailIndex++;
            displayEmail(currentEmailIndex);
        }
    }

    // Initial display
    displayEmail(currentEmailIndex);

    // Add listener to Start button
    const start = document.createElement('button');
    start.textContent = "Start";
    start.classList.add('nav-button');
    start.addEventListener('click', showNextEmail);

    // Add the button to the email content area
    document.querySelector('.email-content').appendChild(start);


    //hints for example email
    //Highlight phishing words code

    //suspicious words to check for highlighting
    const suspiciousWords = [
        "urgent", "verify", "suspended", "immediate", "click", "update",
        "account", "security", "warning", "important", "failure",
        "verify your identity", "suspicious activity", "login", "click here",
        "claim", "free", "risk", "action required", "update your system",
        "change your password", "secure your account", "account locked",
        "confirm your email", "unauthorized access", "important notice",
        "last chance", "act now", "report", "limited time"
    ];

    const emailBodyElement = document.querySelector('.email-body');
    const submitButton = document.getElementById('submit-highlight');

    // Allows highlighting of any words
    emailBodyElement.addEventListener('mouseup', () => {
        const selection = window.getSelection(); // Get the current text selection
        const range = selection.getRangeAt(0);  // Get the range of the selection

        // Checks to see if there is a range
        if (range && !range.collapsed) {
            const selectedText = selection.toString().trim(); // Get the selected text as a string

            // Checks if there is text
            if (selectedText) {
                const span = document.createElement('span'); // Create span
                span.classList.add('highlighted'); // Styles for span
                span.style.backgroundColor = 'yellow'; // highlight colour to yellow
                range.surroundContents(span); // Wrap the selected text with the span
                selection.removeAllRanges(); // Clear the selection ready for next
            }
        }
    });

    // Handle submission when the submit button is clicked
    submitButton.addEventListener('click', () => {
        // Get all elements that have been highlighted
        const highlightedElements = emailBodyElement.querySelectorAll('.highlighted');
        let correctCount = 0; // Counter for correct
        let missedCount = 0; // Counter for missed

        // Check each highlighted element to see if it matches a suspicious word
        highlightedElements.forEach(span => {
            const word = span.textContent.trim().toLowerCase(); // convert to lowercase
            if (suspiciousWords.includes(word)) {
                span.style.backgroundColor = 'green'; // Change the highlight colour to green 
                correctCount++;
            } else {
                span.style.backgroundColor = 'red'; // Change the highlight colour to red
            }
        });

        // Check for any suspicious words that were not highlighted
        suspiciousWords.forEach(word => {
            if (!Array.from(highlightedElements).some(span => span.textContent.trim().toLowerCase() === word)) {
                missedCount++;
                highlightMissedWord(word); // Call function to highlight 
            }
        });
    });

    //highlight missed suspicious word
    function highlightMissedWord(word) {
        // g means all words can be looked through and i means ignore cap sens
        const regex = new RegExp(word, 'gi');

        // Replace with orange highlight
        emailBodyElement.innerHTML = emailBodyElement.innerHTML.replace(regex, match =>
            `<span class="missed" style="background-color: orange;">${match}</span>`
        );
    }




});

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