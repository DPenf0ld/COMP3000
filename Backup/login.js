// login.js

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    // Handle form submission
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form from reloading the page

        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            // Send a POST request to the login endpoint
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            // Check for success or error response
            if (response.ok) {
                // Store the auth token in localStorage
                localStorage.setItem('authToken', data.token);

                // Redirect to the homepage or dashboard after successful login
                window.location.href = 'index.html'; // Modify this if you have a dashboard page
            } else {
                // Show error message from server
                alert(data.msg || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the server. Please try again later.');
        }
    });
});
