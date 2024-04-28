const invitationsContainer = document.querySelector('.invitation');
const addInvitationButton = document.getElementById('addInvitationButton');

//function to add invitations to the invitation page
function addInvitation() {
    const newInvitation = document.createElement('div');
    newInvitation.classList.add('invitation-bar');

    newInvitation.innerHTML = `
        <p>You have been invited to group: "Insert name"</p>
        <button>Accept</button>
        <button>Decline</button>
    `;

    newInvitation.querySelector('button').addEventListener('click', () => {
        // Do something when the button is clicked
    });

    invitationsContainer.appendChild(newInvitation);
}

addInvitationButton.addEventListener('click', addInvitation);