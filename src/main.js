
const loginBtn = document.getElementById("submit-btn");
const userName = document.getElementById("user-name");
const groupName = document.getElementById("group-name");
const inputPost = document.getElementById("input-post");
const signupBtn = document.getElementById("signup-btn");

loginBtn.addEventListener("click", function() {
    // if user found in json 
    window.location.href = "groups.html";
});


signupBtn.addEventListener("click", function() {
    window.location.href = "signup.html";
});
