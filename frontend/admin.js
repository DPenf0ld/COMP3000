import { adminLogOutFunction, BackLogOutFunction, ConfirmLogOut } from '../controllers/adminLogOutController.js';

document.addEventListener('DOMContentLoaded', async function () {
    const adminLogOut = document.getElementById('admin-LogoutButton');
    adminLogOut.addEventListener('click', adminLogOutFunction);

    const backLogOut = document.getElementById('backLogOut-button');
    backLogOut.addEventListener('click', BackLogOutFunction);

    const confirmLogout = document.getElementById('confirmLogout-button');
    confirmLogout.addEventListener('click', ConfirmLogOut);

    const token = localStorage.getItem('token');
    console.log(token); //check if token is even present


    if (!token) {
        alert('Unauthorised access');
        window.location.href = 'login.html';
        return;
    }


    //FIX FROM HERE

    
        try {
            const response = await fetch('/admin/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
    
            const users = await response.json();
            const tableBody = document.getElementById('user-table-body');
            tableBody.innerHTML = '';
    
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${Object.values(user.tasks).filter(t => t === true).length} / 3</td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    
});

