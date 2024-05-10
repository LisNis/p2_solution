const invitationsContainer = document.querySelector('.invitation');

//function to add invitations to the invitation page
function generateInvitationsForUser(username) {
    fetch('../users.json')
        .then(response => response.json())
        .then(users => {
            const invitationsContainer = document.querySelector('.invitation');
            const user = users.find(user => user.username === username);

            if (user) {
                const invitations = user.invitations;

                invitations.forEach(invitation => {
                    const newInvitation = document.createElement('div');
                    newInvitation.classList.add('invitation-bar');

                    newInvitation.innerHTML = `
                        <p>You have been invited to group: "${invitation}"</p>
                        <button class="accept-btn" data-invitation="${invitation}">Accept</button>
                        <button class="decline-btn" data-invitation="${invitation}">Decline</button>
                    `;

                    const acceptButton = newInvitation.querySelector('.accept-btn');
                    const declineButton = newInvitation.querySelector('.decline-btn');

                    acceptButton.addEventListener('click', (event) => {
                        const invitation = event.target.dataset.invitation;
                        // Remove the accepted invitation from user's invitations array
                        user.invitations = user.invitations.filter(inv => inv !== invitation);
                        // Add the accepted invitation to user's groups array
                        user.group.push(invitation);
                        // Update the JSON data
                        updateUserJSON(users);
                        // Remove the invitation from UI
                        newInvitation.remove();
                        // Optionally, perform any other actions
                        console.log(`Accepted invitation to group: "${invitation}"`);
                    });

                    declineButton.addEventListener('click', (event) => {
                        const invitation = event.target.dataset.invitation;
                        // Optionally, perform any actions for declining invitation
                        console.log(`Declined invitation to group: "${invitation}"`);
                        // Remove the invitation from UI
                        newInvitation.remove();
                    });

                    invitationsContainer.appendChild(newInvitation);
                });
            } else {
                console.error('User not found:', username);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

const loggedInUser = "Alisanders";
generateInvitationsForUser(loggedInUser);

// Function to update the JSON data after accepting an invitation
function updateUserJSON(users) {
    fetch('/invitation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(users)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update user data');
        }
        console.log('User data updated successfully');
    })
    .catch(error => {
        console.error('Error updating user data:', error);
    });
}
