console.log('webController.js loaded');

export let webopen = false;
export let webtaskComplete = false;

let webtask1 = false;
let webtask2 = false;
let webtask3 = false;
let confirmClose = false;
let instructionsConfirmed = false; //used to display example email instructions


const profileContainer = document.getElementById('profile-container');
const resetWeb = document.getElementById('reset-web');
const desktopArea = document.getElementById('desktop-area');
const webContainer = document.getElementById('web-container');
const webInterface = document.getElementById('web-interface');
const userInput = document.getElementById('user-input');
const responseContainer = document.getElementById('response-container');
const leavetaskModel = document.getElementById('leave-web-task');
const instructionModel = document.getElementById('instructions-web');

// empty array for searches 
let searches = [];

export function resetWebFromDesktop() {
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

    if (webtaskComplete == false) {
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

    //disable reset 
    if (resetWeb.style.display === 'block') {
        resetWeb.style.display = 'none';
    }


    //disable reset 
    if (profileContainer.style.display === 'block') {
        profileContainer.style.display = 'none' //hides profile
    }

    markTaskIncomplete()
    resetWebTask()
    closeWeb()
}


export async function askButtonFunction() {
    const question = userInput.value.trim(); //stores question
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
        searches.push(...data.answer);  //triple dot allows each element to individually be added to the array
        // Display the results
        displaySearchResults();
        searches = [];  //reset after displaying

    } catch (error) {
        console.error('Error:', error);
        responseContainer.textContent = 'Error generating response. Please try again.';
    }
}


function displaySearchResults() {
    // Clear previous search
    responseContainer.innerHTML = '';

    for (let i = 0; i < searches.length; i++) {
        const search = searches[i];
        const searchItem = document.createElement('div');
        searchItem.classList.add('search-result');
        searchItem.setAttribute('data-isSafe', search.isSafe); //use to check if the user is correct or not

        // Create title
        const title = document.createElement('h2');
        title.textContent = search.title;
        title.classList.add('search-title');

        //create url
        const url = document.createElement('h3');
        url.textContent = search.url;
        url.classList.add('search-url');

        // Create description
        const description = document.createElement('p');
        description.textContent = search.description;
        description.classList.add('search-description');

        // Create Feedback
        const feedback = document.createElement('p');
        feedback.textContent = search.feedback;
        feedback.classList.add('search-feedback');
        feedback.style.display = 'none'; // hide feedback

        // Add click event listener to reveal feedback
        searchItem.addEventListener('click', function () {
            const isSafe = searchItem.getAttribute('data-isSafe') === 'true'; // Get 'isSafe' value

            // Change background color based on safety
            if (isSafe) {
                searchItem.style.backgroundColor = '#66CDAA';  // Green if safe
            } else {
                searchItem.style.backgroundColor = '#FF6F6F';    // Red if unsafe
            }

            // Show feedback after clicking
            feedback.style.display = 'block';  // Show feedback

            searchItem.style.pointerEvents = 'none';  // Disable pointer once clicked
        });



        searchItem.appendChild(title);
        searchItem.appendChild(url);
        searchItem.appendChild(description);
        searchItem.appendChild(feedback);

        responseContainer.appendChild(searchItem);
    }
}


export function webPreviouslyComplete() {
    webtaskComplete = true;
    // Update the icon to show the completed status
    const webIcon = document.querySelector("#progress-web img");
    if (webIcon) { //cannot find
        webIcon.src = "assets/icons/web-tick-icon.png";
    }

    //enable reset since task is complete
    if (resetWeb.style.display === 'none') {
        resetWeb.style.display = 'block';
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
    if (webtask1 && webtask2 && webtask3 || webtaskComplete) {
        markTaskComplete()
        webtaskComplete = true;

        // Update the icon to show the completed status
        const webIcon = document.querySelector("#progress-web img");
        if (webIcon) {
            webIcon.src = "assets/icons/web-tick-icon.png";
        }

        //enable reset since task is complete
        if (resetWeb.style.display === 'none') {
            resetWeb.style.display = 'block';
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

async function markTaskComplete(webtaskComplete) {
    const email = localStorage.getItem('userEmail'); // Get logged-in user's email
    if (!email) return; // Ensure user is logged in

    const response = await fetch('/update-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, taskName: 'webtaskComplete', status: true }) // Send task name & status
    });

    if (response.ok) {
        // Update local storage to reflect completed tasks
        const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
        tasks[webtaskComplete] = true;
        localStorage.setItem('tasks', JSON.stringify(tasks));

        console.log(`${webtaskComplete} marked as complete.`);
    }
}

async function markTaskIncomplete(webtaskComplete) {
    const email = localStorage.getItem('userEmail'); // Get logged-in user's email
    if (!email) return; // Ensure user is logged in

    const response = await fetch('/update-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, taskName: 'webtaskComplete', status: false }) // Send task name & status
    });

    if (response.ok) {
        // Update local storage to reflect completed tasks
        const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
        tasks[webtaskComplete] = false;
        localStorage.setItem('tasks', JSON.stringify(tasks));

        console.log(`${webtaskComplete} marked as incomplete.`);
    }
}