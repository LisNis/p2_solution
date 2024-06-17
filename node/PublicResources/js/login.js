const loginBtn = document.getElementById('login-btn'); // Select the login button element
const signupBtn = document.getElementById('signup-btn'); // Select the signup button element
const usernameLogin = document.getElementById("login-username"); // Select the username input field for login
const passwordLogin = document.getElementById("login-password"); // Select the password input field for login

async function handleLogin() {
    const username = usernameLogin.value.trim(); // Get the username value and remove any extra spaces
    const password = passwordLogin.value; // Get the password value

    // Check if username and password are entered
    if (!username || !password) {
        alert("Please enter your username and password."); // Alert the user if either is missing
        return; // Stop the function
    }

    try {
        // Send login request to the server
        const response = await fetch('/login', {
            method: 'POST', // Set the method to POST
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify({ username, password }) // Send the username and password as JSON
        });

        if (response.ok) {
            // Login successful 
            localStorage.setItem("username", username); // Save the username in local storage
            window.location.href = "/groups"; // Redirect to the groups page
        } else {
            // Login failed, display error message
            const errorMessage = await response.text(); // Get the error message from the response
            alert(errorMessage); // Alert the user with the error message
        }
    } catch (error) {
        console.error('Error during login:', error); // Log the error
        alert('An error occurred during login. Please try again later.'); // Alert the user of an error
    }
};

loginBtn.addEventListener("click", handleLogin); // Add a click event listener to the login button

signupBtn.addEventListener("click", function() {
    window.location.href = "/signup"; // Redirect to the signup page when the signup button is clicked
});

// Event listener to allow login when pressing Enter key
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && (document.activeElement === usernameLogin || document.activeElement === passwordLogin)) {
        // If Enter key is pressed and focus is on username or password input fields, trigger login
        handleLogin(); // Call the handleLogin function
    }
});
