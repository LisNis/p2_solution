
const loginBtn = document.getElementById("submit-btn");
const username = document.getElementById("user-name");
const signupBtn = document.getElementById("signup-btn");

loginBtn.addEventListener("click", function() {
    // if user found in json 
    localStorage.setItem("username", username.value);
    if (username.value === ''){
        alert("Please enter your username");
        console.log(username.value);
    } else {
        window.location.href = "/groups";
    }
});

signupBtn.addEventListener("click", function() {
    window.location.href = "/signup";
});
