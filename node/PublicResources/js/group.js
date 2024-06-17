// Select the container for displaying groups
const groupsContainer = document.querySelector('.groups'); // Selects the element with the class 'groups'

// Get the logged-in username from local storage
const username = localStorage.getItem('username'); // Gets the 'username' item from local storage

// Function to render groups in the groups container
function renderGroups(groups) {
    groupsContainer.innerHTML = ''; // Clear existing groups

    groups.forEach((group, index) => {
        // Create container for each group
        const groupContainer = document.createElement('div'); // Creates a new div element for each group
        groupContainer.classList.add('group-container'); // Adds the 'group-container' class to the div
        groupContainer.dataset.groupName = group; // Stores the group name as a data attribute

        const groupElement = document.createElement('div'); // Creates a new div element for the group content
        groupElement.classList.add('group'); // Adds the 'group' class to the div
        groupElement.id = `group-${index}`; // Sets the ID of the div to 'group-' followed by the index
        groupElement.innerHTML = `
            <div class="group-name">${group}</div>
        `; // Sets the inner HTML of the div with the group name

        // Add click event listener to group container
        groupContainer.addEventListener('click', function() {
            // Save the clicked group to localStorage
            localStorage.setItem('selectedGroup', this.dataset.groupName); // Saves the selected group name to local storage

            // Navigate to group page
            window.location.href = `/post`; // Redirects to the post page
        });

        groupContainer.appendChild(groupElement); // Appends the group content div to the group container div
        groupsContainer.appendChild(groupContainer); // Appends the group container div to the groups container
    });
}

// Function to fetch user groups from the server
async function fetchUserGroups() {
    try {
        const response = await fetch(`/user-groups?username=${username}`); // Sends a GET request to fetch user groups
        const data = await response.json(); // Parses the JSON response

        if (response.ok) {
            renderGroups(data.groups); // Renders the groups if the response is OK
        } else {
            console.error('Error fetching groups:', data.error); // Logs an error message if the response is not OK
        }
    } catch (error) {
        console.error('Error fetching groups:', error); // Logs any errors that occur during the fetch operation
    }
}

// Function to show the sidebar
function showSidebar() {
    const sidebar = document.querySelector('.sidebar'); // Selects the element with the class 'sidebar'
    sidebar.style.display = 'flex'; // Sets the display style of the sidebar to 'flex'
}

// Function to hide the sidebar
function hideSidebar() {
    const sidebar = document.querySelector('.sidebar'); // Selects the element with the class 'sidebar'
    sidebar.style.display = 'none'; // Sets the display style of the sidebar to 'none'
}

// Display the first letter of the username
if (username) {
    let firstLetter = username.charAt(0); // Gets the first character of the username
    document.querySelector('.firstname').textContent = firstLetter; // Sets the text content of the element with the class 'firstname'
    document.querySelector('.username').textContent = username; // Sets the text content of the element with the class 'username'
    document.querySelector('.firstnameProfile').textContent = firstLetter; // Sets the text content of the element with the class 'firstnameProfile'
}

// Add click event listener for the new group navigation
document.querySelector('.newGroup').addEventListener('click', function() {
    window.location.href = '/create'; // Redirects to the create group page
});

// Add click event listener for the invitation navigation
document.querySelector('.invitation').addEventListener('click', function() {
    window.location.href = '/invitation'; // Redirects to the invitation page
});

// Track modal visibility
let modalVisible = false; // Initializes a variable to track modal visibility

// Add click event listener to add a member to a group
document.querySelector('.addMemberToGroup').addEventListener('click', function() {
    if (!modalVisible) {
        const modal = document.createElement('div'); // Creates a new div element for the modal
        modal.classList.add('modal'); // Adds the 'modal' class to the div
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <input type="text" id="groupNameInput" placeholder="Group Name">
                <input type="text" id="usernameInput" placeholder="Username">
                <button onclick="addMemberToGroup()">Confirm</button>
            </div>
        `; // Sets the inner HTML of the modal with input fields and a button
        document.body.appendChild(modal); // Appends the modal to the body
        modalVisible = true; // Sets modal visibility to true
    } else {
        closeModal(); // Calls the function to close the modal
        modalVisible = false; // Sets modal visibility to false
    }
});

// Function to add a member to a group
async function addMemberToGroup() {
    const groupName = document.getElementById('groupNameInput').value; // Gets the value of the group name input field
    const username = document.getElementById('usernameInput').value; // Gets the value of the username input field

    try {
        const response = await fetch('/addNewMember', {
            method: 'POST', // Sets the request method to POST
            headers: {
                'Content-Type': 'application/json' // Sets the content type to JSON
            },
            body: JSON.stringify({
                teamName: groupName,
                members: [username], 
            }) // Converts the team name and members to a JSON string
        });

        if (response.ok) {
            console.log('Member added successfully'); // Logs a success message if the response is OK
        } else {
            console.error('Error adding member:', response.statusText); // Logs an error message if the response is not OK
        }
    } catch (error) {
        console.error('Error adding member:', error.message); // Logs any errors that occur during the fetch operation
    }

    closeModal(); // Calls the function to close the modal
}

// Function to close the modal
function closeModal() {
    const modal = document.querySelector('.modal'); // Selects the modal element
    if (modal) {
        modal.parentNode.removeChild(modal); // Removes the modal from the DOM
    }
    modalVisible = false; // Sets modal visibility to false
}

// Fetch and render groups on page load
fetchUserGroups(); // Calls the function to fetch user groups
