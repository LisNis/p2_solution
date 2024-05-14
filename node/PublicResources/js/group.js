const firstGroup = document.getElementById("first-group");

firstGroup.addEventListener("click", function() {
    // if user found in json 
    window.location.href = "/post";
});
function showSidebar(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';
 }
        
function hideSidebar(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
}
        
let username = localStorage.getItem("username");
    // Display username in the HTML
document.getElementById("username").textContent = username;

const newGroup = document.querySelector(".newGroup");
newGroup.addEventListener("click", function(){
    window.location.href="/create";
});

const invitation = document.querySelector(".invitation");
invitation.addEventListener("click", function(){
    window.location.href="/invitation";
});

const settingforgroup = document.querySelector('.group-options');
settingforgroup.addEventListener("click", function(){
    const addingnewmember = document.querySelector('.addMember');
    addingnewmember.style.display = 'flex'; 
    console.log ("Fuckk det");
}); 

document.querySelector('.addMember').addEventListener('click', function() {
    const searchBarContainer = document.querySelector('.search-bar-container');
    searchBarContainer.style.display = 'block'; // Show the search bar
});

document.querySelector('.addMember').addEventListener('click', function() {
    const addingnewmember = document.querySelector('.addMember');
    const computedStyle = window.getComputedStyle(addingnewmember); // Gettinf the computed style of add Member
    const displayStyle = computedStyle.getPropertyValue('display'); // Getting the value of the 'display' 

    if (displayStyle === 'block') {
        addingnewmember.style.display = 'none';
    } else {
        addingnewmember.style.display = 'block';
    }
}); 