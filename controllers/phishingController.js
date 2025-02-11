console.log('phishingController.js loaded');

export let emailopen = false;
export let emailtaskComplete = false;
let correctCount = 0;
let missedCount = 0;
let currentEmailIndex = 0;
let displaynextemailbutton = false; //do not show next email button orginally
let selectedoption = false;
let instructionsConfirmed = false; //used to display example email instructions
let correctselectedoption = false;
let emailtask1 = false;
let emailtask2 = false;
let emailtask3 = false;
let arrow2 = false;
let arrow3 = false;
let arrow4 = false;
let arrow5 = false;
let arrow6 = false;
let phishingcount = 0;
let emailtypereminder = false;
let currentPage = 0; // Track the current page of the model
let confirmClose = false
let instructionboxCreated = false;



//const emailContentContainer = document.querySelector('.email-content');

const profileContainer = document.getElementById('profile-container');
const resetEmail = document.getElementById('reset-email');
const firstName = localStorage.getItem('firstName');
const desktopArea = document.getElementById('desktop-area');
const inboxContainer = document.getElementById('inbox-container');
const emailListContainer = document.querySelector('.email-list');
const nextButton = document.getElementById('next-button');
const confirmButton = document.getElementById('confirm-button');
const emailBodyElement = document.querySelector('.email-body');
const emailSubjectElement = document.querySelector('.email-subject-line')
const instructionModel = document.getElementById('instructions-email'); // Instruction model
const emailContainer = document.getElementById('email-interface');     // Inbox container
const prevButton = document.getElementById('prev-button');
const leavetaskModel = document.getElementById('leave-task');
const submitButton = document.getElementById('submit-highlight');

//suspicious words to check for highlighting
const suspiciousWords = [
    "urgent", "customer", "earlist", "earliest", "verify", "immediately",
    "action", "login", "failure", "restricted", "confirm", "suspended",
    "validate", "dispute", "locked", "alert", "refund", "unauthorised",
    "reset", "identity", "unusual", "warning", "verrify", "custumer",
    "earliest", "logon", "loging", "failur", "restringted", "suspend",
    "confrm", "valdate", "disput", "alrt", "unautherised", "idnetity",
    "warnning"
];

// Email content
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
               Secure Pay Solutions Ltd`
    }
];

// Pages content
const pages = [
    {
        title: ` 1️⃣ Welcome to Your Inbox, ${firstName}!`, //add firstName here
        content: `
            <strong>💡 Goal: </strong>Learn how to spot phishing emails—fake messages designed to steal your personal data.
            <br><br>
            <strong>🚨 Warning: </strong>Phishing emails often contain fake links or attachments. Stay sharp!
        `
    },
    {
        title: "2️⃣ What is Phishing?",
        content: `
            🎭 Phishing emails pretend to be from real companies but try to trick you.<br><br>
            <strong>⚠️ Common Tactics:</strong><br>
            ✅ Fake sender addresses</strong><br>
            ✅ Urgent or scary messages</strong><br>
            ✅ Suspicious links or attachments</strong><br><br>
            <strong>💬 Their Goal? </strong>Steal passwords, money, or personal data.
        `
    },
    {
        title: "3️⃣ 3 Types of Phishing",
        content: `
            <strong>🔎 Deceptive Phishing: </strong>Generic scam emails pretending to be real (e.g., fake bank alerts).<br>
            <strong>🔄 Clone Phishing: </strong> Copies a real email but swaps links for dangerous ones.<br>
            <strong>🎯 Spear Phishing:</strong> Highly personalised attacks using personal details.<br><br>
        `
    },
    {
        title: "4️⃣ Spot the Red Flags!",
        content: `
            🚩 <strong>Look for:</strong><br><br>
            ✖️ Bad grammar or typos<br>
            ✖️ Suspicious sender addresses<br>
            ✖️ Urgent or threatening language<br>
            ✖️ Unexpected attachments<br>
            ✖️ Fake-looking links (hover to check!)<br>
            <strong>💡 Pro Tip:</strong>Unsure? Contact the real company directly.
        `
    },
    {
        title: "5️⃣ Your Task",
        content: `
            📌 Highlight suspicious words or phrases.<br>
            📌 Classify the email as Deceptive Phishing, Clone Phishing, Spear Phishing, or Safe.<br>
            📌 Test yourself in a final quiz.<br><br>
            <strong>👉 Let’s begin!</strong>
        `
    }
];


export function initialiseEmail() {
    instructionboxCreated = false,
        emailopen = false,
        correctCount = 0,
        missedCount = 0,
        currentEmailIndex = 0,
        displaynextemailbutton = false,
        selectedoption = false,
        instructionsConfirmed = false,
        correctselectedoption = false,
        arrow2 = false,
        arrow3 = false,
        arrow4 = false,
        arrow5 = false,
        arrow6 = false,
        phishingcount = 0,
        emailtypereminder = false,
        currentPage = 0,
        confirmClose = false

    prevButton.classList.add('hidden'); // Hide previous button on reset
    nextButton.classList.remove('hidden'); // Show next button on reset
    confirmButton.classList.add('hidden'); // Hide confirm button on reset

    if (emailtaskComplete == false) {
        instructionModel.style.display = 'flex'; //working
        emailContainer.classList.add('blurred'); // Apply the blur

        emailtask1 = false;
        document.querySelector("#email-task-1-status").textContent = "incomplete";
        document.querySelector("#email-task-1-status").classList.remove("complete");
        document.querySelector("#email-task-1-status").classList.add("incomplete");

        emailtask2 = false;
        document.querySelector("#email-task-2-status").textContent = "Incomplete";
        document.querySelector("#email-task-2-status").classList.remove("complete");
        document.querySelector("#email-task-2-status").classList.add("incomplete");

        emailtask3 = false;
        document.querySelector("#email-task-3-status").textContent = "incomplete";
        document.querySelector("#email-task-3-status").classList.remove("complete");
        document.querySelector("#email-task-3-status").classList.add("incomplete");


        displayEmail(currentEmailIndex)
        updateModelContent();
        emailComplete();
    }

}

export function submitButtonFunction() {
    tickboxanswer(currentEmailIndex)
    if (selectedoption) {


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

    }

    if (correctCount == 3) {
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
}

export function backToDesktopPhishing() {
    if (emailtaskComplete) {
        inboxContainer.style.display = 'none';
        desktopArea.style.display = 'flex';
    }
    else {
        leavetaskModel.style.display = 'flex'; //working
        desktopArea.classList.add('blurred'); // Apply the blur
    }
}

export function backphishingFunction() {
    leavetaskModel.style.display = 'none';
    desktopArea.classList.remove('blurred'); // remove the blur
}



export function confirmphishingFunction() {
    desktopArea.classList.remove('blurred'); // remove the blur
    confirmClose = true;
    emailopen = false;
    emailtaskComplete = false;
    instructionboxCreated = true;

    const emailIcon = document.querySelector("#progress-email img");
    if (emailIcon) {
        emailIcon.src = "assets/icons/email-icon.png";
    }

    //disable reset 
    if (resetEmail.style.display === 'block') {
        resetEmail.style.display = 'none';
    }

    //disable reset 
    if (profileContainer.style.display === 'block') {
        profileContainer.style.display = 'none' //hides profile
    }



    unhideInstructionBox()
    markTaskIncomplete()
    resetPhishingTask()
    closeInbox()
}

function resetPhishingTask() {
    leavetaskModel.style.display = 'none';
    desktopArea.classList.remove('blurred');
}



// Function to highlight missed suspicious word
export function highlightMissedWord(word, element) {
    const regex = new RegExp(word, 'gi');
    element.innerHTML = element.innerHTML.replace(regex, match =>
        `<span class="missed" style="background-color: orange;">${match}</span>`
    );
}

// Allows highlighting of body elements words
export function enableHighlighting(element) {
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

//update the model content based on the current page
export function updateModelContent() {
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

export function prevButtonFunction() {
    if (currentPage > 0) {
        currentPage--;
        updateModelContent();
    }
}

export function nextButtonFunction() {
    if (currentPage < pages.length - 1) {
        currentPage++;
        updateModelContent();
    }
}

export function confirmButtonFunction() {
    instructionModel.style.display = 'none';
    instructionsConfirmed = true; // listener to display instructions once user confirms
    emailContainer.classList.remove('blurred'); // Remove the blur
    displayEmail(currentEmailIndex);
}

export function firstOpenFunction() {
    instructionModel.style.display = 'flex'; //working
    emailContainer.classList.add('blurred'); // Apply the blur
}

export function emailComplete() {
    // Check if all tasks are complete
    if (emailtask1 && emailtask2 && emailtask3 || emailtaskComplete) {
        emailtaskComplete = true;
        markTaskComplete()
        // Update the icon to show the completed status
        const emailIcon = document.querySelector("#progress-email img");
        if (emailIcon) {
            emailIcon.src = "assets/icons/email-tick-icon.png";
        }

        //enable reset since task is complete
        if (resetEmail.style.display === 'none') {
            resetEmail.style.display = 'block';
        }
        // Add a message at the bottom for next steps
        const taskElement = document.querySelector(".Taskemail");
        taskElement.innerHTML += `
        <div class="next-steps">
            <p>Task Complete</p>
        </div>
    `;
        emailopen = false;
    } else {
        console.log("Not all tasks are complete yet.");
        const taskEmailElement = document.querySelector(".Taskemail");
        const nextStepsDiv = taskEmailElement.querySelector(".next-steps");
        if (nextStepsDiv) {
            nextStepsDiv.remove();
        }
    }
}

export function nextemailbutton() {
    const nextEmailButton = document.getElementById('next-email');
    if (displaynextemailbutton) { //check if true
        nextEmailButton.style.display = 'block'; //enabling
        nextEmailButton.addEventListener('click', showNextEmail);
        submitButton.style.display = 'none';
    } else {
        nextEmailButton.style.display = 'none'; //disabling
        nextEmailButton.removeEventListener('click', showNextEmail);
        submitButton.style.display = 'block';
    }
}

export function resetEmailFromDesktop() {
    leavetaskModel.style.display = 'flex'; //working
    desktopArea.classList.add('blurred'); // Apply the blur
}





export function exampleInstructions() {
    let currentSlide = 0; // Track the current slide
    const slides = [
        {
            title: "🔎 1. Spot Suspicious Words",
            content: `<br>
            <strong>👆 How? </strong>Double-click a word<br><br>
        `
        },
        {
            title: "📩 2. Generic or Informal Greetings",
            content: `<br>
            🚩 Scammers often use vague greetings like "Dear Customer".<br><br>
            <strong>📌 Task: </strong>Highlight "Customer" in the example email.<br><br>
        `
        },
        {
            title: "⏳ 3. Urgency Tricks",
            content: `<br>
            🚨 Scammers rush you! Phrases like "Act Now" create panic.<br><br>
            <strong>📌 Task: </strong>Highlight "urgent" in the email.<br><br>
        `
        },
        {
            title: "📝 4. Bad Grammar & Typos",
            content: `<br>
            ❌ Phishing emails often have errors like "earlist" instead of "earliest".<br><br>
            <strong>📌 Task: </strong>Highlight "earlist".<br><br>`
        },
        {
            title: "🌐 5. Suspicious Links",
            content: `<br>
            ⚠️ Hover over links—phishing emails use fake domains (e.g., secure-payments.support.com instead of securepay.com).<br><br>
            <strong>📌 Task: </strong>Hover over the link in the email (DO NOT CLICK!).<br><br>`
        },
        {
            title: "📧 6. Fake Email Addresses",
            content: `<br>
            📌 Hover over the sender’s email to reveal its true address.<br><br>
            `
        }
    ];
    let instructionBox = document.querySelector('.instruction-box'); // Declare outside

    if (!instructionboxCreated) {
        if (instructionBox) {
            console.log("Unhiding Instructions")
            console.log(currentSlide)
            instructionBox.classList.remove('hidden');
        } else {
            console.log("Creating Instructions for first time")
            console.log(currentSlide)
            instructionBox = document.createElement('div');
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
            emailListContainer.appendChild(instructionBox);
        }

        instructionboxCreated = true;
    } else {
        instructionboxCreated = false;
        instructionBox = document.querySelector('.instruction-box'); // Get the box

        if (instructionBox) {
            console.log("Hiding Instructions and Resetting Slide count")

            instructionBox.classList.add('hidden');
            currentSlide = 0;
            console.log(currentSlide)
        } else {
            console.error("Instruction box not found");
        }
    }


    const contentElement = document.getElementById('instruction-content'); //cannot find
    const titleElement = document.getElementById('instruction-title');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');

    // Update example slides c
    function updateSlide() {
        console.log("Slide Number:" + currentSlide)
        console.log("Slide Length:" + slides.length)
        titleElement.innerHTML = slides[currentSlide].title;
        contentElement.innerHTML = slides[currentSlide].content;
        const emailSenderElement = document.querySelector('.email-sender');
        const emailBodyElement = document.querySelector('.email-body');
        const emailSubjectElement = document.querySelector('.email-subject-line')

        console.log(titleElement)
        // Toggle button visibility
        prevButton.classList.toggle('hidden', currentSlide === 0); //no previous on slide 1
        nextButton.textContent = currentSlide === slides.length - 1 ? "Finish" : "Next"; //replace next with finish on last slide
        if (currentSlide === 1 && arrow2 == false) {
            arrow2 = true
            highlightText(emailBodyElement, "Customer");
            console.log("Highlight Customer");
        } else if (currentSlide === 2 && arrow3 == false) {
            arrow3 = true
            highlightText(emailSubjectElement, "urgent");
            console.log("Highlight Urgent");
        } else if (currentSlide === 3 && arrow4 == false) {
            arrow4 = true
            highlightText(emailBodyElement, "earlist");
            console.log("Highlight Earlist");
        } else if (currentSlide === 4 && arrow5 == false) {
            arrow5 = true
            highlightText(emailBodyElement, "SecurePay Solutions");
            console.log("Highlight securepay.com");
        } else if (currentSlide === 5 && arrow6 == false) {
            arrow6 = true
            highlightText(emailSenderElement, "S");
            console.log("Highlight Profile Picture");
        } else {
            console.log("Invalid slide number");
        }
    }

    function highlightText(element, word) {
        const regex = new RegExp(`(${word})`, 'gi'); // Case-insensitive match
        element.innerHTML = element.innerHTML.replace(regex, (match) => {
            // Wrap in span and add arrow 
            return `<span class="highlight">${match}<span class="arrow-icon"><img src="assets/icons/arrow-icon.png" alt="arrow"></span></span>`;
        });
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
            console.log("Finish button clicked");
            unhideInstructionBox()
        }
    });

    // open first slide when function is called
    updateSlide();

}

// ai generated email and add to email array
export async function addGeneratedEmail() {
    if (currentEmailIndex >= 0) { //SET TO 0 FOR TESTING
        try {
            const response = await fetch('http://localhost:3000/generate-phishing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName: localStorage.getItem('firstName') })
            });

            if (!response.ok) throw new Error('Failed to fetch generated email');

            const generatedEmail = await response.json();

            // Add the generated email to the array
            emails.push(generatedEmail);

            console.log('Updated Emails Array:', emails);
        } catch (error) {
            console.error('Error adding generated email:', error);
        }
    }
    displayEmail(currentEmailIndex);
}

// ai generated email and add to email array PRELOADED
export async function preloademails() {
    //pre load 20 emails SET TO 0 FOR TESTING
    for (let i = 0; i < 0; i++) {
        try {
            const response = await fetch('http://localhost:3000/generate-phishing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName: localStorage.getItem('firstName') })
            });

            if (!response.ok) throw new Error('Failed to fetch generated email');

            const generatedEmail = await response.json();

            // Add the generated email to the array
            emails.push(generatedEmail);

            console.log('Updated Emails Array:', emails);
        } catch (error) {
            console.error('Error adding generated email:', error);
        }
    }
}

export function reminder() {
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
A fake email that <strong>impersonates a trusted company</strong> to steal personal details.<br><br>

<strong>Clone Phishing</strong><br>
A <strong>copy of a real email</strong> but with dangerous changes (links and attachments).<br><br>

<strong>Spear Phishing</strong><br>
A <strong>targeted scam using your personal details</strong> to seem more convincing.<br><br>

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

export function tickboxanswer(currentEmailIndex) {
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
        phishingcount++;
        selectedoption = true;
        correctselectedoption = true;
        feedbackElement.textContent = `Correct! The answer is ${currentEmailType}.`;
        feedbackElement.style.color = "green"; // Change feedback text color for correct answer
        if (currentEmailIndex == 0) {
            emailtask1 = true;
            console.log("Example Complete")

            // Update the task list status for Task 1
            const task1Status = document.querySelector("#email-task-1-status");
            task1Status.textContent = "Complete";
            task1Status.classList.remove("incomplete");
            task1Status.classList.add("complete");

            // Call email Complete to check all tasks
            emailComplete();
        }
        if (phishingcount == 1) { //CHNAGE BACK TO 5
            emailtask2 = true;
            console.log("Task 2 correct")
            // Update the task list status for Task 2
            const task2Status = document.querySelector("#email-task-2-status");
            task2Status.textContent = "Complete";
            task2Status.classList.remove("incomplete");
            task2Status.classList.add("complete");

            // Call emailComplete to check all tasks
            emailComplete();
        }

    } else if (selectedValue) {
        selectedoption = true;
        correctselectedoption = false;
        feedbackElement.textContent = `Incorrect. You selected: ${selectedValue}. The correct answer is ${currentEmailType}.`;
        feedbackElement.style.color = "red"; // Change feedback text color for incorrect answer
    } else {
        selectedoption = false;
        correctselectedoption = false;
        feedbackElement.textContent = "Please select an option before submitting.";
        feedbackElement.style.color = "orange"; // Change feedback text color for no selection
    }
}

export function clearTickboxSelection() {
    const options = document.getElementsByName("option");
    for (const option of options) {
        option.checked = false; // clearing selection
    }
    // Clear feedback
    const feedbackElement = document.getElementById("feedback");
    feedbackElement.textContent = "";
}

export function displayEmail(index) {
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

export function unhideInstructionBox() {
    const multiplechoiceBox = document.querySelector('.multiplechoice-box');

    if (confirmClose) {
        multiplechoiceBox.classList.add('hidden');
    }
    else {
        multiplechoiceBox.classList.remove('hidden'); // unhide the box by removing hidden
        exampleInstructions()
    }



}

export function showNextEmail() {
    currentEmailIndex++;
    addGeneratedEmail();
}

export function closeInbox() {
    if (emailtaskComplete || confirmClose) {
        confirmClose = false;
        emailopen = false;
        // If inbox is currently displayed, hide it and show desktop
        inboxContainer.style.display = 'none';
        desktopArea.style.display = 'flex';
    }
    else {
        leavetaskModel.style.display = 'flex'; //working
        desktopArea.classList.add('blurred'); // Apply the blur
    }
}

export function setEmailOpen(value) {
    emailopen = value;
}

export function emailPreviouslyComplete() {
    emailtaskComplete = true;
    // Update the icon to show the completed status
    const emailIcon = document.querySelector("#progress-email img");
    if (emailIcon) { //cannot find
        emailIcon.src = "assets/icons/email-tick-icon.png";
    }


    //enable reset since task is complete
    if (resetEmail.style.display === 'none') {
        resetEmail.style.display = 'block';
    }
}



async function markTaskComplete(emailtaskComplete) {
    const email = localStorage.getItem('userEmail'); // Get logged-in user's email
    if (!email) return; // Ensure user is logged in

    const response = await fetch('/update-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, taskName: 'emailtaskComplete', status: true }) // Send task name & status
    });

    if (response.ok) {
        // Update local storage to reflect completed tasks
        const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
        tasks[emailtaskComplete] = true;
        localStorage.setItem('tasks', JSON.stringify(tasks));

        console.log(`${emailtaskComplete} marked as complete.`);
    }
}

async function markTaskIncomplete(emailtaskComplete) {
    const email = localStorage.getItem('userEmail'); // Get logged-in user's email
    if (!email) return; // Ensure user is logged in

    const response = await fetch('/update-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, taskName: 'emailtaskComplete', status: false }) // Send task name & status
    });

    if (response.ok) {
        // Update local storage to reflect completed tasks
        const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
        tasks[emailtaskComplete] = false;
        localStorage.setItem('tasks', JSON.stringify(tasks));

        console.log(`${emailtaskComplete} marked as incomplete.`);
    }
}


