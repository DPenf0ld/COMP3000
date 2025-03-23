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
    const tableBody = document.getElementById("user-table-body");
    tableBody.innerHTML = ""; //clear

    organisationUsers.forEach(user => { //row per user
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.tasks?.emailtaskComplete ? "✅" : "❌"}</td>
            <td>${user.tasks?.passwordtaskComplete ? "✅" : "❌"}</td>
            <td>${user.tasks?.webtaskComplete ? "✅" : "❌"}</td>
            <td>${user.quizscores?.phishingCorrect ?? 0}</td>
            <td>${user.quizscores?.passwordCorrect ?? 0}</td>
            <td>${user.quizscores?.webCorrect ?? 0}</td>
            <td>${user.quizscores?.percentage ?? "0"}%</td>
        `;
        tableBody.appendChild(row);
    });
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
