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


    //Phishing information code
    let isFirstOpen = true; // Track if inbox is opened for the first time
    let currentPage = 0; // Track the current page of the model

    // Pages content
    const pages = [
        {
            title: "Welcome to the Email Inbox",
            content: "Phishing emails are fraudulent attempts to steal sensitive information, such as passwords or financial details, by pretending to be a trustworthy entity. These emails often contain suspicious links or attachments designed to trick you."
        },
        {
            title: "What are Phishing Emails?",
            content: "Phishing emails aim to deceive recipients into believing they are from legitimate sources. They use techniques like fake sender addresses, urgent language, and malicious links or attachments."
        },
        {
            title: "Types of Phishing Emails",
            content: "Common types include spear-phishing (targeted attacks), whaling (targeting executives), and smishing (phishing via SMS). Each has unique methods but shares the goal of extracting sensitive information."
        },
        {
            title: "Indications of Phishing Emails",
            content: "Indicators include: spelling errors, suspicious email addresses, unexpected attachments, and a sense of urgency to act quickly. Always verify before clicking or replying."
        },
        {
            title: "Start Exercise",
            content: "Not all of these are phishing emails, but the ones used are real-world examples. Let's identify the phishing attempts!"
        }
    ];

    //update the model content based on the current page
    function updateModelContent() {
        const titleElement = instructionModel.querySelector('h2');
        const contentElement = instructionModel.querySelector('p');

        // Update title and content
        titleElement.textContent = pages[currentPage].title;
        contentElement.textContent = pages[currentPage].content;

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
        console.log("User confirmed and is ready to start the exercise.");
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
            sender: "Alice",
            subject: "Urgent Account Update Required",
            body: `Dear Customer,<br><br>
                   Your account has been temporarily suspended due to suspicious activity. 
                   To restore access, you must verify your identity immediately. 
                   Please click the link below and enter your login credentials.<br><br>
                   <a href="http://suspicious-link.com">Verify Your Account Now</a><br><br>
                   Failure to act within 24 hours will result in permanent account suspension.<br><br>
                   Regards,<br>
                   The Support Team`
        },
        {
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
            document.querySelector('.email-sender').textContent = email.sender[0]; // First letter only
            document.querySelector('.email-subject-line').textContent = email.subject;
            document.querySelector('.email-body').innerHTML = email.body; //inner HTML to allow for line breaks
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