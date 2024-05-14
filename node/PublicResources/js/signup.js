const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const usernameSignup = document.getElementById("user-name");
const passwordSignup = document.getElementById("password");
const passwordRepeat = document.getElementById("passwordRepeat");

signupBtn.addEventListener("click", function() {
    const username = usernameSignup.value;
    const password = passwordSignup.value;
    const repeatPassword = passwordRepeat.value;

    // Check if username, password, and repeat password are provided
    if (username === '' || password === '' || repeatPassword === '') {
        alert("Please enter your username, password, and repeat password");
        return;
    }

    // Check if password and repeat password match
    if (password !== repeatPassword) {
        alert("Passwords do not match");
        return;
    }

    // Send signup request to server
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => {
        if (response.ok) {
            // Signup successful, redirect to groups page
            window.location.href = "/login";
        } else {
            // Signup failed, display error message
            return response.text().then(errorMessage => {
                alert(errorMessage);
            });
        }
    })
    .catch(error => {
        console.error('Error during signup:', error);
        alert('An error occurred during signup. Please try again later.');
    });
});

loginBtn.addEventListener("click", function() {
    window.location.href = "/login";
});
