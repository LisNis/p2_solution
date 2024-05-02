
const loginBtn = document.getElementById("submit-btn");
const loginForm = document.getElementById("login-form");
const signupBtn = document.getElementById("signup-btn");

loginBtn.addEventListener("click", function() {
    // if user found in json 
    window.location.href = "/groups";
});


signupBtn.addEventListener("click", function() {
    window.location.href = "/signup";
});

loginForm.onsubmit = function() {
    localStorage.setItem("username", document.getElementById("user-name").value);
};