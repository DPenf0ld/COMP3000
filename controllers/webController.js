console.log('webController.js loaded');

export let webopen = false;
export let webtaskComplete = false;

let webtask1 = false;
let webtask2 = false;
let webtask3 = false;
let confirmClose = false;
let instructionsConfirmed = false; //used to display example email instructions
let timer;
let timeLeft = 20;
let correct = 0;
let incorrect = 0;
let score = 0;

let continueTask = true;

const profileContainer = document.getElementById('profile-container');
const resetWeb = document.getElementById('reset-web');
const desktopArea = document.getElementById('desktop-area');
const webContainer = document.getElementById('web-container');
const webInterface = document.getElementById('web-interface');
const userInput = document.getElementById('user-input');
const responseContainer = document.getElementById('response-container');
const gameContainer = document.getElementById('game-container')
const leavetaskModel = document.getElementById('leave-web-task');
const instructionModel = document.getElementById('instructions-web');
const gameInstructionsModel = document.getElementById('game-instructions');
const searchArrow = document.getElementById('search-arrow');
const gameArrow = document.getElementById('game-arrow');
const feedbackInfo = document.getElementById('feedback-info');
const webEndModel = document.getElementById('web-end');

const playButton = document.getElementById('game-button');
const timerDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');

// empty array for searches 
let searches = [];
let currentPage = 0;
const prevWebButton = document.getElementById('prev-web-button');
const nextWebButton = document.getElementById('next-web-button');
const confirmWebButton = document.getElementById('confirm-web-button');


// Pages content
const pages = [
    {
        title: "🌐 Welcome to the Safe Web Browsing Challenge!",
        content: `
            🔍 This exercise will help you improve your ability to identify <strong>unsafe links</strong> in online search results.<br><br>
            🚨 Cybercriminals create deceptive websites to steal data or infect devices. Your task is to analyse search results and identify which links are unsafe.<br><br>
            🔓 <strong>Click Next to learn more before starting the challenge!</strong>
        `
    },
    {
        title: "🔍 How Attackers Trick You",
        content: `
            🎭 <strong>Fake websites</strong> may mimic trusted brands but contain subtle differences in their URLs.<br>
            📧 <strong>Phishing links</strong> may be disguised as urgent messages or offers.<br>
            🔗 <strong>Shortened URLs</strong> can hide the real destination—always look over links to check before clicking.<br><br>
            <strong>💡 Tip:</strong> Legitimate websites often use HTTPS, but that alone does not guarantee safety!
        `
    },
    {
        title: "⚠️ Red Flags to Watch For",
        content: `
            🚫 <strong>Misspellings or extra characters</strong> in URLs (e.g., “amaz0n.com” instead of “amazon.com”).<br>
            🔗 <strong>Unusual domain endings</strong> (e.g., “.xyz” instead of “.com” or “.org”).<br>
            🚨 <strong>Too-good-to-be-true offers</strong> (e.g., “You won a free iPhone! Click now!”).<br>
            🏴‍☠️ <strong>Fake login pages</strong> asking for credentials—always check the URL before entering details.<br>
            🎭<strong>Do not click Pop Ups</strong> they are known for redirecting you to malicious websites or install malware.<br><br>
            <strong>💡 Stay cautious and verify links before clicking!</strong>
        `
    },
    {
        title: "✅ Safe Browsing Best Practices",
        content: `
            🔍 Always <strong>look at the link or hover over title if link is not present</strong> before clicking to reveal their true destination.<br>
            🔒 Ensure websites use <strong>secure connections (HTTPS)</strong>, but don’t rely on it alone.<br>
            🔑 Use a <strong>password manager</strong>—they won’t autofill credentials on fake sites.<br>
            🚫 Never enter personal details on sites you don’t trust.<br><br>
            If still unsure: Search for reviews or reports about the site online before visiting.<br><br>
            <strong>💡 Now, let’s begin the challenge!</strong>
        `
    },
    {
        title: "🎯 Your Task:",
        content: `
            🔎 You will see simulated search results containing a mix of <strong>safe</strong> and <strong>unsafe</strong> links.<br>
            ✅ Click on each article to gain immediate feedback about how safe the article is.<br><br>
            🏆 After reading the feedback for each link, the game will be availble to play - more info to come. Stay alert!
        `
    }
];

//timer code

export function startTimer() {
    //disable button after press here to stop reset
    clearInterval(timer);
    timeLeft = 20; // Reset to 20 seconds
    updateDisplay();

    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGameFunction();
            return; //call function to end game here
        }
        timeLeft--;
        updateDisplay();
    }, 1000);
}



function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('time').textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}



export function WebHideEnd() {
    //remove end card + blur
    webEndModel.style.display = 'none';
    webInterface.classList.remove('blurred'); // remove the blur
    //re-enable buttons
    document.getElementById("ask-button").disabled = false;
    document.getElementById("user-input").disabled = false;
}


//intro code
//update the model content based on the current page
export function updateModelContent() {
    console.log(currentPage)
    const titleElement = instructionModel.querySelector('h2');
    const contentElement = instructionModel.querySelector('p');

    // Update title and content
    titleElement.textContent = pages[currentPage].title;
    contentElement.innerHTML = pages[currentPage].content;

    // Manage button visibility
    prevWebButton.classList.toggle('hidden', currentPage === 0);
    nextWebButton.classList.toggle('hidden', currentPage === pages.length - 1);
    confirmWebButton.classList.toggle('hidden', currentPage !== pages.length - 1);
}

export function prevWebButtonFunction() {
    if (currentPage > 0) {
        currentPage--;
        updateModelContent();
    }
}

export function nextWebButtonFunction() {
    if (currentPage < pages.length - 1) {
        currentPage++;
        updateModelContent();
    }
}

//end of intro slides

export function resetWebFromDesktop() {
    leavetaskModel.style.display = 'flex'; //working
    desktopArea.classList.add('blurred'); // Apply the blur
}

export function confirmwebButtonFunction() {
    instructionModel.style.display = 'none';
    instructionsConfirmed = true; // listener to display instructions once user confirms
    webInterface.classList.remove('blurred'); // Remove the blur
    document.getElementById("ask-button").disabled = false;
    document.getElementById("user-input").disabled = false;
    //display search arrow
    searchArrow.style.display = 'block';
}
export function webfirstOpenFunction() {
    instructionModel.style.display = 'flex'; //working
    webInterface.classList.add('blurred'); // Apply the blur
}

export function initialiseWeb() {
    continueTask = true;
    document.getElementById("user-input").value = ""; //reset input
    document.getElementById("response-container").value = ""; //reset web search results
    document.getElementById("game-container").value = ""; //reset web search results
    responseContainer.textContent = '';
    gameContainer.textContent = '';

    if (webtaskComplete == false) {
        currentPage = 0;
        updateModelContent()
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
    webContainer.classList.remove('blurred'); // remove the blur

    document.getElementById("ask-button").disabled = false;
    document.getElementById("user-input").disabled = false;
}

export function confirmwebFunction() {
    //hide play button and timer
    playButton.style.display = 'none'
    timerDisplay.style.display = 'none'
    scoreDisplay.style.display = 'none'

    //hide quiz arrow
    const quizArrow = document.getElementById("quiz-arrow")
    quizArrow.style.display = 'none'

    document.getElementById("ask-button").disabled = false;
    document.getElementById("user-input").disabled = false;

    webContainer.classList.remove('blurred'); // remove the blur
    confirmClose = true;
    webopen = false;
    webtaskComplete = false;
    const webIcon = document.querySelector("#progress-web img");
    const webIconHome = document.querySelector("#web-icon img");
    const webIconTaskbar = document.querySelector("#taskbar-web img");

    if (webIcon) {
        webIcon.src = "assets/icons/web-icon.png";
        webIconHome.src = "assets/icons/web-icon.png";
        webIconTaskbar.src = "assets/icons/web-icon.png";
    }


    //disable reset 
    if (resetWeb.style.display === 'block') {
        resetWeb.style.display = 'none';
    }

    //show arrow
    const webArrow = document.getElementById("web-arrow")
    webArrow.style.display = 'block'


    //disable reset 
    if (profileContainer.style.display === 'block') {
        profileContainer.style.display = 'none' //hides profile
    }

    markTaskIncomplete()
    resetWebTask()
    closeWeb()
}


export async function askButtonFunction() {

    //remove arrow
    searchArrow.style.display = 'none'

    //show info on what to do 
    feedbackInfo.style.display = 'block'

    //unhide response container and hide game container
    responseContainer.style.display = 'block'
    gameContainer.style.display = 'none'

    const question = userInput.value.trim(); //stores question
    if (!question) {
        responseContainer.textContent = 'Please enter a search.';
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

//game function
export async function gameFunction() {
    //reset score
    score = 0;
    document.getElementById("score").textContent = `Score: ${score}`;

    //hide arrow to play game
    gameArrow.style.display = 'none';

    //complete  task 2
    webtask2 = true;
    webComplete()


    responseContainer.style.display = 'none'
    gameContainer.style.display = 'block'

    const question = userInput.value.trim(); //stores question
    if (!question) {
        gameContainer.textContent = 'Please enter a question.';
        return;
    }
    // Clear previous response and show loading
    gameContainer.textContent = 'Loading...';
    try {
        const response = await fetch('http://localhost:3000/generate-game', {
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
        // Display the results CHANGE THIS SO THAT IT IS DISPLAYED IN RANDOM LOCATIONS
        displayGameResults();
        searches = [];  //reset after displaying

    } catch (error) {
        console.error('Error:', error);
        gameContainer.textContent = 'Error generating response. Please try again.';
    }
}

function displayGameResults() {
    startTimer();
    // Clear previous search
    gameContainer.innerHTML = '';
    // Clear previous search
    responseContainer.innerHTML = '';
    correct = 0;
    incorrect = 0;
    score = 0;

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

        // 'Random' position - split the box into 12
        //width in 4
        //height in 3
        //size of square: x=407.5, y=183.3

        if (i === 0) {
            // Position randomly (within alocated square)
            const randomX = Math.random() * (407.5);
            const randomY = Math.random() * (183.3);

            searchItem.style.position = "absolute";
            searchItem.style.left = `${randomX}px`;
            searchItem.style.top = `${randomY}px`;
        } else if (i === 1) {
            // Position randomly (within alocated square)
            const randomX = 407.5 + (Math.random() * (407.5));
            const randomY = (Math.random() * (183.3));

            searchItem.style.position = "absolute";
            searchItem.style.left = `${randomX}px`;
            searchItem.style.top = `${randomY}px`;
        }
        else if (i === 2) {
            // Position randomly (within alocated square)
            const randomX = (407.5*2) + (Math.random() * (407.5));
            const randomY = (Math.random() * (183.3));

            searchItem.style.position = "absolute";
            searchItem.style.left = `${randomX}px`;
            searchItem.style.top = `${randomY}px`;
        }
        else if (i === 3) {
            // Position randomly (within alocated square)
            const randomX = (407.5*3) + (Math.random() * (407.5));
            const randomY = (Math.random() * (183.3));

            searchItem.style.position = "absolute";
            searchItem.style.left = `${randomX}px`;
            searchItem.style.top = `${randomY}px`;
        }
        else if (i === 4) {
            // Position randomly (within alocated square)
            const randomX = Math.random() * (407.5);
            const randomY = 183.3 + (Math.random() * (183.3));

            searchItem.style.position = "absolute";
            searchItem.style.left = `${randomX}px`;
            searchItem.style.top = `${randomY}px`;
        }
        else if (i === 5) {
            // Position randomly (within alocated square)
            const randomX = 407.5 + (Math.random() * (407.5));
            const randomY = 183.3 + (Math.random() * (183.3));

            searchItem.style.position = "absolute";
            searchItem.style.left = `${randomX}px`;
            searchItem.style.top = `${randomY}px`;
        }
        else if (i === 6) {
            // Position randomly (within alocated square)
            const randomX = (407.5*2) + (Math.random() * (407.5));
            const randomY = 183.3 + (Math.random() * (183.3));

            searchItem.style.position = "absolute";
            searchItem.style.left = `${randomX}px`;
            searchItem.style.top = `${randomY}px`;
        }
        else if (i === 7) {
            // Position randomly (within alocated square)
            const randomX = (407.5*3) + (Math.random() * (407.5));
            const randomY = 183.3 + (Math.random() * (183.3));

            searchItem.style.position = "absolute";
            searchItem.style.left = `${randomX}px`;
            searchItem.style.top = `${randomY}px`;
        }
        else if (i === 8) {
            // Position randomly (within alocated square)
            const randomX = (Math.random() * (407.5));
            const randomY = (183.3*2) + (Math.random() * (183.3));

            searchItem.style.position = "absolute";
            searchItem.style.left = `${randomX}px`;
            searchItem.style.top = `${randomY}px`;
        }
        else if (i === 9) {
            // Position randomly (within alocated square)
            const randomX = 407.5 + (Math.random() * (407.5));
            const randomY = (183.3*2) + (Math.random() * (183.3));

            searchItem.style.position = "absolute";
            searchItem.style.left = `${randomX}px`;
            searchItem.style.top = `${randomY}px`;
        }
        else if (i === 10) {
            // Position randomly (within alocated square)
            const randomX = (407.5*2) + (Math.random() * (407.5));
            const randomY = (183.3*2) + (Math.random() * (183.3));

            searchItem.style.position = "absolute";
            searchItem.style.left = `${randomX}px`;
            searchItem.style.top = `${randomY}px`;
        }
        else if (i === 11) {
            // Position randomly (within alocated square)
            const randomX = (407.5*3) + (Math.random() * (407.5));
            const randomY = (183.3*2) + (Math.random() * (183.3));

            searchItem.style.position = "absolute";
            searchItem.style.left = `${randomX}px`;
            searchItem.style.top = `${randomY}px`;
        }

        // Add click event listener to reveal feedback
        searchItem.addEventListener('click', function () {
            const isSafe = searchItem.getAttribute('data-isSafe') === 'true'; // Get 'isSafe' value

            // Change background color based on safety
            if (isSafe) {
                searchItem.style.backgroundColor = '#66CDAA';  // Green if safe
                correct++;
                score = correct - incorrect;
                document.getElementById("score").textContent = `Score: ${score}`;

            } else {
                searchItem.style.backgroundColor = '#FF6F6F';    // Red if unsafe
                incorrect++;
                score = correct - incorrect;
                document.getElementById("score").textContent = `Score: ${score}`;
            }

            // Hide the search item 
            setTimeout(() => {
                searchItem.style.display = 'none';
            }, 500);

            // Disable pointer events
            searchItem.style.pointerEvents = 'none';
        });



        searchItem.appendChild(title);
        searchItem.appendChild(url);
        searchItem.appendChild(description);

        gameContainer.appendChild(searchItem);
    }
}

function endGameFunction() {
    gameContainer.innerHTML = `<h1 style="color: black;">Game Complete! You achieved a score of ${score}. Keep trying until all tasks are complete!</h1>`;
    if (score >= 6) {
        webtask3 = true;
        webComplete();
    }
}


function gameInstructions() {


    // Add delay so user can read last feedback
    setTimeout(() => {
        webInterface.classList.add('blurred'); // Apply the blur
        gameInstructionsModel.style.display = 'block';
    }, 2000);
}


export function confirmGameInstructions() {
    webInterface.classList.remove('blurred'); // remove the blur
    gameInstructionsModel.style.display = 'none';

    //add arrow to play game
    gameArrow.style.display = 'block';
}

function displaySearchResults() {
    // Clear previous search
    gameContainer.innerHTML = '';
    // Clear previous search
    responseContainer.innerHTML = '';

    //clear search counter
    let feedbackAmount = 0;

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
            feedbackAmount++; //this is instantly set to 6

            // Change background color based on safety
            if (isSafe) {
                searchItem.style.backgroundColor = '#66CDAA';  // Green if safe
            } else {
                searchItem.style.backgroundColor = '#FF6F6F';    // Red if unsafe
            }

            // Show feedback after clicking
            feedback.style.display = 'block';  // Show feedback

            searchItem.style.pointerEvents = 'none';  // Disable pointer once clicked
            if (feedbackAmount === 6) {
                playButton.style.display = 'block'
                timerDisplay.style.display = 'block'
                scoreDisplay.style.display = 'block'

                //hide info
                feedbackInfo.style.display = 'none'

                //task 1 complete 
                webtask1 = true;
                webComplete()
                gameInstructions()
            }
        });



        searchItem.appendChild(title);
        searchItem.appendChild(url);
        searchItem.appendChild(description);
        searchItem.appendChild(feedback);

        responseContainer.appendChild(searchItem);
    }
}


export function webPreviouslyComplete() {
    const webArrow = document.getElementById("web-arrow")
    webArrow.style.display = 'none'


    webtaskComplete = true;

    // Update the icon to show the completed status
    const webIcon = document.querySelector("#progress-web img");
    const webIconHome = document.querySelector("#web-icon img");
    const webIconTaskbar = document.querySelector("#taskbar-web img");

    if (webIcon) { //cannot find
        webIcon.src = "assets/icons/web-tick-icon.png";
        webIconHome.src = "assets/icons/web-tick-icon.png";
        webIconTaskbar.src = "assets/icons/web-tick-icon.png";
    }


    //enable reset since task is complete
    if (resetWeb.style.display === 'none') {
        resetWeb.style.display = 'block';
    }
}



// Function to mark all web tasks as complete
export function webComplete() {
    if (continueTask) {
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
            //show end card
            webEndModel.style.display = 'flex'; //working
            webInterface.classList.add('blurred'); // Apply the blur
            //disable buttons while endcard is active
            //web specific buttons
            document.getElementById("ask-button").disabled = true;
            document.getElementById("user-input").disabled = true;

            markTaskComplete()
            webtaskComplete = true;

            // Update the icon to show the completed status
            const webIcon = document.querySelector("#progress-web img");
            const webIconHome = document.querySelector("#web-icon img");
            const webIconTaskbar = document.querySelector("#taskbar-web img");

            if (webIcon) { //cannot find
                webIcon.src = "assets/icons/web-tick-icon.png";
                webIconHome.src = "assets/icons/web-tick-icon.png";
                webIconTaskbar.src = "assets/icons/web-tick-icon.png";
            }

            //remove arrow
            const webArrow = document.getElementById("web-arrow")
            webArrow.style.display = 'none'

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
            webopen = false;
            continueTask = false;
        } else {
            const taskWebElement = document.querySelector(".Taskweb");
            const nextStepsDiv = taskWebElement.querySelector(".next-steps");
            if (nextStepsDiv) {
                nextStepsDiv.remove();
            }
            console.log("Not all tasks are complete yet.");
        }
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
        //remove end card + blur
        webEndModel.style.display = 'none';
        webInterface.classList.remove('blurred'); // remove the blur

        confirmClose = false;
        webopen = false;
        // If inbox is currently displayed, hide it and show desktop
        webContainer.style.display = 'none';
        desktopArea.style.display = 'flex';
    }
    else {
        document.getElementById("ask-button").disabled = true;
        document.getElementById("user-input").disabled = true;

        leavetaskModel.style.display = 'flex'; //working
        webContainer.classList.add('blurred'); // Apply the blur
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