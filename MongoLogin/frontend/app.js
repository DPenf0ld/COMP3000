document.addEventListener('DOMContentLoaded', function () {
    //email code
    const emailIconDesktop = document.getElementById('email-icon');        // Icon for email on desktop
    const emailIconTaskbar = document.getElementById('taskbar-email');     // Icon for email on taskbar
    const emailIconProgress = document.getElementById('progress-email');     // Icon for email on progress tracker

    const inboxContainer = document.getElementById('inbox-container');     // Inbox container
    const emailContainer = document.getElementById('email-interface');     // Inbox container
    //const emailContentContainer = document.querySelector('.email-content');
    const emailListContainer = document.querySelector('.email-list');
    let emailtypereminder = false;
    let emailopen = false;

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
    let correctselectedoption = false;
    let passwordopen = false;

    let emailtaskComplete = false;
    let emailtask1 = false;
    let emailtask2 = false;
    let emailtask3 = false;

    let arrow2 = false;
    let arrow3 = false;
    let arrow4 = false;
    let arrow5 = false;
    let arrow6 = false;

    let deceptivecount = 0;
    let spearcount = 0;
    let safecount = 0;
    let clonecount = 0;
    let phishingcount = 0;



    //password code
    let FirstOpenPassword = true; // Track if password exercise is opened for the first time
    let passwordtaskComplete = false;

    let passwordtask1 = false;
    let passwordtask2 = false;
    let passwordtask3 = false;

    let passwordblur = true;

    const passwordIconDesktop = document.getElementById('password-icon');        // Icon for password on desktop
    const passwordIconTaskbar = document.getElementById('taskbar-password');     // Icon for password on taskbar
    const passwordIconProgress = document.getElementById('progress-password');     // Icon for password on progress tracker

    const instructionPasswordModel = document.getElementById('instructions-password'); // Instruction model
    const confirmpasswordButton = document.getElementById('confirm-password-button');


    const passwordContainer = document.getElementById('password-container');
    const passwordContainerBlur = document.getElementById('password-interface');
    const pwnedpasswordContainerBlur = document.getElementById('Pwned');

    let passwordInput = document.getElementById('password');
    let passwordStrengths = document.querySelectorAll('.password-strength')

    //web code
    const webContainer = document.getElementById('web-container');
    let webopen = false;

    const webIconDesktop = document.getElementById('web-icon');        // Icon for web on desktop
    const webIconTaskbar = document.getElementById('taskbar-web');     // Icon for web on taskbar
    const webIconProgress = document.getElementById('progress-web');     // Icon for web on progress tracker
    const webCompleteButton = document.getElementById('CompleteWeb');
    let webtaskComplete = false;

    let webtask1 = false;
    let webtask2 = false;
    let webtask3 = false;




    //Desktop code
    const desktopArea = document.getElementById('desktop-area');           // Desktop area
    const backToDesktop = document.getElementById('close-inbox');      // Button or link to return to desktop
    const backToDesktopPassword = document.getElementById('close-password');
    const backToDesktopWeb = document.getElementById('close-web');


    //openai code
    const askButton = document.getElementById('ask-button');
    const userInput = document.getElementById('user-input');
    const responseContainer = document.getElementById('response-container');

    askButton.addEventListener('click', async () => {
        const question = userInput.value.trim();
        if (!question) {
            responseContainer.textContent = 'Please enter a question.';
            return;
        }

        // Clear previous response and show loading
        responseContainer.textContent = 'Loading...';

        try {
            const response = await fetch('http://localhost:3000/generate-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userMessage: question }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch the response.');
            }

            const data = await response.json();
            responseContainer.textContent = data.answer; // Display the OpenAI response
        } catch (error) {
            console.error('Error:', error);
            responseContainer.textContent = 'Error generating response. Please try again.';
        }
    });







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
        if (inboxContainer.style.display === 'block' && emailtaskComplete == true) { //closes inbox
            emailopen = false;
            // If inbox is currently displayed, hide it and show desktop
            inboxContainer.style.display = 'none';
            desktopArea.style.display = 'flex';
        } else if ((passwordopen != true && webtaskComplete) || (webopen != true && passwordtaskComplete) || (webtaskComplete && passwordtaskComplete) || (webopen != true && passwordopen != true)) { //opens inbox 
            emailopen = true;

            // If inbox is not displayed, show it and hide desktop
            inboxContainer.style.display = 'block';
            passwordContainer.style.display = 'none'
            webContainer.style.display = 'none'
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
        if (emailtaskComplete) {
            inboxContainer.style.display = 'none';
            desktopArea.style.display = 'flex';
        }
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
                   Secure Pay Solutions Ltd`
        }
    ];

    // ai generated email and add to email array
    async function addGeneratedEmail() {
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

        currentEmailIndex++;
        addGeneratedEmail();

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
        emailListContainer.appendChild(instructionBox);


        // load elments
        const titleElement = document.getElementById('instruction-title');
        const contentElement = document.getElementById('instruction-content');
        const prevButton = document.getElementById('prev-slide');
        const nextButton = document.getElementById('next-slide');

        // Update slide content
        function updateSlide() {
            titleElement.innerHTML = slides[currentSlide].title;
            contentElement.innerHTML = slides[currentSlide].content;
            const emailSenderElement = document.querySelector('.email-sender');

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

            if(correctCount==3){
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
            if (phishingcount == 5) {
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
        }
    }

    //PASSWORD EXERCISE CODE 
    //
    //
    //
    //
    //

    function togglePassword() {
        if (passwordContainer.style.display === 'block' && passwordtaskComplete == true) {
            passwordopen = false;
            passwordContainer.style.display = 'none';
            desktopArea.style.display = 'flex';
        } else if ((emailopen != true && webtaskComplete) || (webopen != true && emailtaskComplete) || (webtaskComplete && emailtaskComplete) || (webopen != true && emailopen != true)) {
            passwordopen = true;
            passwordContainer.style.display = 'block';
            inboxContainer.style.display = 'none';
            webContainer.style.display = 'none'
            desktopArea.style.display = 'none';
        }

        // Show instructions if it's the first time opening
        if (FirstOpenPassword) {
            instructionPasswordModel.style.display = 'flex'; //working
            passwordContainerBlur.classList.add('blurred'); // Apply the blur
            FirstOpenPassword = false;
            togglePasswordInput();
        }
    }


    confirmpasswordButton.addEventListener('click', () => {
        instructionPasswordModel.style.display = 'none';
        passwordContainerBlur.classList.remove('blurred'); // Remove the blur
        pwnedpasswordContainerBlur.classList.add('blurred'); // Apply the to right side
    });





    // Toggle inbox on desktop and taskbar
    passwordIconDesktop.addEventListener('click', togglePassword);
    passwordIconTaskbar.addEventListener('click', togglePassword);
    passwordIconProgress.addEventListener('click', togglePassword);

    // Go back to the desktop
    backToDesktopPassword.addEventListener('click', function () {
        if (passwordtaskComplete) {
            passwordContainer.style.display = 'none';
            desktopArea.style.display = 'flex';
        }
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
                pwnedpasswordContainerBlur.classList.remove('blurred'); // Remove the blur from right side
                passwordblur = false;

                togglePasswordInput();


                // Call passwordComplete to check all tasks
                passwordComplete();
            }
        });

        text.textContent = strengthText;
        text.style.color = gradientColor;
    });


    //IMPLEMENTATION OF PWNED API
    // FUNCTION TO TOGGLE INPUT BASED ON PASSWORDBLUR
    function togglePasswordInput() {
        const passwordInput = document.getElementById('passwordPWNED');
        if (passwordblur) {
            passwordInput.disabled = true; // Disable
        } else {
            passwordInput.disabled = false; // Enable
        }
    }


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
    });


    // Function to mark all password tasks as complete
    function passwordComplete() {
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

    //SAFE WEB BROWSING EXERCISE CODE 
    //
    //
    //
    //
    //

    // Toggle inbox on desktop and taskbar
    webIconDesktop.addEventListener('click', toggleWeb);
    webIconTaskbar.addEventListener('click', toggleWeb);
    webIconProgress.addEventListener('click', toggleWeb);

    // Toggle web code
    function toggleWeb() {
        if (webContainer.style.display === 'block' && webtaskComplete == true) {
            webopen = false;
            // If inbox is currently displayed, hide it and show desktop
            webContainer.style.display = 'none';
            desktopArea.style.display = 'flex';
        } else if ((passwordopen != true && emailtaskComplete) || (emailopen != true && passwordtaskComplete) || (emailtaskComplete && passwordtaskComplete) || (emailopen != true && passwordopen != true)) {
            webopen = true;

            // If inbox is not displayed, show it and hide desktop
            webContainer.style.display = 'block';
            passwordContainer.style.display = 'none'
            inboxContainer.style.display = 'none'
            desktopArea.style.display = 'none';

            // Show instructions if it's the first time opening the inbox
            //   if (isFirstOpen) {
            //      instructionModel.style.display = 'flex'; //working
            //     emailContainer.classList.add('blurred'); // Apply the blur
            //      isFirstOpen = false;
            //  }
        }
    }

    // Go back to the desktop
    backToDesktopWeb.addEventListener('click', function () {
        if (webtaskComplete) {
            webContainer.style.display = 'none';
            desktopArea.style.display = 'flex';
        }
    });


    webCompleteButton.addEventListener('click', webComplete);

    // Function to mark all web tasks as complete
    function webComplete() {

        // Update the task list status for Task 1
        const webtask1Status = document.querySelector("#web-task-1-status");
        webtask1Status.textContent = "Complete";
        webtask1Status.classList.remove("incomplete");
        webtask1Status.classList.add("complete");
        webtask1 = true;

        // Update the task list status for Task 2
        const webtask2Status = document.querySelector("#web-task-2-status");
        webtask2Status.textContent = "Complete";
        webtask2Status.classList.remove("incomplete");
        webtask2Status.classList.add("complete");
        webtask2 = true;

        // Update the task list status for Task 3
        const webtask3Status = document.querySelector("#web-task-3-status");
        webtask3Status.textContent = "Complete";
        webtask3Status.classList.remove("incomplete");
        webtask3Status.classList.add("complete");
        webtask3 = true;

        // Check if all tasks are complete
        if (webtask1 && webtask2 && webtask3 && webtaskComplete != true) {
            webtaskComplete = true;

            // Update the icon to show the completed status
            const webIcon = document.querySelector("#progress-web img");
            if (webIcon) {
                webIcon.src = "assets/icons/web-tick-icon.png";
            }

            // Add a message at the bottom for next steps
            const taskWebElement = document.querySelector(".Taskweb");
            taskWebElement.innerHTML += `
            <div class="next-steps">
                <p>COMPLETE</p>
            </div>
        `;
            webopen = false;
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