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


    //Code to display emails
    let currentEmailIndex = 0;

    const emails = [
        {
            sender: "Alice",
            subject: "Welcome to GuardPoint",
            body: "Hi there! Welcome to your GuardPoint inbox. Stay vigilant!"
        },
        {
            sender: "Bob",
            subject: "Important Security Update",
            body: "Please update your software to the latest version to stay secure."
        },
        {
            sender: "Charlie",
            subject: "Reminder",
            body: "Don't forget to complete your phishing training by the end of this week."
        }
    ];

    function displayEmail(index) {
        const email = emails[index];
        if (email) {
            document.querySelector('.email-sender').textContent = email.sender[0]; // First letter only
            document.querySelector('.email-subject-line').textContent = email.subject;
            document.querySelector('.email-body').textContent = email.body;
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