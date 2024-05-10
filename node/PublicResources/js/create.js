document.addEventListener("DOMContentLoaded", function() {
  const teamMemberForm = document.getElementById("team-member-form");
  const teamMembersList = document.getElementById("team-members-list");
  const confirmButton = document.getElementById("confirm-team");

  let members = [];

  teamMemberForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const memberName = document.getElementById("member-name-input").value;
      members.push(memberName);
      displayTeamMembers();
      teamMemberForm.reset();
  });

  function displayTeamMembers() {
      teamMembersList.innerHTML = ""; // Clear previous list

      members.forEach(function(member, index) {
          const memberElement = document.createElement("div");
          memberElement.textContent = member;

          const removeButton = document.createElement("button");
          removeButton.textContent = "Remove";
          removeButton.classList.add("remove-btn");
          removeButton.dataset.index = index;

          memberElement.appendChild(removeButton);
          teamMembersList.appendChild(memberElement);
      });

      // Show confirm button after displaying team members
      confirmButton.style.display = "block";
  }

  // Event delegation for remove buttons
  teamMembersList.addEventListener("click", function(event) {
      if (event.target.classList.contains("remove-btn")) {
          const index = parseInt(event.target.dataset.index);
          members.splice(index, 1);
          displayTeamMembers();
      }
  });

  // Event listener for confirm button (just for demonstration)
  confirmButton.addEventListener("click", function() {
      // Handle confirming team creation here
      alert("Team creation confirmed!");
  });
});
