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

document.addEventListener('DOMContentLoaded', function() {
    fetch('/posts')
    .then(response => response.json())
    .then(posts => renderPosts(posts))
    .catch(error => console.error('There was a problem with the fetch operation:', error));
});

function renderPosts(posts) {
    const postList = document.querySelector('.container');
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postList.appendChild(postElement);
    });
}

function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    if (post.isPinned) {
        postElement.classList.add('pinned');
    }

    const postHeader = document.createElement('div');
    postHeader.classList.add('postheader');

    const userInformation = document.createElement('div');
    userInformation.classList.add('user-information');

    const usernameSpan = document.createElement('span');
    usernameSpan.textContent = post.username;
    userInformation.appendChild(usernameSpan);

    const pointSpan = document.createElement('span');
    pointSpan.textContent = '•';
    userInformation.appendChild(pointSpan);

    const dateSpan = document.createElement('span');
    dateSpan.textContent = post.date;
    userInformation.appendChild(dateSpan);

    const timeSpan = document.createElement('span');
    timeSpan.textContent = post.timestamp;
    userInformation.appendChild(timeSpan);

    postHeader.appendChild(userInformation);

    const postContent = document.createElement('div');
    postContent.classList.add('post-content');

    const titleHeading = document.createElement('h3');
    titleHeading.textContent = post.title;
    postContent.appendChild(titleHeading);

    const contentParagraph = document.createElement('p');
    contentParagraph.textContent = post.content;
    postContent.appendChild(contentParagraph);

    // Pin button
    const pinButton = document.createElement('button');
    pinButton.textContent = 'Pin';
    pinButton.className = 'pin-button';
    if (post.isPinned) {
        pinButton.disabled = true;
    }
    postContent.appendChild(pinButton);

    pinButton.addEventListener('click', async () => {
        const response = await fetch(`/posts/${post.id}/pin`, { method: 'POST' });
        if (response.ok) {
            postElement.classList.add('pinned');
            const container = document.querySelector('.container');
            container.prepend(postElement);
            pinButton.disabled = true;
        }
    });

    // Existing thumbs up and thumbs down buttons
    const thumbsUpButton = document.createElement('button');
    thumbsUpButton.innerHTML = '&#128077;';
    thumbsUpButton.classList.add('thumbs-up-btn');
    const thumbsDownButton = document.createElement('button');
    thumbsDownButton.innerHTML = '&#128078;';
    thumbsDownButton.classList.add('thumbs-down-btn');

    thumbsUpButton.addEventListener('click', async () => {
        const response = await fetch(`/posts/${post.id}/like`, { method: 'POST' });
        if(response.ok) {
            response.json().then(data => {
                thumbsUpButton.nextElementSibling.textContent = data.likes;
            });
            thumbsUpButton.disabled = true;
            thumbsDownButton.disabled = true;
        }
    });

    thumbsDownButton.addEventListener('click', async () => {
        const response = await fetch(`/posts/${post.id}/dislike`, { method: 'POST' });
        if(response.ok) {
            response.json().then(data => {
                thumbsDownButton.nextElementSibling.textContent = data.dislikes;
            });
            thumbsDownButton.disabled = true;
            thumbsUpButton.disabled = true;
        }
    });

    postContent.appendChild(thumbsUpButton);
    postContent.appendChild(thumbsDownButton);

    postElement.appendChild(postHeader);
    postElement.appendChild(postContent);

    const commentButton = document.createElement("button");
    commentButton.textContent = "Comment";
    commentButton.className = "comment-button";
    postElement.appendChild(commentButton);

    const commentSection = document.createElement("div");
    commentSection.className = "comment-section";
    commentSection.style.display = "none";
    commentButton.onclick = () => commentSection.style.display = commentSection.style.display === "none" ? "block" : "none";

    const commentLabel = document.createElement("div");
    commentLabel.textContent = "Comments:";
    commentLabel.style.textDecoration = "underline";
    commentSection.appendChild(commentLabel);

    const commentList = document.createElement("div");
    commentList.className = "comment-list";
    commentSection.appendChild(commentList);

    const commentInput = document.createElement("textarea");
    commentInput.placeholder = "Write your comment here...";
    commentInput.className = "comment-field";
    commentSection.appendChild(commentInput);

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.className = "submit-comment-button";
    commentSection.appendChild(submitButton);
    submitButton.addEventListener('click', async () => {
        let comment = commentInput.value.trim();
        if (comment !== "") {
            const commentData = {
                postId: post.id,
                comment: comment,
                username: localStorage.getItem("username") // Ensure username is available in localStorage
            };

            const response = await fetch('/posts/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });

            if (response.ok) {
                let newComment = document.createElement("div");
                newComment.textContent = comment;
                newComment.className = "comment";
                commentList.appendChild(newComment);
                commentInput.value = "";
            } else {
                console.error('Failed to submit comment:', await response.text());
            }
        }
    });
    commentSection.appendChild(submitButton);
    postElement.appendChild(commentSection);

    return postElement;
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

let username = localStorage.getItem("username");
// Display username in the HTML
document.getElementById("username").textContent = username;
const postUsername = username;



document.getElementById('submitPost').addEventListener('click', function() {
    let postContent = document.getElementById('textInput').value;

    // get input in {}
    const regex = /{([^}]*)}/;
    const match = postContent.match(regex);
    let contentOfPost = postContent; // Assign default value
    let postTitle = '';
    
    if (match !== null) {
        contentOfPost = postContent.replace(match[0], '').trim();
        postTitle = match[1].trim();
    }
    

    // Get the day, month, and year
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Month starts at 0
    const year = today.getFullYear();

    // Get the hours and minutes
    const hours = today.getHours();
    let minutes = today.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    // Format the date and time
    const currentDate = `${day}/${month}/${year}`;
    const currentTime = `${hours}:${minutes}`;


    const postData = {
        title: postTitle,
        content: contentOfPost,
        username: postUsername,
        date: currentDate,
        timestamp: currentTime, 
    };
    console.log(postUsername);

    // Send the post data to the server
    fetch('/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        console.log(data); // Log the server response
        alert('Post submitted successfully');
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('There was an error submitting the post');
    });
    postContent = '';
});

document.querySelectorAll(".post").forEach(post => {
    const postId = post.dataset.postId;
    const ratings = post.querySelectorAll(".post-rating");
    const likeRating = ratings[0];

    ratings.forEach(rating => {
        const button = rating.querySelector(".post-rating-button");
        const count = rating.querySelector(".post-rating-count");

        button.addEventListener("click", async () => {
            if (rating.classList.contains("post-rating-selected")) {
                return;
            }

            count.textContent = Number(count.textContent) + 1;

            ratings.forEach(rating => {
                if (rating.classList.contains("post-rating-selected")) {
                    const count = rating.querySelector(".post-rating-count");

                    count.textContent = Math.max(0, Number(count.textContent) - 1);
                    rating.classList.remove("post-rating-selected");
                }
            });

            rating.classList.add("post-rating-selected");

            const likeOrDislike = likeRating === rating ? "like" : "dislike";
            const response = await fetch(`/posts/${postId}/${likeOrDislike}`);
            const body = await response.json();
        });
    });
});


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
            alert("The countdown has ended, it's time for a break!");
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

    //chatInput.value = '';

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
