import { adminLogOutFunction, BackLogOutFunction, ConfirmLogOut } from '../controllers/adminLogOutController.js';

document.addEventListener('DOMContentLoaded', async function () {
    const adminLogOut = document.getElementById('admin-LogoutButton');
    adminLogOut.addEventListener('click', adminLogOutFunction);

    const backLogOut = document.getElementById('backLogOut-button');
    backLogOut.addEventListener('click', BackLogOutFunction);

    const confirmLogout = document.getElementById('confirmLogout-button');
    confirmLogout.addEventListener('click', ConfirmLogOut);

    const token = localStorage.getItem('token');

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
                'Authorization': `Bearer ${token}`,  // Correct header name
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const users = await response.json();
            console.log('Users:', users);
        } else {
            console.error('Error fetching users:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
});

