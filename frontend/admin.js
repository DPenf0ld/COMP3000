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

    //RETURNING UNDEFINED
    try {
        console.log('Sending request with token:', token); 


        const response = await fetch('http://localhost:5000/admin-dashboard', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log('Admin Data:', data); // Debugging


    if (data && data.usersInOrganisation && Array.isArray(data.usersInOrganisation)) {
        console.log('Users in Organisation:', data.usersInOrganisation);

        // Store in localStorage
        localStorage.setItem('usersInOrganisation', JSON.stringify(data.usersInOrganisation));
        populateUserTable(data.usersInOrganisation);
    } else {
        console.log('No users found or invalid data structure');
    }

    // confirm its being stored
    const storedUsers = JSON.parse(localStorage.getItem('usersInOrganisation'));
    console.log('Stored Users in Organisation:', storedUsers);
    //NOTHING BEING STORED HERE


    } catch (error) {
        console.log('Error fetching user data:', error);
        alert('Error retrieving user data. Please try again later.');
    }


});


function populateUserTable(users) {
    const tableBody = document.getElementById('user-table-body');
    if (!tableBody) {
        console.error('Table body element not found');
        return;
    }

    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.firstName || 'N/A'}</td>
            <td>${user.lastName || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${calculateCompletedTasks(user.tasks || [])}</td>
        `;
        tableBody.appendChild(row);
    });
}


