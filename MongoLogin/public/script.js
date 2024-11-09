// Handle Signup form submission
document.getElementById('signup-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    const result = await response.text();
    if (response.status === 201) {
      alert('Signup successful!');
      window.location.href = 'login.html';  // Redirect to login page
    } else {
      alert(result);  // Show error message
    }
  });
  
  // Handle Login form submission
  document.getElementById('login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    const result = await response.json();
    if (response.status === 200) {
      // Store JWT token in localStorage or sessionStorage
      localStorage.setItem('token', result.token);
      alert('Login successful!');
      window.location.href = 'desktop.html'  // Redirect to home page
    } else {
      alert(result.message || 'Login failed');
    }
  });
  