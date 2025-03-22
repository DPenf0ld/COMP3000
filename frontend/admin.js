import { adminLogOutFunction, BackLogOutFunction, ConfirmLogOut } from '../controllers/adminLogOutController.js';

document.addEventListener('DOMContentLoaded', async function () {
    const adminLogOut = document.getElementById('admin-LogoutButton');
    adminLogOut.addEventListener('click', adminLogOutFunction);

    const backLogOut = document.getElementById('backLogOut-button');
    backLogOut.addEventListener('click', BackLogOutFunction);

    const confirmLogout = document.getElementById('confirmLogout-button');
    confirmLogout.addEventListener('click', ConfirmLogOut);

    const token = localStorage.getItem('token');
    console.log('Stored Token:', token); // check if there even is a token


    if (!token) {
        alert('Unauthorised access');
        window.location.href = 'login.html';
        return;
    }

    const organisationUsers = JSON.parse(localStorage.getItem('organisationUsers')) || [];

    // Check if organisationUsers has been successful
    if (organisationUsers.length > 0) {
        populateUserTable(organisationUsers);
    } else {
        console.log('No user data found in localStorage.');
    }


});

// Assume 'organisationUsers' is the array received from the backend
function populateUserTable(organisationUsers) {
    const tableBody = document.getElementById("user-table-body");
    tableBody.innerHTML = ""; //clear

    organisationUsers.forEach(user => { //row per user
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.tasks?.phishingtaskComplete ? "✔️" : "❌"}</td>
            <td>${user.tasks?.passwordtaskComplete ? "✔️" : "❌"}</td>
            <td>${user.tasks?.webtaskComplete ? "✔️" : "❌"}</td>
            <td>${user.quizscores?.phishingCorrect ?? 0}</td>
            <td>${user.quizscores?.passwordCorrect ?? 0}</td>
            <td>${user.quizscores?.webCorrect ?? 0}</td>
            <td>${user.quizscores?.percentage ?? "0"}%</td>
        `;
        tableBody.appendChild(row);
    });
}