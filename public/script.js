// Handle Signup form submission
// Handle Signup form submission
document.getElementById('signup-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const dob = document.getElementById('dob').value;
  const organisation = document.getElementById('organisation').value;

  //disables going back (stops user logging back in without credentials)
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
  };

  // Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Validate password
  const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{12,}$/;
  if (!passwordPattern.test(password)) {
    alert('Password must be at least 12 characters long, contain a capital letter, a number, and a special character.');
    return;
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  // Validate date of birth
  if (!dob) {
    alert('Date of birth is required.');
    return;
  }

  if (!organisation) {
    alert('Please select an organisation.');
    return;
  }

  // Send signup request to server
  const response = await fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ firstName, lastName, email, password, dob, organisation }),
  });

  const result = await response.text();
  if (response.status === 201) {
    alert('Signup successful!');
    window.location.href = 'login.html'; // Redirect to login page
  } else {
    alert(result); // Show error message
  }
});


document.getElementById('login-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Read as plain text if not JSON
      throw new Error(errorText);
    }

    const result = await response.json();
    localStorage.setItem('token', result.token);
    localStorage.setItem('userEmail', email); // Store email in localStorage
    localStorage.setItem('tasks', JSON.stringify(result.tasks));
    localStorage.setItem('firstName', result.firstName); // Store first name
    localStorage.setItem('lastName', result.lastName);
    localStorage.setItem('dob', result.dob);


    if (result.role === "admin") {
      window.location.href = "admin.html"; // Redirect admins
    } else {
      alert('Login successful!');
      window.location.href = 'desktop.html';
    }
  } catch (error) {
    alert(error.message || 'Login failed');
  }
});


