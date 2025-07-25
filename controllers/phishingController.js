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
let task3complete = false;
let continueTask = true;



//const emailContentContainer = document.querySelector('.email-content');

const profileContainer = document.getElementById('profile-container');
const resetEmail = document.getElementById('reset-email');
const firstName = localStorage.getItem('firstName');
const desktopArea = document.getElementById('desktop-area');
const emailListContainer = document.querySelector('.email-list');
const nextButton = document.getElementById('next-button');
const confirmButton = document.getElementById('confirm-button');
const emailBodyElement = document.querySelector('.email-body');
const emailSubjectElement = document.querySelector('.email-subject-line')
const exampleEndModel = document.getElementById('example-end'); // Instruction model
const instructionModel = document.getElementById('instructions-email'); // Instruction model
const emailContainer = document.getElementById('email-interface');     // Inbox container
const prevButton = document.getElementById('prev-button');
const leavetaskModel = document.getElementById('leave-task');
const phishingEndModel = document.getElementById('phishing-end');

const exampleFeedback = document.getElementById('example-feedback')

const submitButton = document.getElementById('submit-highlight');

const inboxContainer = document.getElementById('inbox-container');
const profileArea = document.getElementById('profile-container');
const taskbar = document.getElementById('taskbar');

//suspicious words to check for highlighting
const suspiciousWords = [
    "urgent", "verify", "update", "login", "failure", "restricted", "confirm", "suspended", "validate",
    "alert", "unauthorised", "review", "security", "credentials", "customer", "earlist", "earliest", "immediately",
    "action", "unauthorized", "disruptions", "mandatory", "failure", "access", "locked",

    // common misspellings
    "verrify", "custumer", "logon", "loging", "failur", "restringted", "suspend",
    "confrm", "valdate", "disput", "alrt", "unautherised", "idnetity", "warnning"
];

// Email content
const emails = [
    {
        type: "Deceptive-Phishing",
        hover: "billing-securepay@securepaysolutions-support.com", //example email
        sender: "SecurePay Solutions",
        subject: "Urgent Account Update Required EXAMPLE",
        body: `Dear Customer,<br><br>
               Your invoice #12345 is now ready.<br><br>
               Please find the attached invoice for your review. Kindly make the payment at your earlist convenience to avoid service disruptions.<br><br>
               Invoice Amount: £2,540.00 <br><br>
               Due Date: [Date] <br><br>                 
               To view your invoice, click the link below:<br><br>
               <span class="email-hover-text" title="securepaysolutions-support.com">SecurePay Solutions</span><br><br>
               Thank you for your prompt attention to this matter.<br><br>
               Sincerely, <br><br> 
               Billing Department <br><br>
               Secure Pay Solutions Ltd`
    },
    {
        type: "Clone-Phishing",
        hover: "support@paypal-security.com", //example email
        sender: "PayPal Security Team",
        subject: "Your Recent Transaction - Action Required",
        body: `Dear Valued Customer,<br><br>
               This is a notification regarding your recent transaction on PayPal.<br><br>
               Transaction ID: 7GH4321JSD<br>
               Amount: £499.99<br><br>
               If you recognise this transaction, no further action is needed. However, if you suspect unauthorised activity, please verify your account immediately.<br><br>
               Click the link below to secure your account:<br><br>
               <span class="email-hover-text" title="paypal-security.com">PayPal Security Center</span><br><br>
               Thank you for choosing PayPal.<br><br>
               Sincerely, <br><br> 
               PayPal Security Team`
    },
    {
        type: "Spear-Phishing",
        hover: "it-admin@yourcompany-support.com", //example email
        sender: "IT Admin - YourCompany",
        subject: "Mandatory Security Update for Employees",
        body: `Dear ${firstName},<br><br>
               As part of our ongoing cybersecurity enhancements, all employees are required to update their login credentials.<br><br>
               Failure to complete this update by [Deadline Date] may result in temporary access restrictions.<br><br>
               Please follow the secure link below to verify and update your credentials:<br><br>
               <span class="email-hover-text" title="yourcompany-support.com">Employee Security Portal</span><br><br>
               Thank you for your cooperation.<br><br>
               Sincerely, <br><br> 
               IT Department`
    },
    {
        type: "Safe-Email",
        hover: "customer-support@amazon.com", //example email
        sender: "Amazon Customer Support",
        subject: "Your Recent Order Confirmation",
        body: `Dear ${firstName},<br><br>
               Thank you for your recent purchase on Amazon! Your order has been successfully processed.<br><br>
               Order Number: 987654321<br>
               Estimated Delivery: [Delivery Date]<br><br>
               You can track your order and manage your preferences at any time by visiting your account:<br><br>
               <span class="email-hover-text" title="amazon.com">Your Orders</span><br><br>
               If you have any questions, feel free to contact our support team.<br><br>
               Best regards, <br><br> 
               Amazon Customer Support`
    }
];

//todays date
const today = new Date();
//deadline
const deadlineDate = new Date(today);
deadlineDate.setDate(today.getDate() + 3);
//delivery
const deliveryDate = new Date(today);
deliveryDate.setDate(today.getDate() + 5);

//replace parts in the email with the real date
const formatDate = (date) =>
    date.toLocaleDateString("en-UK", { year: 'numeric', month: 'long', day: 'numeric' }); //read in this format: 8 April 2025

emails.forEach(email => {
    email.body = email.body
        .replace("[Date]", formatDate(today))
        .replace("[Deadline Date]", formatDate(deadlineDate))
        .replace("[Delivery Date]", formatDate(deliveryDate));
});

// Pages content
const feedback = [
    {
        title: `<strong>This is a deceptive phishing email.</strong> The main indicators are:`,
        content: `
<ul>
    <li>Fake email, not from a legitimate company.</li>
    <li>Generic "Dear Customer" greeting instead of a personalised one.</li>
    <li>Poor grammar ("earlist convenience") and awkward phrasing.</li>
    <li>Suspicious email address - overly long or misleading domain.</li>
</ul>
        `
    },
    {
        title: `<strong>This is a clone phishing email.</strong> The key indicators include:`,
        content: `
<ul>
    <li>Mimics a real PayPal email but with a fake link.</li>
    <li>Urgent language pressuring immediate action.</li>
    <li>Suspicious sender address, e.g., paypal-security.com instead of paypal.com.</li>
    <li>No personalisation, unlike real PayPal emails.</li>
</ul>
        `
    },
    {
        title: `<strong>This is a spear phishing email.</strong> The warning signs include:`,
        content: `
<ul>
    <li>Appears from an internal source, like "IT Admin - YourCompany".</li>
    <li>Targets employees by name to seem authentic.</li>
    <li>Threatens account restrictions to create urgency.</li>
    <li>Fake company security link, with a similar but incorrect domain.</li>
</ul>
        `
    },
    {
        title: `<strong>This is a safe email from Amazon.</strong> The reasons include:`,
        content: `
<ul>
    <li>Personalised greeting, not a generic one.</li>
    <li>Confirms an order with no urgent pressure.</li>
    <li>Trusted sender email, links go to amazon.com.</li>
    <li>Clear, professional language with no errors.</li>
</ul>
        `
    }
];




// Pages content
const pages = [
    {
        title: ` 1️⃣ Welcome to Your Inbox, ${firstName}!`, //add firstName here
        content: `
            <strong>💡 Goal: </strong>Learn how to spot phishing emails. These are fake messages designed to steal your personal data.
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
        title: "5️⃣ How to Verify Emails",
        content: `
            <strong>✅ Verify via an official contact method:</strong><br>
            Call or email the company using <strong>official contact details</strong> from their website.<br><br>

            <strong>✅ Log in to the official website:</strong><br>
            If an email claims there’s an issue, visit the official site directly (don’t click the email link!).<br><br>

            <strong>✅ Report suspicious emails:</strong><br>
            Forward phishing emails to <strong>your IT department</strong> or the <strong>official company it claims to be from.</strong><br><br>

            <strong>🚨 Never trust emails blindly—verify first! 🚨</strong>
        `
    },
    {
        title: "6️⃣ Your Task",
        content: `
            📌 Highlight suspicious words or phrases.<br>
            📌 Classify the email as Deceptive Phishing, Clone Phishing, Spear Phishing, or Safe.<br>
            📌 Test yourself in a final quiz.<br><br>
            <strong>👉 Let’s begin!</strong>
        `
    }
];

export function removeOpenAIFunction() {
    exampleEndModel.style.display = 'none'; //working
    emailContainer.classList.remove('blurred'); // Apply the blur
}




export function PhishingHideEnd() {
    //enable all buttons 
    inboxContainer.classList.remove("disabled");
    profileArea.classList.remove("disabled");
    taskbar.classList.remove("disabled");
    //remove end card + blur
    phishingEndModel.style.display = 'none';
    inboxContainer.classList.remove('blurred'); // remove the blur

    //re-enable buttons
    document.getElementById("reminder").disabled = false;
    document.getElementById('submit-highlight').disabled = false;
}


export function initialiseEmail() {
    continueTask = true;
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
        task3complete = false;

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
    // Feedback container
    const feedbackElement = document.getElementById("feedback");

    // Get all highlighted elements from both body and subject
    const highlightedBodyElements = emailBodyElement.querySelectorAll('.highlighted');
    const highlightedSubjectElements = emailSubjectElement.querySelectorAll('.highlighted');

    // Combine the highlighted elements from body and subject
    const allHighlightedElements = [...highlightedBodyElements, ...highlightedSubjectElements];

    const currentEmailType = emails[currentEmailIndex].type; // Fetch type from the emails array
    //check to see if words have been highlighted
    if (allHighlightedElements.length > 0 || currentEmailType === 'Safe-Email') {
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
            if (currentEmailIndex < 4) {
                //display feedback
                exampleFeedback.style.display = 'block';
            }


            nextemailbutton()
        }

        if (correctCount >= 10) {
            if (!task3complete) {
                task3complete = true;
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
    } else {
        feedbackElement.textContent = "Please highlight suspicious words before submitting.";
        feedbackElement.style.color = "orange"; // Change feedback text color for no selection
    }
}


export function backphishingFunction() {

    //enable all buttons 
    inboxContainer.classList.remove("disabled");
    desktopArea.classList.remove("disabled");
    profileArea.classList.remove("disabled");
    taskbar.classList.remove("disabled");

    leavetaskModel.style.display = 'none';
    inboxContainer.classList.remove('blurred'); // remove the blur

    document.getElementById("reminder").disabled = false;
    document.getElementById("prev-slide").disabled = false;
    document.getElementById("next-slide").disabled = false;
    document.getElementById('submit-highlight').disabled = false;
}



export function confirmphishingFunction() {
    //enable all buttons 
    inboxContainer.classList.remove("disabled");
    desktopArea.classList.remove("disabled");
    profileArea.classList.remove("disabled");
    taskbar.classList.remove("disabled");

    //hide quiz arrow
    const quizArrow = document.getElementById("quiz-arrow")
    quizArrow.style.display = 'none'

    document.getElementById("reminder").disabled = false;
    if (instructionboxCreated) {
        document.getElementById("prev-slide").disabled = false; //error since element gets deleted
        document.getElementById("next-slide").disabled = false; //error since element gets deleted
    }

    document.getElementById('next-button').disabled = false;
    document.getElementById('confirm-button').disabled = false;
    document.getElementById('prev-button').disabled = false;
    document.getElementById('submit-highlight').disabled = false;

    inboxContainer.classList.remove('blurred'); // remove the blur
    confirmClose = true;
    emailopen = false;
    emailtaskComplete = false;
    instructionboxCreated = true;

    const emailIcon = document.querySelector("#progress-email img");

    //update home page and taskbar
    const emailIconHome = document.querySelector("#email-icon img");
    const emailIconTaskbar = document.querySelector("#taskbar-email img");

    if (emailIcon) {
        emailIcon.src = "assets/icons/email-icon.png";
        emailIconHome.src = "assets/icons/email-icon.png";
        emailIconTaskbar.src = "assets/icons/email-icon.png";
    }

    //show arrow
    const emailArrow = document.getElementById("email-arrow")
    emailArrow.style.display = 'block'

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
    //enable all buttons 
    inboxContainer.classList.remove("disabled");
    profileArea.classList.remove("disabled");
    taskbar.classList.remove("disabled");


    document.getElementById("reminder").disabled = false;
    instructionModel.style.display = 'none';
    instructionsConfirmed = true; // listener to display instructions once user confirms
    emailContainer.classList.remove('blurred'); // Remove the blur
    displayEmail(currentEmailIndex);
}

export function firstOpenFunction() {
    //disable all buttons 
    inboxContainer.classList.add("disabled");
    profileArea.classList.add("disabled");
    taskbar.classList.add("disabled");

    instructionModel.style.display = 'flex'; //working
    emailContainer.classList.add('blurred'); // Apply the blur
}

export function emailComplete() {
    if (continueTask) {
        // Check if all tasks are complete
        if (emailtask1 && emailtask2 && emailtask3 || emailtaskComplete) {
            //disable all buttons 
            inboxContainer.classList.add("disabled");
            profileArea.classList.add("disabled");
            taskbar.classList.add("disabled");
            //show end card
            phishingEndModel.style.display = 'flex'; //working
            inboxContainer.classList.add('blurred'); // Apply the blur
            //disable buttons while endcard is active
            //phishing specific buttons
            document.getElementById("reminder").disabled = true;
            document.getElementById('submit-highlight').disabled = true;

            emailtaskComplete = true;
            markTaskComplete()
            // Update the icon to show the completed status
            const emailIcon = document.querySelector("#progress-email img");

            //update home page and taskbar
            const emailIconHome = document.querySelector("#email-icon img");
            const emailIconTaskbar = document.querySelector("#taskbar-email img");

            if (emailIcon) {
                emailIcon.src = "assets/icons/email-tick-icon.png";
                emailIconHome.src = "assets/icons/email-tick-icon.png";
                emailIconTaskbar.src = "assets/icons/email-tick-icon.png";
            }

            //remove arrow
            const emailArrow = document.getElementById("email-arrow")
            emailArrow.style.display = 'none'

            //enable reset since task is complete
            if (resetEmail.style.display === 'none') {
                resetEmail.style.display = 'block';
            }

            // Add a message at the bottom for next steps
            const taskElement = document.querySelector(".Taskemail");
            taskElement.innerHTML += `
    <div class="next-steps">
        <p>You can practice with more generated emails or minimise this tab and move on to the next task.</p>
    </div>
`;
            emailopen = false;
            continueTask = false;
        } else {
            console.log("Not all tasks are complete yet.");
            const taskEmailElement = document.querySelector(".Taskemail");
            const nextStepsDiv = taskEmailElement.querySelector(".next-steps");
            if (nextStepsDiv) {
                nextStepsDiv.remove();
            }
        }
    }
}

// Function to update feedback dynamically
function updateFeedback() {
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackContent = document.getElementById('feedback-content');

    // Update the title and content based on the current email index
    feedbackTitle.innerHTML = feedback[currentEmailIndex].title;
    feedbackContent.innerHTML = feedback[currentEmailIndex].content;
}



export function nextemailbutton() {
    //display feedback if example
    if (currentEmailIndex < 4) {
        updateFeedback()
    }


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
    //disable all buttons 
    inboxContainer.classList.add("disabled");
    profileArea.classList.add("disabled");
    taskbar.classList.add("disabled");

    //reenable button if cancelled 

    leavetaskModel.style.display = 'flex'; //working
    desktopArea.classList.add('blurred'); // Apply the blur
}

function removeInstructions() {
    const instructionBox = document.querySelector('.instruction-box');
    if (instructionBox) {
        instructionBox.remove();
        instructionboxCreated = false;
    }
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

        instructionboxCreated = true;
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
    if (currentEmailIndex >= 5) { //SET TO 0 FOR TESTING MATCH TO PRELOAD AMOUNT + 3
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
    //SET TO 0 FOR TESTING
    //CHANGE HERE TO PRELOAD THE EMAIS
    for (let i = 0; i < 2; i++) {
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
        if (phishingcount == 5) { //CHNAGE BACK TO 5
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
        feedbackElement.style.color = "orange"; // Change feedback text colour for no selection
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
    //disable feedback
    exampleFeedback.style.display = 'none';

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
        removeInstructions()
    }
    else {
        multiplechoiceBox.classList.remove('hidden'); // unhide the box by removing hidden
        removeInstructions()
    }
}

export function showNextEmail() {
    currentEmailIndex++;
    if (currentEmailIndex > 3) {
        if (currentEmailIndex == 4) {
            exampleEndModel.style.display = 'flex'; //working
            emailContainer.classList.add('blurred'); // Apply the blur
        }
        addGeneratedEmail();
    } else {
        displayEmail(currentEmailIndex);
    }
}

export function closeInbox() {
    if (emailtaskComplete || confirmClose) {
        //enable all buttons 
        inboxContainer.classList.remove("disabled");
        profileArea.classList.remove("disabled");
        taskbar.classList.remove("disabled");

        //remove end card + blur
        phishingEndModel.style.display = 'none';
        inboxContainer.classList.remove('blurred'); // remove the blur

        confirmClose = false;
        emailopen = false;
        // If inbox is currently displayed, hide it and show desktop
        inboxContainer.style.display = 'none';
        desktopArea.style.display = 'flex';
    }
    else {
        leavetaskModel.style.display = 'flex'; //working
        inboxContainer.classList.add('blurred'); // Apply the blur


        //disable all buttons 
        inboxContainer.classList.add("disabled");
        profileArea.classList.add("disabled");
        taskbar.classList.add("disabled");


        document.getElementById("reminder").disabled = true;
        if (instructionboxCreated) {
            document.getElementById("prev-slide").disabled = true; //error since element gets deleted
            document.getElementById("next-slide").disabled = true; //error since element gets deleted
        }
        document.getElementById('submit-highlight').disabled = true;
    }
}

export function setEmailOpen(value) {
    emailopen = value;
}

export function emailPreviouslyComplete() {
    const emailArrow = document.getElementById("email-arrow")
    emailArrow.style.display = 'none'

    emailtaskComplete = true;
    // Update the icon to show the completed status
    const emailIcon = document.querySelector("#progress-email img");

    //update home page and taskbar
    const emailIconHome = document.querySelector("#email-icon img");
    const emailIconTaskbar = document.querySelector("#taskbar-email img");

    if (emailIcon) {
        emailIcon.src = "assets/icons/email-tick-icon.png";
        emailIconHome.src = "assets/icons/email-tick-icon.png";
        emailIconTaskbar.src = "assets/icons/email-tick-icon.png";
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


