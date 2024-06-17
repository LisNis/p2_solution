// Select the container for invitations and get the logged-in user from local storage
const invitationsContainer = document.querySelector('.invitation'); // Selects the element with the class 'invitation'
const loggedInUser = localStorage.getItem("username"); // Gets the 'username' item from local storage

// Function to generate invitations for the user
generateInvitationsForUser(loggedInUser);

// Function to add invitations to the invitation page
function generateInvitationsForUser(username) {
    fetch('../data/users.json') // Fetch the users.json file
        .then(response => response.json()) // Parse the JSON response
        .then(users => {
            const invitationsContainer = document.querySelector('.invitation'); // Selects the element with the class 'invitation'
            const user = users.find(user => user.username === username); // Find the user object with the matching username

            if (user) { // If the user is found
                const invitations = user.invitations; // Get the invitations for the user

                invitations.forEach(invitation => { // Iterate over each invitation
                    const newInvitation = document.createElement('div'); // Create a new div element for each invitation
                    newInvitation.classList.add('invitation-bar'); // Add the 'invitation-bar' class to the div

                    // Set the inner HTML of the div with the invitation details and buttons
                    newInvitation.innerHTML = `
                        <p>You have been invited to group: "${invitation}"</p>
                        <button class="accept-btn" data-invitation="${invitation}">Accept</button>
                        <button class="decline-btn" data-invitation="${invitation}">Decline</button>
                    `;

                    const acceptButton = newInvitation.querySelector('.accept-btn'); // Select the accept button within the new invitation div
                    const declineButton = newInvitation.querySelector('.decline-btn'); // Select the decline button within the new invitation div

                    // Add click event listener to the accept button
                    acceptButton.addEventListener('click', (event) => {
                        const invitation = event.target.dataset.invitation; // Get the invitation data from the button

                        // Construct the data object to send to the server
                        const userData = {
                            username: loggedInUser,
                            action: 'accept',
                            invitation: invitation
                        };

                        // Send the data to the server
                        updateUserData(userData);

                        // Remove the invitation from the UI
                        newInvitation.remove();

                        // Optionally, perform any other actions
                        console.log(`Accepted invitation to group: "${invitation}"`);
                    });

                    // Add click event listener to the decline button
                    declineButton.addEventListener('click', (event) => {
                        const invitation = event.target.dataset.invitation; // Get the invitation data from the button

                        // Construct the data object to send to the server
                        const userData = {
                            username: loggedInUser,
                            action: 'decline',
                            invitation: invitation
                        };

                        // Send the data to the server
                        updateUserData(userData);

                        // Remove the invitation from the UI
                        newInvitation.remove();

                        // Optionally, perform any other actions
                        console.log(`Declined invitation to group: "${invitation}"`);
                    });

                    invitationsContainer.appendChild(newInvitation); // Append the new invitation div to the invitations container
                });
            } else {
                console.error('User not found:', username); // Log an error if the user is not found
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error); // Log any errors that occur during the fetch operation
        });
}

// Function to send a POST request to update the user data on the server
function updateUserData(userData) {
    fetch('/update-user-data', {
        method: 'POST', // Set the request method to POST
        headers: {
            'Content-Type': 'application/json' // Set the content type to JSON
        },
        body: JSON.stringify(userData) // Convert the user data to a JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update user data'); // Throw an error if the response is not OK
        }
        console.log('User data updated successfully'); // Log a success message
    })
    .catch(error => {
        console.error('Error updating user data:', error); // Log any errors that occur during the fetch operation
    });
}
