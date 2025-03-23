import { TableViewFunction, GraphViewFunction, populateUserTable, adminLogOutFunction, BackLogOutFunction, ConfirmLogOut } from '../controllers/adminController.js';
import { updateClock } from '../controllers/clockController.js';

document.addEventListener('DOMContentLoaded', async function () {
    const adminLogOut = document.getElementById('admin-LogoutButton');
    adminLogOut.addEventListener('click', adminLogOutFunction);

    const backLogOut = document.getElementById('backLogOut-button');
    backLogOut.addEventListener('click', BackLogOutFunction);

    const confirmLogout = document.getElementById('confirmLogout-button');
    confirmLogout.addEventListener('click', ConfirmLogOut);

    const GraphView = document.getElementById('Graph-view');
    GraphView.addEventListener('click', GraphViewFunction);

    const TableView = document.getElementById('Table-view');
    TableView.addEventListener('click', TableViewFunction);

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

// Call clock function and update every second
setInterval(updateClock, 1000);
updateClock();
