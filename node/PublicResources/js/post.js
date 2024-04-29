// delte post, when written post create div, where like
// and pins option are. Tags, so need to know who is in
// the group. 


// posting site
const postButton = document.getElementById("post-btn");
const inputElement = document.getElementById("input-post");
const displayElement = document.getElementById("displayText");


// bot send messages
const chatInput = document.querySelector('.chat-input textarea');
const sendTextBtn = document.querySelector('.chat-input button');
const chatBox = document.querySelector('.chatbox');

// bot open and close chat
const botToggler = document.querySelector('.bot-toggler');
const botCloseBtn = document.querySelector('.close-btn');

// bot countdown
const daysHtml = document.querySelector('.days');
const hoursHtml = document.querySelector('.hours');
const minutesHtml = document.querySelector('.minutes');
const secondsHtml = document.querySelector('.seconds');


//posting site
function postText() {
    let text = document.getElementById("textInput").value;
    if (text.trim() !== "") {
        let postArea = document.getElementById("postArea");
        let post = document.createElement("div");
        post.className = "post";
        post.textContent = text;
        postArea.appendChild(post);
        document.getElementById("textInput").value = "";
    }
}


//sidebar
function showSidebar(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';
}
function hideSidebar(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
}


//bot send messages
let userMessage;

const createTextLi = (message, className) => {
    const textLi = document.createElement('li');
    textLi.classList.add('chat', className);
    let chatContent = className === 'outgoing' ? `<p>${message}</p>` : `<span class="material-smbols">:0</span><p>${message}</p>`;
    textLi.innerHTML = chatContent;
    return textLi;
}


// not working only giving error
const generateResponse = (incomingTextLi) => {
    const messageElement = incomingTextLi.querySelector('p');

    // check if its right formal if not, error message, css red font and chatbox
    userMessage = chatInput.value;
    console.log(userMessage);

    // bot Countdown
    const newTime = new Date(userMessage);

    if (isNaN(newTime)) {
        messageElement.textContent = "Invalid date format. Please enter a valid date.";
        return;
    }

    function updateCountdown() {
        const currentTime = new Date();
        const diff = newTime - currentTime;

        if (diff <= 0) {
            messageElement.textContent = "Countdown has ended!";
            clearInterval(intervalId);
            return;
        }

        const days = Math.floor(diff / 1000 / 60 / 60 / 24);
        const hours =  Math.floor(diff / 1000 / 60 / 60) % 24;
        const minutes = Math.floor(diff / 1000 / 60) % 60;
        const seconds = Math.floor(diff / 1000) % 60;

        let result = days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds ";

        messageElement.textContent = result;


        // stop the timer when 0, stop timer when writing another one, 
        // delete text in chatbox, after sending
    }

    setInterval(updateCountdown, 1000);
}


const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;

    // append user message to chatbox
    chatBox.appendChild(createTextLi(userMessage, 'outgoing'));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    chatInput.value = '';

    setTimeout(() => {
        const incomingTextLi = createTextLi("Writing...", 'incoming');
        chatBox.appendChild(incomingTextLi);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generateResponse(incomingTextLi);
    })
}

sendTextBtn.addEventListener('click', handleChat);


//bot open and close chat
botToggler.addEventListener('click', function() {
    document.body.classList.toggle('show-bot');
});

botCloseBtn.addEventListener('click', function() {
    document.body.classList.remove('show-bot');
});