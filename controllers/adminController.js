console.log('LogOutController.js loaded');

const instructionModel = document.getElementById('admin-instructions-logout'); // Instruction model
const desktopContainer = document.getElementById('desktop-area');

const GraphButton = document.getElementById('Graph-view');
const TableButton = document.getElementById('Table-view');
const UserTable = document.getElementById('user-table');

export function BackLogOutFunction() {
    instructionModel.style.display = 'none';
    desktopContainer.classList.remove('blurred'); // remove the blur
}

export function ConfirmLogOut() {
    //Clears all history so that user can not navigate back into a logged in account
    sessionStorage.clear();
    localStorage.clear();
    window.location.replace("/index.html");
}

export function adminLogOutFunction() {
    instructionModel.style.display = 'flex'; //working
    desktopContainer.classList.add('blurred'); // Apply the blur
}

export function populateUserTable(organisationUsers) {

    let TotalPercentage = 0.00;
    let UserCount = 0;
    let result = "Incomplete";
    let resultColour = "orange"

    const tableBody = document.getElementById("user-table-body");
    tableBody.innerHTML = ""; //clear

    organisationUsers.forEach(user => { //row per user
        if (user.role === "user") {

            // make sure percentage is a valid number
            const userPercentage = Number(user.quizscores?.percentage) || 0;
            console.log("User Percentage:", userPercentage); //check its a valid number

            //only increases if a score is above 0
            if (user.quizscores?.percentage > 0) {
                TotalPercentage += userPercentage;
                UserCount++;
            }

            const row = document.createElement("tr");
            row.setAttribute("data-email", user.email); // important to query each row later with resets

            if (user.quizscores?.percentage >= 70) {
                result = "Passed";
                resultColour = "#4CAF50" //cant see normal green
            } else if (user.quizscores?.percentage == 0) {
                result = "Incomplete";
                resultColour = "orange"
            } else {
                result = "Failed";
                resultColour = "red"
            }

            row.innerHTML = `
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>
            ${user.tasks?.emailtaskComplete ? `<span id="reset-text-emailtaskComplete-${user.email}"> ✅</span>` : "❌"}   
            ${user.tasks?.emailtaskComplete ? `<button class="reset" id="reset-emailtaskComplete-${user.email}">Reset</button>` : ""}
            </td>
            <td>
            ${user.tasks?.passwordtaskComplete ? `<span id="reset-text-passwordtaskComplete-${user.email}"> ✅</span>` : "❌"}
            ${user.tasks?.passwordtaskComplete ? `<button class="reset" id="reset-passwordtaskComplete-${user.email}">Reset</button>` : ""}
            </td>
            <td>
            ${user.tasks?.webtaskComplete ? `<span id="reset-text-webtaskComplete-${user.email}"> ✅</span>` : "❌"}
            ${user.tasks?.webtaskComplete ? `<button class="reset" id="reset-webtaskComplete-${user.email}">Reset</button>` : ""}
            </td>
            <td><span id="reset-text-phishingCorrect-${user.email}">${user.quizscores?.phishingCorrect ?? 0}/5</span></td>
            <td><span id="reset-text-passwordCorrect-${user.email}">${user.quizscores?.passwordCorrect ?? 0}/5</span></td>
            <td><span id="reset-text-webCorrect-${user.email}">${user.quizscores?.webCorrect ?? 0}/5</span></td>
            <td>
            <span id="reset-text-percentage-${user.email}">${user.quizscores?.percentage ?? "0"}%</span>
            ${user.quizscores?.percentage > 0 ? `<button class="reset" id="reset-scores-${user.email}">Reset</button>` : ""}
            </td>

            <td class="result-pass-fail" id="reset-text-result-${user.email}">${result}</td>
        `;
            tableBody.appendChild(row);

            //change the colour
            row.querySelector(".result-pass-fail").style.color = resultColour;

            // adding the event listeners to each reset button
            if (user.tasks?.emailtaskComplete) {
                console.log(`reset-emailtaskComplete-${user.email}`)
                document.getElementById(`reset-emailtaskComplete-${user.email}`).addEventListener("click", () => resetTask(user.email, 'emailtaskComplete')); //passses in correct email
            }
            if (user.tasks?.passwordtaskComplete) {
                document.getElementById(`reset-passwordtaskComplete-${user.email}`).addEventListener("click", () => resetTask(user.email, 'passwordtaskComplete'));
            }
            if (user.tasks?.webtaskComplete) {
                document.getElementById(`reset-webtaskComplete-${user.email}`).addEventListener("click", () => resetTask(user.email, 'webtaskComplete'));
            }
            if (user.quizscores?.percentage > 0) {
                document.getElementById(`reset-scores-${user.email}`).addEventListener("click", () => resetScores(user.email));
            }
        }
    });

    // this only performs if usercount is above 0
    let AveragePercentage = UserCount > 0 ? (TotalPercentage / UserCount).toFixed(2) : "0.00";

    console.log(AveragePercentage);

    const averagePercentageID = document.getElementById("average-percentage");
    averagePercentageID.innerText = `Organisation Average Percentage: ${AveragePercentage}%`;

}

//reset tasks
function resetTask(email, taskName) {
    try {
        fetch('/update-tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                taskName: taskName,
                status: false // sets task to incomplete
            })
        })

        // Reset the task's icon and text
        const row = document.querySelector(`#user-table-body tr[data-email="${email}"]`); //queries the specific row 

        if (row) { //check the row is present

            // Hide the Reset Button based on the task and user
            const resetButton = document.getElementById(`reset-${taskName}-${email}`); //ERROR HERE STORING LIKE #reset-emailtaskComplete-test99@gmail.com
            if (resetButton) {
                resetButton.style.display = "none"; // Hide the reset button
            }

            // Change the text on the task and user
            const ResetText = document.getElementById(`reset-text-${taskName}-${email}`);
            if (ResetText) {
                ResetText.innerHTML = "❌"; // change back to incomplete
            }
        }

    } catch (error) {
        console.log(error.message || 'Failed to update quiz scores.');
    }
}

//reset quiz scores
function resetScores(email) {
    try {
        fetch('/update-scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                phishingCorrect: 0,
                passwordCorrect: 0,
                webCorrect: 0,
                percentage: 0 // sets all back to 0
            })
        })

        // Reset the task's button and text
        const row = document.querySelector(`#user-table-body tr[data-email="${email}"]`); //queries the specific row 

        if (row) { //check the row is present

            // Hide the Reset Button based on the task and user
            const resetButton = document.getElementById(`reset-scores-${email}`); //ERROR HERE STORING LIKE #reset-emailtaskComplete-test99@gmail.com
            if (resetButton) {
                resetButton.style.display = "none"; // Hide the reset button
            }

            // Change the text on the task and user
            const ResetText = document.getElementById(`reset-text-percentage-${email}`);
            if (ResetText) {
                ResetText.innerHTML = "0%"; // change back to incomplete
            }

            // Pass/ Fail column
            const PFcolumn = document.getElementById(`reset-text-result-${email}`);
            if (PFcolumn) {
                PFcolumn.innerHTML = "Incomplete"; 
                PFcolumn.style.color = "orange";  // set the text colour to orange
            }

            // Phishing Score
            const PhishingScore = document.getElementById(`reset-text-phishingCorrect-${email}`);
            if (PhishingScore) {
                PhishingScore.innerHTML = "0/5"; // change back to incomplete
            }

            // Password Score
            const PasswordScore = document.getElementById(`reset-text-passwordCorrect-${email}`);
            if (PasswordScore) {
                PasswordScore.innerHTML = "0/5"; // change back to incomplete
            }

            // Web Score
            const WebScore = document.getElementById(`reset-text-webCorrect-${email}`);
            if (WebScore) {
                WebScore.innerHTML = "0/5"; // change back to incomplete
            }
        }


    } catch (error) {
        console.log(error.message || 'Failed to update quiz scores.');
    }
}


export function GraphViewFunction() {
    if (TableButton.style.display === 'none') {
        TableButton.style.display = 'block';
        GraphButton.style.display = 'none';

        UserTable.style.visibility = 'hidden'; //must use visibility not display otherwise table styles are not applied
    }
}

export function TableViewFunction() {
    if (GraphButton.style.display === 'none') {
        GraphButton.style.display = 'block';
        TableButton.style.display = 'none';

        UserTable.style.visibility = 'visible';
    }
}
