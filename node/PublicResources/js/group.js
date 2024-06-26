const groupsContainer = document.querySelector('.groups');

// Get username
const username = localStorage.getItem('username');

function renderGroups(groups) {
    // Clear existing groups
    groupsContainer.innerHTML = '';

    groups.forEach((group, index) => {
        // Create container for each group
        const groupContainer = document.createElement('div'); 
        groupContainer.classList.add('group-container');
        // Store group name as dataset attribute
        groupContainer.dataset.groupName = group; 

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

// Track modal visibility
let modalVisible = false;

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
                members: [username], 
            })
        });

        if (response.ok) {
            console.log('Member added successfully');
        } else {
            console.error('Error adding member:', response.statusText);
        }
    } catch (error) {
        console.error('Error adding member:', error.message);
    }

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
