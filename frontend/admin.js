import { adminLogOutFunction, BackLogOutFunction, ConfirmLogOut } from '../controllers/adminLogOutController.js';

document.addEventListener('DOMContentLoaded', function () {
    const adminLogOut = document.getElementById('admin-LogoutButton');
    adminLogOut.addEventListener('click', adminLogOutFunction);

    const backLogOut = document.getElementById('backLogOut-button');
    backLogOut.addEventListener('click', BackLogOutFunction);

    const confirmLogout = document.getElementById('confirmLogout-button');
    confirmLogout.addEventListener('click', ConfirmLogOut);
});
