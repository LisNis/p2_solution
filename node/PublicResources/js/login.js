const loginBtn = document.getElementById("submit-btn");
const usernameInput = document.getElementById("user-name");
const signupBtn = document.getElementById("signup-btn");
const passwordInput = document.getElementById("password");

function handleLogin() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Check if username and password are provided
    if (username === '' || password === '') {
        alert("Please enter your username and password");
        return;
    }

    // Send login request to server
    fetch('/login', {
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
            // Login successful, redirect to groups page
            localStorage.setItem("username", username);
            window.location.href = "/groups";
        } else {
            // Login failed, display error message
            return response.text().then(errorMessage => {
                alert(errorMessage);
            });
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again later.');
    });
}

loginBtn.addEventListener("click", handleLogin);

signupBtn.addEventListener("click", function() {
    window.location.href = "/signup";
});

// Event listener to allow login when pressing Enter key
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && (document.activeElement === usernameInput || document.activeElement === passwordInput)) {
        // If Enter key is pressed and focus is on username or password input fields, trigger login
        handleLogin();
    }
});
