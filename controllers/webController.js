console.log('webController.js loaded');

export let webopen = false;
export let webtaskComplete = false;

let webtask1 = false;
let webtask2 = false;
let webtask3 = false;

const desktopArea = document.getElementById('desktop-area');
const webContainer = document.getElementById('web-container');
const userInput = document.getElementById('user-input');
const responseContainer = document.getElementById('response-container');

export async function askButtonFunction() {
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
}

// Function to mark all web tasks as complete
export function webComplete() {
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

export function webCompleteFunction(){
    if (webtaskComplete) {
        webContainer.style.display = 'none';
        desktopArea.style.display = 'flex';
    }
}

export function closeWeb(){
    if (webtaskComplete) {
        webopen = false;
        // If inbox is currently displayed, hide it and show desktop
        webContainer.style.display = 'none';
        desktopArea.style.display = 'flex';
    }
}

export function setWebOpen(value) {
    webopen = value;
}