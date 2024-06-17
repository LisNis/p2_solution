// Add an event listener for when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    const teamNameForm = document.getElementById("team-name-form"); // Select the team name form by ID
    const teamNameInput = document.getElementById("team-name-input"); // Select the team name input field by ID
    const teamMemberForm = document.getElementById("team-member-form"); // Select the team member form by ID
    const confirmButton = document.getElementById("confirm-team"); // Select the confirm button by ID
    const teamNameContainer = document.getElementById("team-name-container"); // Select the team name container by ID
    const teamMembersContainer = document.getElementById("team-members-container"); // Select the team members container by ID

    let teamName = ""; // Initialize a variable to store the team name
    let members = []; // Initialize an array to store the team members

    // Add an event listener for the team name form submission
    teamNameForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        teamName = teamNameInput.value; // Get the value of the team name input field
        displayTeamName(); // Call the function to display the team name
        teamNameInput.disabled = true; // Disable the team name input field
        teamMemberForm.style.display = "block"; // Display the team member form
    });

    // Function to display the team name
    function displayTeamName() {
        const teamNameElement = document.createElement("h2"); // Create an h2 element for the team name
        teamNameElement.textContent = "Team: " + teamName; // Set the text content of the h2 element
        teamNameContainer.appendChild(teamNameElement); // Append the h2 element to the team name container

        const removeButton = document.createElement("button"); // Create a button element for removing the team
        removeButton.textContent = "Remove Team"; // Set the text content of the button
        removeButton.classList.add("remove-btn"); // Add the 'remove-btn' class to the button
        removeButton.id = "remove-team-btn"; // Set the ID of the button
        teamNameContainer.appendChild(removeButton); // Append the button to the team name container

        confirmButton.style.display = "block"; // Display the confirm button
    }

    // Add an event listener for removing the team
    teamNameContainer.addEventListener("click", function(event) {
        if (event.target.id === "remove-team-btn") { // If the clicked element is the remove button
            teamNameContainer.innerHTML = ""; // Clear the team name container
            members = []; // Reset the members array
            teamNameInput.disabled = false; // Enable the team name input field
            confirmButton.style.display = "none"; // Hide the confirm button
        }
    });

    // Add an event listener for the team member form submission
    teamMemberForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        const memberName = document.getElementById("member-name-input").value; // Get the value of the member name input field
        members.push(memberName); // Add the member name to the members array
        displayTeamMembers(); // Call the function to display the team members
        teamMemberForm.reset(); // Reset the team member form
    });

    // Function to display the team members
    function displayTeamMembers() {
        teamMembersContainer.innerHTML = ""; // Clear the previous list of team members

        members.forEach(function(member, index) { // Iterate over each member
            const memberElement = document.createElement("div"); // Create a div element for the member
            memberElement.textContent = member; // Set the text content of the div to the member name

            const removeButton = document.createElement("button"); // Create a button element for removing the member
            removeButton.textContent = "Remove"; // Set the text content of the button
            removeButton.classList.add("remove-btn"); // Add the 'remove-btn' class to the button
            removeButton.dataset.index = index; // Set a data attribute to store the index of the member

            memberElement.appendChild(removeButton); // Append the button to the member div
            teamMembersContainer.appendChild(memberElement); // Append the member div to the team members container
        });
    }

    // Add an event listener for removing team members
    teamMembersContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("remove-btn")) { // If the clicked element has the 'remove-btn' class
            const index = parseInt(event.target.dataset.index); // Get the index of the member from the data attribute
            members.splice(index, 1); // Remove the member from the members array
            displayTeamMembers(); // Call the function to display the updated list of team members
        }
    });

    // Add an event listener for the confirm button
    confirmButton.addEventListener("click", function() {
        const username = localStorage.getItem('username'); // Get the username from local storage
        const teamData = {
            teamName,
            members,
            username
        }; // Create an object to store the team data

        // Send a POST request to create the team
        fetch('/create-team', {
            method: 'POST', // Set the request method to POST
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify(teamData) // Convert the team data to a JSON string
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            if (data.success) { // If the response indicates success
                alert("Team creation confirmed!"); // Show an alert message
            } else { // If the response indicates an error
                alert("Error: " + data.message); // Show an alert message with the error
            }
        })
        .catch(error => {
            console.error('Error:', error); // Log any errors that occur during the fetch operation
            alert("An error occurred while creating the team."); // Show an alert message
        });
        window.location.href = "/groups"; // Redirect to the groups page
    });
});
