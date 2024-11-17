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
