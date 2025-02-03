console.log('webController.js loaded');

export let webopen = false;
export let webtaskComplete = false;

let webtask1 = false;
let webtask2 = false;
let webtask3 = false;
let confirmClose = false;
let instructionsConfirmed = false; //used to display example email instructions



const desktopArea = document.getElementById('desktop-area');
const webContainer = document.getElementById('web-container');
const webInterface = document.getElementById('web-interface');
const userInput = document.getElementById('user-input');
const responseContainer = document.getElementById('response-container');
const leavetaskModel = document.getElementById('leave-web-task');
const instructionModel = document.getElementById('instructions-web');

export function resetWebFromDesktop(){
    leavetaskModel.style.display = 'flex'; //working
    desktopArea.classList.add('blurred'); // Apply the blur
}

export function confirmwebButtonFunction() {
    instructionModel.style.display = 'none';
    instructionsConfirmed = true; // listener to display instructions once user confirms
    webInterface.classList.remove('blurred'); // Remove the blur
}
export function webfirstOpenFunction() {
    instructionModel.style.display = 'flex'; //working
    webInterface.classList.add('blurred'); // Apply the blur
}

const initialState = {
    confirmClose: false,
    instructionsConfirmed: false,
};

export function initialiseWeb() {
    document.getElementById("user-input").value = ""; //reset input
    document.getElementById("response-container").value = ""; //reset web search results
    responseContainer.textContent = '';

    if (webtaskComplete ==false){
        instructionModel.style.display = 'flex'; //working
        webInterface.classList.add('blurred'); // Apply the blur

        webtask1 = false;
        document.querySelector("#web-task-1-status").textContent = "incomplete";
        document.querySelector("#web-task-1-status").classList.remove("complete");
        document.querySelector("#web-task-1-status").classList.add("incomplete");
    
        webtask2 = false;
        document.querySelector("#web-task-2-status").textContent = "Incomplete";
        document.querySelector("#web-task-2-status").classList.remove("complete");
        document.querySelector("#web-task-2-status").classList.add("incomplete");
    
        webtask3 = false;
        document.querySelector("#web-task-3-status").textContent = "incomplete";
        document.querySelector("#web-task-3-status").classList.remove("complete");
        document.querySelector("#web-task-3-status").classList.add("incomplete");
    
        webComplete()
    }

}

function resetWebTask() {
    leavetaskModel.style.display = 'none';
    desktopArea.classList.remove('blurred');
}

export function backwebFunction() {
    leavetaskModel.style.display = 'none';
    desktopArea.classList.remove('blurred'); // remove the blur
}

export function confirmwebFunction() {
    desktopArea.classList.remove('blurred'); // remove the blur
    confirmClose = true;
    webopen = false;
    webtaskComplete = false;
    const webIcon = document.querySelector("#progress-web img");
    if (webIcon) {
        webIcon.src = "assets/icons/web-icon.png";
    }


    resetWebTask()
    closeWeb()
}

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
    if (webtask1) {
        const webtask1Status = document.querySelector("#web-task-1-status");
        webtask1Status.textContent = "Complete";
        webtask1Status.classList.remove("incomplete");
        webtask1Status.classList.add("complete");
    }


    if (webtask2) {
    // Update the task list status for Task 2
    const webtask2Status = document.querySelector("#web-task-2-status");
    webtask2Status.textContent = "Complete";
    webtask2Status.classList.remove("incomplete");
    webtask2Status.classList.add("complete");
    }
    if (webtask3) {
    // Update the task list status for Task 3
    const webtask3Status = document.querySelector("#web-task-3-status");
    webtask3Status.textContent = "Complete";
    webtask3Status.classList.remove("incomplete");
    webtask3Status.classList.add("complete");
    }

    // Check if all tasks are complete
    if (webtask1 && webtask2 && webtask3) {
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
    } else {
        const taskWebElement = document.querySelector(".Taskweb");
        const nextStepsDiv = taskWebElement.querySelector(".next-steps");
        if (nextStepsDiv) {
            nextStepsDiv.remove(); 
        }
        console.log("Not all tasks are complete yet.");
    }
}

export function webCompleteFunction() {
    webtask1 = true;
    webtask2 = true;
    webtask3 = true;
    webComplete()
}

export function closeWeb() {
    if (webtaskComplete || confirmClose) {
        confirmClose = false;
        webopen = false;
        // If inbox is currently displayed, hide it and show desktop
        webContainer.style.display = 'none';
        desktopArea.style.display = 'flex';
    }
    else {
        leavetaskModel.style.display = 'flex'; //working
        desktopArea.classList.add('blurred'); // Apply the blur
    }
}

export function setWebOpen(value) {
    webopen = value;
}