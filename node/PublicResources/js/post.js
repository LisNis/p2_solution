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

document.addEventListener('DOMContentLoaded', function() {
    // Fetch posts from the server
    fetch('/posts')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(posts => {
        // Render the fetched posts onto the page
        renderPosts(posts);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

function renderPosts(posts) {
    const postList = document.querySelector('.container');

    posts.forEach(post => {
        const postElement = createPostElement(post);
        postList.appendChild(postElement);
    });
}

function createPostElement(post) {
    // Create post element
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    // Create post header
    const postHeader = document.createElement('div');
    postHeader.classList.add('postheader');

    // Create user information
    const userInformation = document.createElement('div');
    userInformation.classList.add('user-information');

    // Username
    const usernameSpan = document.createElement('span');
    usernameSpan.id = 'username';
    usernameSpan.textContent = post.username; 
    userInformation.appendChild(usernameSpan);

    // Point
    const pointSpan = document.createElement('span');
    pointSpan.id = 'point';
    pointSpan.textContent = '•';
    userInformation.appendChild(pointSpan);

    // Date
    const dateSpan = document.createElement('span');
    dateSpan.id = 'date';
    dateSpan.textContent = post.date;
    userInformation.appendChild(dateSpan);

    // time
    const timeSpan = document.createElement('span');
    timeSpan.id = 'timestamp';
    timeSpan.textContent = post.timestamp;
    userInformation.appendChild(timeSpan);

    postHeader.appendChild(userInformation);

    // Create post content
    const postContent = document.createElement('div');
    postContent.classList.add('post-content');

    // Title
    const titleHeading = document.createElement('h3');
    titleHeading.id = 'title';
    titleHeading.textContent = post.title;
    postContent.appendChild(titleHeading);

    // Content
    const contentParagraph = document.createElement('p');
    contentParagraph.textContent = post.content; 
    postContent.appendChild(contentParagraph);

    // Thumbs up and Thumbs down buttons
    const thumbsUpButton = document.createElement('button');
    thumbsUpButton.innerHTML = '&#128077;'; // Thumbs up icon
    thumbsUpButton.classList.add('thumbs-up-btn');
    const thumbsDownButton = document.createElement('button');
    thumbsDownButton.innerHTML = '&#128078;'; // Thumbs down icon
    thumbsDownButton.classList.add('thumbs-down-btn');

    // Like and Dislike count
    const likeCount = document.createElement('span');
    likeCount.classList.add('post-rating-count');
    likeCount.textContent = post.likes; // You need to have this data from server response
    const dislikeCount = document.createElement('span');
    dislikeCount.classList.add('post-rating-count');
    dislikeCount.textContent = post.dislikes; // You need to have this data from server response

    // Add event listeners for thumbs up and thumbs down
    thumbsUpButton.addEventListener('click', async () => {
        if (!thumbsUpButton.classList.contains('clicked')) {
            // Update UI
            likeCount.textContent = Number(likeCount.textContent) + 1;
            thumbsUpButton.classList.add('clicked');
            thumbsDownButton.disabled = true;
            // Send like action to server and update database
            const response = await fetch(`/posts/${post.id}/like`, { method: 'POST' });
            // Handle server response if necessary
        }
    });

    thumbsDownButton.addEventListener('click', async () => {
        if (!thumbsDownButton.classList.contains('clicked')) {
            // Update UI
            dislikeCount.textContent = Number(dislikeCount.textContent) + 1;
            thumbsDownButton.classList.add('clicked');
            thumbsUpButton.disabled = true;
            // Send dislike action to server and update database
            const response = await fetch(`/posts/${post.id}/dislike`, { method: 'POST' });
            // Handle server response if necessary
        }
    });

    // Append elements to post content
    postContent.appendChild(thumbsUpButton);
    postContent.appendChild(likeCount);
    postContent.appendChild(thumbsDownButton);
    postContent.appendChild(dislikeCount);

    // Append post content to post element
    postElement.appendChild(postHeader);
    postElement.appendChild(postContent);

    // Create the comment button
    const commentButton = document.createElement("button");
    commentButton.textContent = "Comment";
    commentButton.className = "comment-button";
    commentButton.addEventListener('click', () => {
        const commentSection = postElement.querySelector(".comment-section");
        if (commentSection.style.display === "none") {
            commentSection.style.display = "block";
        } else {
            commentSection.style.display = "none";
        }
    });
    postElement.appendChild(commentButton);

    // Create the comment section
    const commentSection = document.createElement("div");
    commentSection.className = "comment-section";
    commentSection.style.display = "none";

    // Create the comment label
    const commentLabel = document.createElement("div");
    commentLabel.textContent = "Comments:";
    commentLabel.style.textDecoration = "underline";
    commentLabel.style.marginBottom = "5px";
    commentSection.appendChild(commentLabel);

    // Create the comment list container
    const commentList = document.createElement("div");
    commentList.className = "comment-list";
    commentSection.appendChild(commentList);

    // Create the comment input field
    const commentInput = document.createElement("textarea");
    commentInput.placeholder = "Write your comment here...";
    commentInput.className = "comment-field";
    commentSection.appendChild(commentInput);

    // Create the submit button
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.className = "submit-comment-button";
    submitButton.addEventListener('click', () => {
        let comment = commentInput.value;
        if (comment.trim() !== "") {
            let newComment = document.createElement("div");
            newComment.textContent = comment;
            newComment.className = "comment";
            commentList.appendChild(newComment);

            commentInput.value = "";
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
    const postContent = document.getElementById('textInput').value;

    const today = new Date();

    // Get the day, month, and year
    const day = today.getDate();
    const month = today.getMonth() + 1; // Month starts at 0
    const year = today.getFullYear();

    // Get the hours and minutes
    const hours = today.getHours();
    const minutes = today.getMinutes();

    // Format the date and time
    const currentDate = `${day}/${month}/${year}`;
    const currentTime = `${hours}:${minutes}`;


    const postData = {
        content: postContent,
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
