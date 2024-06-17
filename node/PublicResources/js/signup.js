// Add an event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const signupBtn = document.getElementById('signup-btn'); // Select the signup button by ID
    const loginBtn = document.getElementById('login-btn'); // Select the login button by ID
    const usernameSignup = document.getElementById("user-name"); // Select the username input field by ID
    const passwordSignup = document.getElementById("password"); // Select the password input field by ID
    const passwordRepeat = document.getElementById("passwordRepeat"); // Select the repeat password input field by ID

    // Add an event listener for the signup button
    signupBtn.addEventListener("click", async function() {
        const username = usernameSignup.value.trim(); // Get and trim the username input value
        const password = passwordSignup.value; // Get the password input value
        const repeatPassword = passwordRepeat.value; // Get the repeat password input value

        // Check if all fields are filled
        if (!username || !password || !repeatPassword) {
            alert("Please enter your username, password, and repeat password."); // Show an alert message
            return; // Exit the function
        }

        // Check if passwords match
        if (password !== repeatPassword) {
            alert("Passwords do not match."); // Show an alert message
            return; // Exit the function
        }

        // Check if password is at least 4 characters long
        if (password.length < 4) {
            alert("Password must be at least 4 characters long."); // Show an alert message
            return; // Exit the function
        }

        // Check if username is not too long
        if (username.length > 15) {
            alert("Username is too long."); // Show an alert message
            return; // Exit the function
        }

        try {
            // Check if the username already exists
            const response = await fetch(`/check-username?username=${encodeURIComponent(username)}`); // Send a GET request to check the username
            const data = await response.json(); // Parse the JSON response

            if (!data.available) {
                alert("Username already exists. Please choose a different username."); // Show an alert message
                return; // Exit the function
            }

            // Send signup request to server
            const signupResponse = await fetch('/signup', {
                method: 'POST', // Set the request method to POST
                headers: {
                    'Content-Type': 'application/json' // Set the content type to JSON
                },
                body: JSON.stringify({ username, password }) // Convert the username and password to a JSON string
            });

            if (signupResponse.ok) {
                // If signup is successful, save username to local storage and redirect
                localStorage.setItem("username", username); // Save the username to local storage
                window.location.href = "/groups"; // Redirect to the groups page
            } else {
                // If signup fails, display an error message
                const errorMessage = await signupResponse.text(); // Get the error message text from the response
                alert(errorMessage); // Show an alert message with the error
            }
        } catch (error) { // Catch any errors that occur during the fetch operation
            // Handle network errors
            console.error('Error during signup:', error); // Log the error to the console
            alert('An error occurred during signup. Please try again later.'); // Show an alert message
        }
    });

    // Add a click event listener to the login button to redirect to the login page
    loginBtn.addEventListener("click", function() {
        window.location.href = "/login"; // Redirect to the login page
    });
});
