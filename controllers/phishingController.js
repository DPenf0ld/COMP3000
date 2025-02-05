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
        title: `Welcome to the Email Inbox, ${firstName}!`, //add firstName here
        content: `
            This exercise will teach you how to identify <strong>phishing emails</strong>—fraudulent messages designed to steal sensitive information.<br><br>
            Phishing emails often contain suspicious links or attachments meant to trick you. Let's improve your detection skills!
        `
    },
    {
        title: "What are Phishing Emails?",
        content: `
            Phishing emails pretend to be from trusted sources but are designed to deceive you.<br><br>
            They often use:<br>
            • <strong>Fake sender addresses</strong><br>
            • <strong>Urgent or alarming language</strong><br>
            • <strong>Malicious links or attachments</strong><br><br>
            Their goal? To steal sensitive information like passwords or credit card details.
        `
    },
    {
        title: "Common Types of Phishing",
        content: `
            Let’s explore three common types of phishing emails:<br><br>
            1. <strong>Deceptive Phishing:</strong> Impersonates trusted entities (e.g., banks) to steal sensitive data.<br>
            2. <strong>Clone Phishing:</strong> Copies legitimate emails but replaces links or attachments with malicious ones.<br>
            3. <strong>Spear Phishing:</strong> Highly targeted attacks using personal details to appear convincing.<br><br>
            Each type is designed to trick you—stay alert!
        `
    },
    {
        title: "How to Spot Phishing Emails",
        content: `
            Look out for these <strong>red flags</strong>:<br><br>
            • <strong>Typos or bad grammar</strong><br>
            • <strong>Strange email addresses</strong><br>
            • <strong>Unexpected attachments</strong><br>
            • <strong>Urgent or threatening language</strong><br>
            • <strong>Suspicious links</strong> (hover to check the real destination)<br>
            • <strong>Generic greetings</strong> (e.g., "Dear Customer")<br>
            • <strong>Too-good-to-be-true offers</strong><br><br>
            <strong>Pro Tip:</strong> If you're unsure, verify the sender or contact the organisation directly. Never share sensitive info via email!
        `
    },
    {
        title: "Your Task",
        content: `
            This is a safe space to practice detecting phishing emails.<br><br>
            Here's what you'll do:<br>
            • <strong>Highlight suspicious elements</strong> like poor spelling, urgency, or fake links.<br>
            • <strong>Classify the email</strong> by type (e.g., phishing or legitimate).<br>
            • <strong>Test your knowledge</strong> with a quiz at the end.<br><br>
            Remember: Not all emails are phishing, but they are based on real-world examples. Let's get started!
        `
    },
    {
        title: "Remember",
        content: `
            The key point of this task is to understand not to click on links or attachments from unknown emails.<br><br>
            • <strong>DO NOT CLICK ON ATTACHMENTS</strong><br>
            • <strong>DO NOT CLICK ON LINKS</strong><br><br>
        `
    }
];


export function initialiseEmail() {
    instructionboxCreated = false;
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

        if (correctselectedoption) {
            displaynextemailbutton = true;
            nextemailbutton()
        }

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




    //exampleInstructions()
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
        nextEmailButton.style.display = 'block';
        nextEmailButton.addEventListener('click', showNextEmail);
    } else {
        nextEmailButton.style.display = 'none';
        nextEmailButton.removeEventListener('click', showNextEmail);
    }
}

export function resetEmailFromDesktop(){
    leavetaskModel.style.display = 'flex'; //working
    desktopArea.classList.add('blurred'); // Apply the blur
}





export function exampleInstructions() {
    let currentSlide = 0; // Track the current slide
        const slides = [
            {
                title: "Introduction",
                content: `
            <p>First, we’ll review an example phishing email. These instructions will equip you with methods to <strong>identify phishing emails</strong> and understand their types.</p>
        `
            },
            {
                title: "Identifying Suspicious Words",
                content: `
            <p><strong>Suspicious words</strong> indicate a phishing email. To highlight them:</p>
            <ul>
                <li>Double-click a word.</li>
                <li>Or click at the start of a word and drag your cursor over it.</li>
            </ul>
            <p>Take a moment to read the example email and <strong>highlight any words</strong> you think could be suspicious.</p>
        `
            },
            {
                title: "Step 1: Informal Greeting",
                content: `
            <p>An informal or generic greeting is a key indicator of a phishing email. For example, this email uses the term <strong>“Customer”</strong>, which is not specific.</p>
            <p><strong>Task:</strong> Highlight the word <strong>“Customer”</strong> to complete this step.</p>
        `
            },
            {
                title: "Step 2: Time Urgency",
                content: `
            <p>Phishing emails often create pressure with <strong>time urgency</strong>. Phrases like <strong>“Immediate action required”</strong> or <strong>“Act now”</strong> are common.</p>
            <p><strong>Task:</strong> In the example email, highlight the word <strong>“urgent”</strong> to complete this step.</p>
        `
            },
            {
                title: "Step 3: Poor Grammar",
                content: `
            <p>One common sign of a phishing email is <strong>poor grammar</strong>, such as misspellings, incorrect punctuation, or awkward phrasing.</p>
            <p>In this example, the word <strong>“earlist”</strong> (instead of <strong>“earliest”</strong>) is a clear indication of phishing.</p>
            <p><strong>Task:</strong> Highlight the word <strong>“earlist”</strong> to complete this step.</p>
        `
            },
            {
                title: "Step 4: Unnecessary Subdomains",
                content: `
            <p>Legitimate companies typically use simple, professional domains, like <strong>securepay.com</strong> or <strong>securepaysolutions.com</strong>. In phishing emails, links often contain unnecessary or suspicious subdomains.</p>
            <p><strong>Task:</strong> Hover over the payment link in the example to reveal the real address. DO NOT CLICK THE LINK!</p>
        `
            },
            {
                title: "Step 5: Hyphen Usage",
                content: `
            <p>A real company uses straightforward email addresses, such as <strong>Billing@securepay.com</strong>. Phishing emails, however, often use long and suspicious addresses.</p>
            <p><strong>Task:</strong> Hover over the profile picture in the example email to see the true email address.</p>
        `
            }
        ];
    if (instructionboxCreated == false) {
        

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
        instructionboxCreated = true;

        // Append instruction box
        emailListContainer.appendChild(instructionBox);
    }
    else {
      //  instructionBox = document.querySelector('.instruction-box'); // Select existing instruction box
     //   if (instructionBox) {
      //      instructionBox.classList.remove('instruction-box'); // Remove class if needed
       // } else {
       //     console.error("Instruction box not found");
       // }

    }

    const contentElement = document.getElementById('instruction-content'); //cannot find
    const titleElement = document.getElementById('instruction-title');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');

    // Update example slides c
    function updateSlide() {
        titleElement.innerHTML = slides[currentSlide].title;
        contentElement.innerHTML = slides[currentSlide].content;
        const emailSenderElement = document.querySelector('.email-sender');
        const emailBodyElement = document.querySelector('.email-body');
        const emailSubjectElement = document.querySelector('.email-subject-line')

        console.log(titleElement)
        // Toggle button visibility
        prevButton.classList.toggle('hidden', currentSlide === 0); //no previous on slide 1
        nextButton.textContent = currentSlide === slides.length - 1 ? "Finish" : "Next"; //replace next with finish on last slide
        if (currentSlide === 2 && arrow2 == false) {
            arrow2 = true
            highlightText(emailBodyElement, "Customer");
            console.log("Highlight Customer");
        } else if (currentSlide === 3 && arrow3 == false) {
            arrow3 = true
            highlightText(emailSubjectElement, "urgent");
            console.log("Highlight Urgent");
        } else if (currentSlide === 4 && arrow4 == false) {
            arrow4 = true
            highlightText(emailBodyElement, "earlist");
            console.log("Highlight Earlist");
        } else if (currentSlide === 5 && arrow5 == false) {
            arrow5 = true
            highlightText(emailBodyElement, "SecurePay Solutions");
            console.log("Highlight securepay.com");
        } else if (currentSlide === 6 && arrow6 == false) {
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
            unhideInstructionBox()
        }
    });

    // open first slide when function is called
    updateSlide();

}

// ai generated email and add to email array
export async function addGeneratedEmail() {
    try {
        const response = await fetch('http://localhost:3000/generate-phishing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to fetch generated email');

        const generatedEmail = await response.json();

        // Add the generated email to the array
        emails.push(generatedEmail);

        console.log('Updated Emails Array:', emails);
    } catch (error) {
        console.error('Error adding generated email:', error);
    }
    displayEmail(currentEmailIndex);
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

  //  if (instructionboxCreated) {
   //     multiplechoiceBox.classList.add('hidden')
   // } else {
        multiplechoiceBox.classList.remove('hidden'); // unhide the box by removing hidden
 //   }

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

export function emailPreviouslyComplete(){
    emailtaskComplete = true;
        // Update the icon to show the completed status
        const emailIcon = document.querySelector("#progress-email img");
        if (emailIcon) { //cannot find
            emailIcon.src = "assets/icons/email-tick-icon.png";
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
  
  
