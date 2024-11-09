// signup.js

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');

    // Handle form submission
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form from reloading the page

        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        try {
            // Send a POST request to the signup endpoint
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            // Check for success or error response
            if (response.ok) {
                alert('Registration successful! Please log in.');
                window.location.href = 'login.html'; // Redirect to login page
            } else {
                // Show error message from server
                alert(data.msg || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the server. Please try again later.');
        }
    });
});
