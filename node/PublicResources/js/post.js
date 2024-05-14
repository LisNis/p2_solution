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
    // Create the post element
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    // Create the post header
    const postHeader = document.createElement('div');
    postHeader.classList.add('postheader');

    // Create user information
    const userInformation = document.createElement('div');
    userInformation.classList.add('user-information');

    // Username
    const usernameSpan = document.createElement('span');
    usernameSpan.textContent = post.username;
    userInformation.appendChild(usernameSpan);

    // Point
    const pointSpan = document.createElement('span');
    pointSpan.textContent = '•';
    userInformation.appendChild(pointSpan);

    // Date
    const dateSpan = document.createElement('span');
    dateSpan.textContent = post.date;
    userInformation.appendChild(dateSpan);

    // Append user info to post header
    postHeader.appendChild(userInformation);

    // Create post content
    const postContent = document.createElement('div');
    postContent.classList.add('post-content');

    // Title
    const titleHeading = document.createElement('h3');
    titleHeading.textContent = post.title;
    postContent.appendChild(titleHeading);

    // Content
    const contentParagraph = document.createElement('p');
    contentParagraph.textContent = post.content;
    postContent.appendChild(contentParagraph);

    // Thumbs up and down buttons
    const thumbsUpButton = document.createElement('button');
    thumbsUpButton.innerHTML = '&#128077;';
    thumbsUpButton.classList.add('thumbs-up-btn');

    const thumbsDownButton = document.createElement('button');
    thumbsDownButton.innerHTML = '&#128078;';
    thumbsDownButton.classList.add('thumbs-down-btn');

    const likeCount = document.createElement('span');
    likeCount.classList.add('post-rating-count');
    likeCount.textContent = post.likes;

    const dislikeCount = document.createElement('span');
    dislikeCount.classList.add('post-rating-count');
    dislikeCount.textContent = post.dislikes;

    // Event listeners for thumbs up and down
    thumbsUpButton.addEventListener('click', async () => {
        if (!thumbsUpButton.classList.contains('clicked')) {
            likeCount.textContent = Number(likeCount.textContent) + 1;
            thumbsUpButton.classList.add('clicked');
            thumbsDownButton.disabled = true;
            const response = await fetch(`/posts/${post.id}/like`, { method: 'POST' });
        }
    });

    thumbsDownButton.addEventListener('click', async () => {
        if (!thumbsDownButton.classList.contains('clicked')) {
            dislikeCount.textContent = Number(dislikeCount.textContent) + 1;
            thumbsDownButton.classList.add('clicked');
            thumbsUpButton.disabled = true;
            const response = await fetch(`/posts/${post.id}/dislike`, { method: 'POST' });
        }
    });

    // Append all elements to post content
    postContent.appendChild(thumbsUpButton);
    postContent.appendChild(likeCount);
    postContent.appendChild(thumbsDownButton);
    postContent.appendChild(dislikeCount);

    // Append content and header to the main post element
    postElement.appendChild(postHeader);
    postElement.appendChild(postContent);

    // Comments functionality
    const commentButton = document.createElement("button");
    commentButton.textContent = "Comment";
    commentButton.className = "comment-button";
    commentButton.addEventListener('click', () => {
        const commentSection = postElement.querySelector(".comment-section");
        commentSection.style.display = commentSection.style.display === "none" ? "block" : "none";
    });
    postElement.appendChild(commentButton);

    const commentSection = document.createElement("div");
    commentSection.className = "comment-section";
    commentSection.style.display = "none";

    const commentLabel = document.createElement("div");
    commentLabel.textContent = "Comments:";
    commentLabel.style.textDecoration = "underline";
    commentLabel.style.marginBottom = "5px";
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
    submitButton.addEventListener('click', async () => {
        let comment = commentInput.value;
        if (comment.trim() !== "") {
            let newComment = document.createElement("div");
            newComment.textContent = comment;
            newComment.className = "comment";
            commentList.appendChild(newComment);
            commentInput.value = "";
            const commentData = {
                postId: post.id,
                comment: comment,
                username: localStorage.getItem("username")
            };
            const response = await fetch('/posts/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });
            if (!response.ok) {
                console.error('Failed to submit comment:', await response.text());
            }
        }
    });
    commentSection.appendChild(submitButton);
    postElement.appendChild(commentSection);

    // Pin status and button
    const pinnedStatus = document.createElement('span');
    pinnedStatus.textContent = "PINNED";
    pinnedStatus.className = "pinned-status";
    pinnedStatus.style.display = "none"; // Hidden by default
    postHeader.appendChild(pinnedStatus); // Append to postHeader
    

    const pinButton = document.createElement("button");
    pinButton.textContent = "Pin";
    pinButton.className = "pin-button";
    pinButton.addEventListener('click', () => pinPost(postElement));
    postHeader.appendChild(pinButton);  // Tilføj knappen til headeren
    return postElement;
}

function pinPost(postElement) {
    const postList = document.querySelector('.container');
    const currentlyPinned = postList.querySelector('.pinned-post'); // Find already pinned post

    // If there's a post already pinned, unpin it
    if (currentlyPinned) {
        currentlyPinned.classList.remove('pinned-post');
        const statusLabel = currentlyPinned.querySelector('.pinned-status');
        if (statusLabel) {
            statusLabel.style.display = 'none';
        }
    }

    // Move the new post to the top and mark it as pinned
    postList.prepend(postElement);
    postElement.classList.add('pinned-post');
    const pinnedLabel = postElement.querySelector('.pinned-status');
    if (pinnedLabel) {
        pinnedLabel.style.display = 'block'; // Make the PINNED text visible
    }
}

document.getElementById('submitPost').addEventListener('click', function() {
    const postContent = document.getElementById('textInput').value;
    const postData = {
        content: postContent,
        // username: 
    };

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
        console.log(data); 
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
