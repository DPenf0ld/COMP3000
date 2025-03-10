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
  const signupError = document.querySelector('.signup-error');

  //disables going back (stops user logging back in without credentials)
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
  };

  // Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    signupError.innerHTML = `<p class="error">Please enter a valid email address.</p>`; // Show error message
    return;
  }

  // Validate password
  const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{12,}$/;
  if (!passwordPattern.test(password)) {
    signupError.innerHTML = `<p class="error">Password must be at least 12 characters long, contain a capital letter, a number, and a special character.</p>`; // Show error message
    return;
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    signupError.innerHTML = `<p class="error">Passwords do not match.</p>`; // Show error message
    return;
  }

  // Validate date of birth
  if (!dob) {
    signupError.innerHTML = `<p class="error">Date of birth is required.</p>`; // Show error message
    return;
  }

  if (!organisation) {
    signupError.innerHTML = `<p class="error">Please select an organisation.</p>`; // Show error message
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
    signupError.innerHTML = '<p class="success">Signup successful!</p>';
    setTimeout(() => {
      window.location.href = 'login.html'; // Redirect to login page
    }, 2000); // Redirect after 2 seconds to read successful sign up
  } else {
    signupError.innerHTML = `<p class="error">${result}</p>`; // Show error message
  }
});


document.getElementById('login-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const loginError = document.querySelector('.login-error');

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
      loginError.innerHTML = '<p class="success">Login successful!</p>';
      setTimeout(() => {
        window.location.href = 'desktop.html'; // Redirect to desktop
      }, 2000); // Redirect after 2 seconds to read successful sign in
    }
  } catch (error) {
    loginError.innerHTML = `<p class="error">${error.message || 'Login failed'}</p>`;
  }
});


