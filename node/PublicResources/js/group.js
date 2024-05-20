const groupsContainer = document.querySelector('.groups');

// gets username
const username = localStorage.getItem('username');

// Function to render groups
function renderGroups(groups) {
    groupsContainer.innerHTML = ''; // Clear existing groups

    groups.forEach((group, index) => {
        const groupContainer = document.createElement('div'); // Create container for each group
        groupContainer.classList.add('group-container');
        groupContainer.dataset.groupName = group; // Store group name as dataset attribute

        const groupElement = document.createElement('div');
        groupElement.classList.add('group');
        groupElement.id = `group-${index}`;
        groupElement.innerHTML = `
            <div class="group-name">${group}</div>
        `;
        
        // Add click event listener to group container
        groupContainer.addEventListener('click', function() {
            // Save the clicked group to localStorage
            localStorage.setItem('selectedGroup', this.dataset.groupName);

            // Navigate to group page
            window.location.href = `/post`;
        });

        groupContainer.appendChild(groupElement);
        groupsContainer.appendChild(groupContainer);
    });
}

// Fetch user groups from the server
async function fetchUserGroups() {
    try {
        const response = await fetch(`/user-groups?username=${username}`);
        const data = await response.json();

        if (response.ok) {
            renderGroups(data.groups);
        } else {
            console.error('Error fetching groups:', data.error);
        }
    } catch (error) {
        console.error('Error fetching groups:', error);
    }
}

// Show/hide sidebar functions
function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';
}

function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
}

// Display first letter based on username
if (username) {
    let firstLetter = username.charAt(0);
    document.querySelector('.firstname').textContent = firstLetter;
    document.querySelector('.username').textContent = username;
    document.querySelector('.firstnameProfile').textContent = firstLetter;
}

// Navigation for new group and invitation
document.querySelector('.newGroup').addEventListener('click', function() {
    window.location.href = '/create';
});

document.querySelector('.invitation').addEventListener('click', function() {
    window.location.href = '/invitation';
});

let modalVisible = false; // Track modal visibility

document.querySelector('.addMemberToGroup').addEventListener('click', function() {
    if (!modalVisible) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <input type="text" id="groupNameInput" placeholder="Group Name">
                <input type="text" id="usernameInput" placeholder="Username">
                <button onclick="addMemberToGroup()">Confirm</button>
            </div>
        `;
        document.body.appendChild(modal);
        modalVisible = true;
    } else {
        closeModal();
        modalVisible = false;
    }
});

// Function to add member to a group
async function addMemberToGroup() {
    const groupName = document.getElementById('groupNameInput').value;
    const username = document.getElementById('usernameInput').value;

    try {
        const response = await fetch('/addNewMember', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamName: groupName,
                members: [username], // Assuming you're sending a single username
            })
        });

        if (response.ok) {
            // Optionally, you can handle success response here
            console.log('Team created successfully');
        } else {
            console.error('Error creating team:', response.statusText);
        }
    } catch (error) {
        console.error('Error creating team:', error.message);
    }

    // Close modal
    closeModal();
}

// Function to close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.parentNode.removeChild(modal);
    }
    modalVisible = false;
}

// Fetch and render groups on page load
fetchUserGroups();
