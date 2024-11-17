// Function to toggle between desktop and inbox view
document.addEventListener('DOMContentLoaded', function() {
    const emailIconDesktop = document.getElementById('email-icon');        // Icon for email on desktop
    const emailIconTaskbar = document.getElementById('taskbar-email');     // Icon for email on taskbar
    const desktopArea = document.getElementById('desktop-area');           // Desktop area
    const inboxContainer = document.getElementById('inbox-container');     // Inbox container
    const backToDesktop = document.getElementById('close-inbox');      // Button or link to return to desktop

    // Function to toggle inbox view
    function toggleInbox() {
        if (inboxContainer.style.display === 'block') {
            // If inbox is currently displayed, hide it and show desktop
            inboxContainer.style.display = 'none';
            desktopArea.style.display = 'flex';
        } else {
            // If inbox is not displayed, show it and hide desktop
            inboxContainer.style.display = 'block';
            desktopArea.style.display = 'none';
        }
    }

    // Add event listeners to email icons on desktop and taskbar
    emailIconDesktop.addEventListener('click', toggleInbox);
    emailIconTaskbar.addEventListener('click', toggleInbox);

    // Go back to the desktop from the inbox using the back-to-desktop button
    backToDesktop.addEventListener('click', function() {
        inboxContainer.style.display = 'none';
        desktopArea.style.display = 'flex';
    });

});

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Format hours and minutes to always show two digits
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Display the time in the format: HH:MM:SS AM/PM
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    // Update the clock div with the current time
    document.getElementById('clock').textContent = timeString;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Call the function once to show the initial time immediately
updateClock();


const userEmail = localStorage.getItem('userEmail'); // Retrieve the email from localStorage

        if (userEmail) {
            const emailElement = document.getElementById('email');
            emailElement.innerText = userEmail; // Set the email to the div
        } else {
            console.log('User email not found');
        }