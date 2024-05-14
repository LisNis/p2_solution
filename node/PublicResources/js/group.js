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

const addingnewmember = document.querySelector(".addMember");
addingnewmember.addEventListener("click", function(){
    const settingforgroup = document.querySelector('.group-options');
    settingforgroup.style.display = 'flex'; 
    console.log ("Fuckk det");
});