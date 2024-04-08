const postButton = document.getElementById("post-btn");
const inputElement = document.getElementById("input-post");
const displayElement = document.getElementById("displayText");

postButton.addEventListener("click", function() {
    let userInput = inputElement.value;
    console.log("slay");
    displayElement.textContent = userInput;
});
