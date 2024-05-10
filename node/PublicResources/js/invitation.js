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
                        <button>Accept</button>
                        <button>Decline</button>
                    `;

                    newInvitation.querySelector('button').addEventListener('click', () => {
                        // Do something when the button is clicked
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