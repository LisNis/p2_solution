// Bot send messages
const chatInput = document.querySelector('.chat-input textarea'); // Selects the textarea element within the element that has the class 'chat-input'
const sendTextBtn = document.querySelector('.chat-input button'); // Selects the button element within the element that has the class 'chat-input'
const chatBox = document.querySelector('.chatbox'); // Selects the element with the class 'chatbox'

// Bot open and close chat
const botToggler = document.querySelector('.bot-toggler'); // Selects the element with the class 'bot-toggler'
const botCloseBtn = document.querySelector('.close-btn'); // Selects the element with the class 'close-btn'

// Add an event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    fetch('/posts') // Fetches the posts from the server
    .then(response => response.json()) // Parses the JSON response
    .then(posts => renderPosts(posts)) // Calls the renderPosts function with the fetched posts
    .catch(error => console.error('There was a problem with the fetch operation:', error)); // Logs any errors that occur during the fetch operation
});

// Function to render posts
function renderPosts(posts) {
    const postList = document.querySelector('.container'); // Selects the element with the class 'container'
    postList.innerHTML = ''; // Clears the existing posts

    const pinnedPosts = posts.filter(post => post.pinned); // Filters the pinned posts
    pinnedPosts.forEach(post => {
        const postElement = createPostElement(post); // Creates a post element for each pinned post
        postList.prepend(postElement); // Adds the post element to the beginning of the post list
    });

    const otherPosts = posts.filter(post => !post.pinned); // Filters the non-pinned posts
    otherPosts.forEach(post => {
        const postElement = createPostElement(post); // Creates a post element for each non-pinned post
        postList.appendChild(postElement); // Adds the post element to the end of the post list
    });
}

// Function to create a post element
function createPostElement(post) {
    const postElement = document.createElement('div'); // Creates a div element for the post
    postElement.classList.add('post'); // Adds the 'post' class to the div
    postElement.dataset.index = post.index; // Sets the data-index attribute to the post index
    postElement.dataset.id = post.id; // Sets the data-id attribute to the post ID
    if (post.pinned) {
        postElement.classList.add('pinned-post'); // Adds the 'pinned-post' class if the post is pinned
    }

    const postHeader = document.createElement('div'); // Creates a div element for the post header
    postHeader.classList.add('postheader'); // Adds the 'postheader' class to the div

    const userInformation = document.createElement('div'); // Creates a div element for the user information
    userInformation.classList.add('user-information'); // Adds the 'user-information' class to the div

    // Create and append the username element
    const usernameSpan = document.createElement('span'); // Creates a span element for the username
    usernameSpan.id = 'username'; // Sets the ID to 'username'
    usernameSpan.textContent = post.username || 'Unknown'; // Sets the text content to the post username or 'Unknown'
    userInformation.appendChild(usernameSpan); // Appends the span to the user information div

    // Create and append the point element
    const pointSpan = document.createElement('span'); // Creates a span element for the point
    pointSpan.id = 'point'; // Sets the ID to 'point'
    pointSpan.textContent = '•'; // Sets the text content to a bullet point
    userInformation.appendChild(pointSpan); // Appends the span to the user information div

    // Create and append the date element
    const dateSpan = document.createElement('span'); // Creates a span element for the date
    dateSpan.id = 'date'; // Sets the ID to 'date'
    dateSpan.textContent = post.date || 'Unknown date'; // Sets the text content to the post date or 'Unknown date'
    userInformation.appendChild(dateSpan); // Appends the span to the user information div

    // Create and append the timestamp element
    const timeSpan = document.createElement('span'); // Creates a span element for the timestamp
    timeSpan.id = 'timestamp'; // Sets the ID to 'timestamp'
    timeSpan.textContent = post.timestamp || 'Unknown time'; // Sets the text content to the post timestamp or 'Unknown time'
    userInformation.appendChild(timeSpan); // Appends the span to the user information div

    postHeader.appendChild(userInformation); // Appends the user information div to the post header div
    const postContent = document.createElement('div'); // Creates a div element for the post content
    postContent.classList.add('post-content'); // Adds the 'post-content' class to the div

    // Create and append the title element
    const titleHeading = document.createElement('h3'); // Creates an h3 element for the post title
    titleHeading.id = 'title'; // Sets the ID to 'title'
    titleHeading.textContent = post.title || 'No title'; // Sets the text content to the post title or 'No title'
    postContent.appendChild(titleHeading); // Appends the h3 element to the post content div

    // Create and append the content element
    const contentParagraph = document.createElement('p'); // Creates a p element for the post content
    contentParagraph.textContent = post.content || 'No content'; // Sets the text content to the post content or 'No content'
    postContent.appendChild(contentParagraph); // Appends the p element to the post content div

    // Create and append the tags element
    const tagsDiv = document.createElement('div'); // Creates a div element for the tags
    tagsDiv.classList.add('tags-container'); // Adds the 'tags-container' class to the div
    tagsDiv.textContent = (post.tags || []).join(' '); // Sets the text content to the post tags joined by spaces
    postContent.appendChild(tagsDiv); // Appends the tags div to the post content div

    // Create and append the thumbs up button
    const thumbsUpButton = document.createElement('button'); // Creates a button element for thumbs up
    thumbsUpButton.innerHTML = '&#128077;'; // Sets the inner HTML to a thumbs up emoji
    thumbsUpButton.classList.add('thumbs-up-btn'); // Adds the 'thumbs-up-btn' class to the button

    // Create and append the thumbs down button
    const thumbsDownButton = document.createElement('button'); // Creates a button element for thumbs down
    thumbsDownButton.innerHTML = '&#128078;'; // Sets the inner HTML to a thumbs down emoji
    thumbsDownButton.classList.add('thumbs-down-btn'); // Adds the 'thumbs-down-btn' class to the button

    // Create and append the like count element
    const likeCount = document.createElement('span'); // Creates a span element for the like count
    likeCount.classList.add('post-rating-count'); // Adds the 'post-rating-count' class to the span
    likeCount.textContent = post.likes || 0; // Sets the text content to the post likes or 0

    // Create and append the dislike count element
    const dislikeCount = document.createElement('span'); // Creates a span element for the dislike count
    dislikeCount.classList.add('post-rating-count'); // Adds the 'post-rating-count' class to the span
    dislikeCount.textContent = post.dislikes || 0; // Sets the text content to the post dislikes or 0

    // Disable buttons if already liked/disliked
    const username = localStorage.getItem("username"); // Gets the 'username' item from local storage
    const userLikes = JSON.parse(localStorage.getItem('userLikes')) || {}; // Parses the 'userLikes' item from local storage or initializes an empty object
    const userDislikes = JSON.parse(localStorage.getItem('userDislikes')) || {}; // Parses the 'userDislikes' item from local storage or initializes an empty object

    if (userLikes[post.id]) {
        thumbsUpButton.classList.add('clicked'); // Adds the 'clicked' class to the thumbs up button if the post is liked
        thumbsDownButton.disabled = true; // Disables the thumbs down button if the post is liked
    }
    if (userDislikes[post.id]) {
        thumbsDownButton.classList.add('clicked'); // Adds the 'clicked' class to the thumbs down button if the post is disliked
        thumbsUpButton.disabled = true; // Disables the thumbs up button if the post is disliked
    }

    // Add event listener for thumbs up button click
    thumbsUpButton.addEventListener('click', async () => {
        if (thumbsUpButton.classList.contains('clicked')) {
            likeCount.textContent = Number(likeCount.textContent) - 1; // Decrements the like count
            thumbsUpButton.classList.remove('clicked'); // Removes the 'clicked' class from the thumbs up button
            thumbsDownButton.disabled = false; // Enables the thumbs down button
            delete userLikes[post.id]; // Deletes the post ID from the userLikes object
            localStorage.setItem('userLikes', JSON.stringify(userLikes)); // Updates the userLikes item in local storage
            await fetch(`/posts/${post.id}/unlike`, {
                method: 'POST', // Sets the request method to POST
                headers: {
                    'Content-Type': 'application/json' // Sets the content type to JSON
                },
                body: JSON.stringify({ username }) // Converts the username to a JSON string
            });
        } else {
            likeCount.textContent = Number(likeCount.textContent) + 1; // Increments the like count
            thumbsUpButton.classList.add('clicked'); // Adds the 'clicked' class to the thumbs up button
            thumbsDownButton.disabled = true; // Disables the thumbs down button
            userLikes[post.id] = true; // Adds the post ID to the userLikes object
            localStorage.setItem('userLikes', JSON.stringify(userLikes)); // Updates the userLikes item in local storage
            await fetch(`/posts/${post.id}/like`, {
                method: 'POST', // Sets the request method to POST
                headers: {
                    'Content-Type': 'application/json' // Sets the content type to JSON
                },
                body: JSON.stringify({ username }) // Converts the username to a JSON string
            });
        }
    });

    // Add event listener for thumbs down button click
    thumbsDownButton.addEventListener('click', async () => {
        if (thumbsDownButton.classList.contains('clicked')) {
            dislikeCount.textContent = Number(dislikeCount.textContent) - 1; // Decrements the dislike count
            thumbsDownButton.classList.remove('clicked'); // Removes the 'clicked' class from the thumbs down button
            thumbsUpButton.disabled = false; // Enables the thumbs up button
            delete userDislikes[post.id]; // Deletes the post ID from the userDislikes object
            localStorage.setItem('userDislikes', JSON.stringify(userDislikes)); // Updates the userDislikes item in local storage
            await fetch(`/posts/${post.id}/undislike`, {
                method: 'POST', // Sets the request method to POST
                headers: {
                    'Content-Type': 'application/json' // Sets the content type to JSON
                },
                body: JSON.stringify({ username }) // Converts the username to a JSON string
            });
        } else {
            dislikeCount.textContent = Number(dislikeCount.textContent) + 1; // Increments the dislike count
            thumbsDownButton.classList.add('clicked'); // Adds the 'clicked' class to the thumbs down button
            thumbsUpButton.disabled = true; // Disables the thumbs up button
            userDislikes[post.id] = true; // Adds the post ID to the userDislikes object
            localStorage.setItem('userDislikes', JSON.stringify(userDislikes)); // Updates the userDislikes item in local storage
            await fetch(`/posts/${post.id}/dislike`, {
                method: 'POST', // Sets the request method to POST
                headers: {
                    'Content-Type': 'application/json' // Sets the content type to JSON
                },
                body: JSON.stringify({ username }) // Converts the username to a JSON string
            });
        }
    });

    postContent.appendChild(thumbsUpButton); // Appends the thumbs up button to the post content div
    postContent.appendChild(likeCount); // Appends the like count span to the post content div
    postContent.appendChild(thumbsDownButton); // Appends the thumbs down button to the post content div
    postContent.appendChild(dislikeCount); // Appends the dislike count span to the post content div

    postElement.appendChild(postHeader); // Appends the post header div to the post div
    postElement.appendChild(postContent); // Appends the post content div to the post div

    // Create and append the comment button
    const commentButton = document.createElement("button"); // Creates a button element for comments
    commentButton.textContent = "Comment"; // Sets the text content of the button to 'Comment'
    commentButton.className = "comment-button"; // Sets the class name to 'comment-button'
    commentButton.addEventListener('click', () => {
        const commentSection = postElement.querySelector(".comment-section"); // Selects the comment section within the post element
        commentSection.style.display = commentSection.style.display === "none" ? "block" : "none"; // Toggles the display style of the comment section
    });
    postElement.appendChild(commentButton); // Appends the comment button to the post div

    // Create and append the comment section
    const commentSection = document.createElement("div"); // Creates a div element for the comment section
    commentSection.className = "comment-section"; // Sets the class name to 'comment-section'
    commentSection.style.display = "none"; // Sets the display style to 'none'

    // Create and append the comment label
    const commentLabel = document.createElement("div"); // Creates a div element for the comment label
    commentLabel.textContent = "Comments:"; // Sets the text content to 'Comments:'
    commentLabel.style.textDecoration = "underline"; // Sets the text decoration to 'underline'
    commentLabel.style.marginBottom = "5px"; // Sets the margin bottom to '5px'
    commentSection.appendChild(commentLabel); // Appends the comment label to the comment section div

    // Create and append the comment list
    const commentList = document.createElement("div"); // Creates a div element for the comment list
    commentList.className = "comment-list"; // Sets the class name to 'comment-list'
    commentSection.appendChild(commentList); // Appends the comment list to the comment section div

    // Add existing comments to the comment list
    (post.comments || []).forEach(comment => {
        let commentElement = document.createElement("div"); // Creates a div element for each comment
        const user = comment.username || 'Unknown'; // Gets the username from the comment or sets it to 'Unknown'
        const content = comment.content || 'No content'; // Gets the content from the comment or sets it to 'No content'
        commentElement.textContent = `${user}: ${content}`; // Sets the text content to 'username: content'
        commentElement.className = "comment"; // Sets the class name to 'comment'
        commentList.appendChild(commentElement); // Appends the comment div to the comment list div
    });

    // Create and append the comment input field
    const commentInput = document.createElement("textarea"); // Creates a textarea element for the comment input
    commentInput.placeholder = "Write your comment here..."; // Sets the placeholder text for the textarea
    commentInput.className = "comment-field"; // Sets the class name to 'comment-field'
    commentSection.appendChild(commentInput); // Appends the textarea to the comment section div

    // Create and append the submit comment button
    const submitButton = document.createElement("button"); // Creates a button element for submitting comments
    submitButton.textContent = "Submit"; // Sets the text content of the button to 'Submit'
    submitButton.className = "submit-comment-button"; // Sets the class name to 'submit-comment-button'
    submitButton.addEventListener('click', async () => {
        let comment = commentInput.value; // Gets the value of the comment input
        if (comment.trim() !== "") {
            const username = localStorage.getItem("username") || 'Unknown'; // Gets the username from local storage or sets it to 'Unknown'
            let newComment = document.createElement("div"); // Creates a div element for the new comment
            newComment.textContent = `${username}: ${comment}`; // Sets the text content to 'username: comment'
            newComment.className = "comment"; // Sets the class name to 'comment'
            commentList.appendChild(newComment); // Appends the new comment div to the comment list div
            commentInput.value = ""; // Clears the comment input field
            const commentData = {
                postId: post.id,
                content: comment,
                username: username
            }; // Creates an object to store the comment data
            const response = await fetch(`/posts/${post.id}/comment`, {
                method: 'POST', // Sets the request method to POST
                headers: {
                    'Content-Type': 'application/json' // Sets the content type to JSON
                },
                body: JSON.stringify(commentData) // Converts the comment data to a JSON string
            });
            if (!response.ok) {
                console.error('Failed to submit comment:', await response.text()); // Logs an error message if the response is not OK
            }
        }
    });
    commentSection.appendChild(submitButton); // Appends the submit comment button to the comment section div
    postElement.appendChild(commentSection); // Appends the comment section div to the post div

    // Create and append the delete post button
    const deleteButton = document.createElement('button'); // Creates a button element for deleting the post
    deleteButton.textContent = 'Delete'; // Sets the text content of the button to 'Delete'
    deleteButton.id = 'delete-button'; // Sets the ID to 'delete-button'
    deleteButton.addEventListener('click', () => {
        showDeleteModal(post); // Calls the function to show the delete modal
    });
    postHeader.appendChild(deleteButton); // Appends the delete button to the post header div

    // Create and append the pinned status element
    const pinnedStatus = document.createElement('span'); // Creates a span element for the pinned status
    pinnedStatus.textContent = "PINNED"; // Sets the text content to 'PINNED'
    pinnedStatus.className = "pinned-status"; // Sets the class name to 'pinned-status'
    pinnedStatus.style.display = post.pinned ? "block" : "none"; // Sets the display style to 'block' if the post is pinned, otherwise 'none'
    postHeader.appendChild(pinnedStatus); // Appends the pinned status span to the post header div

    // Create and append the pin button
    const pinButton = document.createElement("button"); // Creates a button element for pinning/unpinning the post
    pinButton.textContent = post.pinned ? "Unpin" : "Pin"; // Sets the text content to 'Unpin' if the post is pinned, otherwise 'Pin'
    pinButton.className = "pin-button"; // Sets the class name to 'pin-button'
    if (post.pinned) {
        pinButton.classList.add('pinned'); // Adds the 'pinned' class if the post is pinned
    }
    pinButton.addEventListener('click', async () => {
        const action = post.pinned ? 'unpin' : 'pin'; // Determines the action based on the pinned status
        const response = await fetch(`/posts/${post.id}/${action}`, { method: 'POST' }); // Sends a POST request to pin/unpin the post
        if (response.ok) {
            if (action === 'pin') {
                pinPost(postElement); // Calls the function to pin the post
            } else {
                unpinPost(postElement); // Calls the function to unpin the post
            }
            post.pinned = !post.pinned; // Toggles the pinned state
            pinButton.textContent = post.pinned ? "Unpin" : "Pin"; // Updates the button text
            pinButton.classList.toggle('pinned'); // Toggles the 'pinned' class
        } else {
            console.error(`Failed to ${action} post:`, await response.text()); // Logs an error message if the response is not OK
        }
    });
    postHeader.appendChild(pinButton); // Appends the pin button to the post header div

    return postElement; // Returns the created post element
}

// Function to show the delete modal
function showDeleteModal(postToDelete) {
    const deleteBackdrop = document.getElementById('delete-backdrop'); // Selects the delete backdrop element by ID
    deleteBackdrop.style.display = 'flex'; // Sets the display style to 'flex'

    const deleteModal = document.querySelector('.delete-modal'); // Selects the delete modal element by class
    deleteModal.style.display = 'block'; // Sets the display style to 'block'
    const disagreeButton = document.querySelector('.disagree-button'); // Selects the disagree button by class
    const agreeButton = document.querySelector('.agree-button'); // Selects the agree button by class

    disagreeButton.onclick = function() {
        deleteModal.style.display = 'none'; // Hides the delete modal
        deleteBackdrop.style.display = 'none'; // Hides the delete backdrop
    };

    agreeButton.onclick = function() {
        deleteModal.style.display = 'none'; // Hides the delete modal
        deleteBackdrop.style.display = 'none'; // Hides the delete backdrop
        deletePost(postToDelete); // Calls the function to delete the post
    };
}

// Function to delete a post
function deletePost(postToDelete) {
    fetch(`/posts/${encodeURIComponent(postToDelete.id)}`, {
        method: 'DELETE', // Sets the request method to DELETE
        headers: {
            'Content-Type': 'application/json' // Sets the content type to JSON
        },
        body: JSON.stringify(postToDelete) // Converts the post data to a JSON string
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) }); // Throws an error if the response is not OK
            }
            return response.text(); // Returns the response text
        })
        .then(data => {
            console.log(data); // Logs the server response
            alert('Post deleted successfully'); // Shows an alert message
            fetch('/posts') // Fetches the updated posts from the server
                .then(response => response.json())
                .then(posts => renderPosts(posts)) // Calls the renderPosts function with the fetched posts
                .catch(error => console.error('There was a problem with the fetch operation:', error)); // Logs any errors that occur during the fetch operation
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error); // Logs any errors that occur during the fetch operation
            alert('There was an error deleting the post'); // Shows an alert message
        });
}

// Function to pin a post
function pinPost(postElement) {
    const postList = document.querySelector('.container'); // Selects the container element by class
    const currentlyPinned = postList.querySelector('.pinned-post'); // Selects the currently pinned post element

    if (currentlyPinned) {
        currentlyPinned.classList.remove('pinned-post'); // Removes the 'pinned-post' class from the currently pinned post
        const statusLabel = currentlyPinned.querySelector('.pinned-status');
        if (statusLabel) {
            statusLabel.style.display = 'none'; // Hides the pinned status label
        }
        const pinButton = currentlyPinned.querySelector('.pin-button');
        if (pinButton) {
            pinButton.classList.remove('pinned'); // Removes the 'pinned' class from the pin button
        }
    }

    postList.prepend(postElement); // Prepends the post element to the post list
    postElement.classList.add('pinned-post'); // Adds the 'pinned-post' class to the post element
    const pinnedLabel = postElement.querySelector('.pinned-status');
    if (pinnedLabel) {
        pinnedLabel.style.display = 'block'; // Displays the pinned status label
    }
    const pinButton = postElement.querySelector('.pin-button');
    if (pinButton) {
        pinButton.classList.add('pinned'); // Adds the 'pinned' class to the pin button
    }
}

// Function to unpin a post
function unpinPost(postElement) {
    const postList = document.querySelector('.container'); // Selects the container element by class
    postElement.remove(); // Removes the post element from its current position

    const otherPosts = Array.from(postList.children).filter(child => !child.classList.contains('pinned-post')); // Filters out pinned posts
    postElement.classList.remove('pinned-post'); // Removes the 'pinned-post' class from the post element

    const pinnedLabel = postElement.querySelector('.pinned-status');
    if (pinnedLabel) {
        pinnedLabel.style.display = 'none'; // Hides the pinned status label
    }
    const pinButton = postElement.querySelector('.pin-button');
    if (pinButton) {
        pinButton.classList.remove('pinned'); // Removes the 'pinned' class from the pin button
        pinButton.textContent = "Pin"; // Sets the button text to 'Pin'
    }

    let inserted = false; // Initializes a variable to track if the post has been inserted
    const postIndex = parseInt(postElement.dataset.index, 10); // Parses the index from the data attribute
    for (let i = 0; i < otherPosts.length; i++) {
        const otherPostIndex = parseInt(otherPosts[i].dataset.index, 10);
        if (postIndex < otherPostIndex) {
            postList.insertBefore(postElement, otherPosts[i]); // Inserts the post element before the other post
            inserted = true; // Sets inserted to true
            break;
        }
    }
    if (!inserted) {
        postList.appendChild(postElement); // Appends the post element to the post list if not inserted
    }
}

// Add event listeners for post ratings
document.querySelectorAll(".post").forEach(post => {
    const postId = post.dataset.postId; // Gets the post ID from the data attribute
    const ratings = post.querySelectorAll(".post-rating"); // Selects all post rating elements within the post
    const likeRating = ratings[0]; // Gets the like rating element

    ratings.forEach(rating => {
        const button = rating.querySelector(".post-rating-button"); // Selects the post rating button within the rating element
        const count = rating.querySelector(".post-rating-count"); // Selects the post rating count within the rating element

        button.addEventListener("click", async () => {
            if (rating.classList.contains("post-rating-selected")) {
                return; // Exits the function if the rating is already selected
            }

            count.textContent = Number(count.textContent) + 1; // Increments the rating count

            ratings.forEach(rating => {
                if (rating.classList.contains("post-rating-selected")) {
                    const count = rating.querySelector(".post-rating-count");

                    count.textContent = Math.max(0, Number(count.textContent) - 1); // Decrements the rating count
                    rating.classList.remove("post-rating-selected"); // Removes the 'post-rating-selected' class
                }
            });

            rating.classList.add("post-rating-selected"); // Adds the 'post-rating-selected' class

            const likeOrDislike = likeRating === rating ? "like" : "dislike"; // Determines if the rating is a like or dislike
            const response = await fetch(`/posts/${postId}/${likeOrDislike}`); // Sends a fetch request to like/dislike the post
            const body = await response.json(); // Parses the response body as JSON
        });
    });
});

// Display the first letter of the username
let username = localStorage.getItem("username"); // Gets the 'username' item from local storage

// Check if username is not null
if (username) {
    let firstLetter = username.charAt(0); // Gets the first character of the username

    // Display in the HTML
    document.querySelector(".firstname").textContent = firstLetter; // Sets the text content of the element with the class 'firstname'
    document.querySelector(".username").textContent = username; // Sets the text content of the element with the class 'username'
    document.querySelector(".firstnameProfile").textContent = firstLetter; // Sets the text content of the element with the class 'firstnameProfile'
}
const postUsername = username; // Sets the postUsername variable to the username

// Add event listener for the submit post button
document.getElementById('submitPost').addEventListener('click', function() {
    let postContent = document.getElementById('textInput').value; // Gets the value of the post content input

    // Looking for title, get input in {}
    const regex = /{([^}]*)}/; // Regular expression to match the title
    const match = postContent.match(regex); // Matches the title in the post content
    let contentOfPost = postContent; // Initializes the contentOfPost variable with the post content
    let postTitle = ''; // Initializes the postTitle variable

    if (match !== null) {
        contentOfPost = postContent.replace(match[0], '').trim(); // Removes the title from the post content
        postTitle = match[1].trim(); // Sets the postTitle variable to the matched title
    }

    // Looking for tags, get input after #
    const regexTags = /#(\w+)/g; // Regular expression to match tags
    let matchTags;
    let postTags = []; // Initializes the postTags array

    while ((matchTags = regexTags.exec(postContent)) !== null) {
        postTags.push("#" + matchTags[1].trim()); // Adds the matched tag to the postTags array
        contentOfPost = contentOfPost.replace(matchTags[0], '').trim(); // Removes the tag from the post content
    }

    console.log("Content of Post:", contentOfPost); // Logs the content of the post
    console.log("Post Tags:", postTags); // Logs the post tags

    // Get the day, month, and year
    const today = new Date(); // Creates a new Date object for the current date
    const day = today.getDate(); // Gets the day of the month
    const month = today.getMonth() + 1; // Gets the month (0-based, so add 1)
    const year = today.getFullYear(); // Gets the year

    // Get the hours and minutes
    const hours = today.getHours(); // Gets the hours
    let minutes = today.getMinutes(); // Gets the minutes
    if (minutes < 10) {
        minutes = "0" + minutes; // Adds a leading zero if minutes are less than 10
    }

    // Format the date and time
    const currentDate = `${day}/${month}/${year}`; // Formats the current date
    const currentTime = `${hours}:${minutes}`; // Formats the current time

    // Create an object to store the post data
    const postData = {
        title: postTitle,
        content: contentOfPost,
        username: postUsername,
        date: currentDate,
        timestamp: currentTime,
        tags: postTags,
    };

    // Send the post data to the server
    fetch('/post', {
        method: 'POST', // Sets the request method to POST
        headers: {
            'Content-Type': 'application/json' // Sets the content type to JSON
        },
        body: JSON.stringify(postData) // Converts the post data to a JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok'); // Throws an error if the response is not OK
        }
        return response.text(); // Returns the response text
    })
    .then(data => {
        console.log(data); // Logs the server response
        alert('Post submitted successfully'); // Shows an alert message
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error); // Logs any errors that occur during the fetch operation
        alert('There was an error submitting the post'); // Shows an alert message
    });
    document.getElementById('textInput').value = ''; // Clears the post content input
});

// Add event listener for the search bar input
document.querySelector('.search-bar').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase(); // Gets the value of the search bar input and converts it to lowercase
    const postsInContainer = document.querySelectorAll('.container .post'); // Selects all post elements within the container

    postsInContainer.forEach(post => {
        const titleElement = post.querySelector('#title'); // Selects the title element within the post
        const tagsElement = post.querySelector('.tags-container'); // Selects the tags element within the post

        const titleMatches = titleElement && titleElement.textContent.toLowerCase().includes(searchTerm); // Checks if the title matches the search term
        const tagsMatch = tagsElement && tagsElement.textContent.toLowerCase().includes(searchTerm); // Checks if the tags match the search term

        if (searchTerm.startsWith('#')) {
            // If the search term starts with '#', only match tags
            if (tagsMatch) {
                post.classList.remove('hidden'); // Shows the post if the tags match
            } else {
                post.classList.add('hidden'); // Hides the post if the tags do not match
            }
        } else {
            // If the search term does not start with '#', match titles
            if (titleMatches) {
                post.classList.remove('hidden'); // Shows the post if the title matches
            } else {
                post.classList.add('hidden'); // Hides the post if the title does not match
            }
        }
    });
});

// Add event listeners for post ratings
document.querySelectorAll(".post").forEach(post => {
    const postId = post.dataset.postId; // Gets the post ID from the data attribute
    const ratings = post.querySelectorAll(".post-rating"); // Selects all post rating elements within the post
    const likeRating = ratings[0]; // Gets the like rating element

    ratings.forEach(rating => {
        const button = rating.querySelector(".post-rating-button"); // Selects the post rating button within the rating element
        const count = rating.querySelector(".post-rating-count"); // Selects the post rating count within the rating element

        button.addEventListener("click", async () => {
            if (rating.classList.contains("post-rating-selected")) {
                return; // Exits the function if the rating is already selected
            }

            count.textContent = Number(count.textContent) + 1; // Increments the rating count

            ratings.forEach(rating => {
                if (rating.classList.contains("post-rating-selected")) {
                    const count = rating.querySelector(".post-rating-count");

                    count.textContent = Math.max(0, Number(count.textContent) - 1); // Decrements the rating count
                    rating.classList.remove("post-rating-selected"); // Removes the 'post-rating-selected' class
                }
            });

            rating.classList.add("post-rating-selected"); // Adds the 'post-rating-selected' class

            const likeOrDislike = likeRating === rating ? "like" : "dislike"; // Determines if the rating is a like or dislike
            const response = await fetch(`/posts/${postId}/${likeOrDislike}`); // Sends a fetch request to like/dislike the post
            const body = await response.json(); // Parses the response body as JSON
        });
    });
});

// Sidebar functions
function showSidebar() {
    const sidebar = document.querySelector('.sidebar'); // Selects the sidebar element by class
    sidebar.style.display = 'flex'; // Sets the display style of the sidebar to 'flex'
}

function hideSidebar() {
    const sidebar = document.querySelector('.sidebar'); // Selects the sidebar element by class
    sidebar.style.display = 'none'; // Sets the display style of the sidebar to 'none'
}

// Reminder Bot 
let userMessage; // Initializes a variable for the user message

// Function to create a text list item for the chat
const createTextLi = (message, className) => {
    const textLi = document.createElement('li'); // Creates a li element for the chat message
    textLi.classList.add('chat', className); // Adds the 'chat' and className classes to the li element
    let chatContent = className === 'outgoing' ? `<p>${message}</p>` : `<span class="material-symbols">:0</span><p>${message}</p>`; // Sets the chat content based on the className
    textLi.innerHTML = chatContent; // Sets the inner HTML of the li element
    return textLi; // Returns the created li element
}

// Function to generate a response from the bot
const generateResponse = (incomingTextLi) => {
    const messageElement = incomingTextLi.querySelector('p'); // Selects the p element within the incoming text li

    // Check if the user message is in the right format
    userMessage = chatInput.value; // Gets the value of the chat input
    console.log(userMessage); // Logs the user message

    // Bot Countdown
    const newTime = new Date(userMessage); // Creates a new Date object with the user message

    if (isNaN(newTime)) {
        messageElement.textContent = "Invalid date format. Please enter a valid date."; // Sets an error message if the date format is invalid
        return; // Exits the function
    }

    function updateCountdown() {
        const currentTime = new Date(); // Creates a new Date object for the current time
        const diff = newTime - currentTime; // Calculates the difference between the new time and the current time

        if (diff <= 0) {
            messageElement.textContent = "Countdown has ended!"; // Sets the message to indicate that the countdown has ended
            clearInterval(intervalId); // Clears the interval
            alert("The countdown has ended, it's time for a break!"); // Shows an alert message
            return; // Exits the function
        }

        const days = Math.floor(diff / 1000 / 60 / 60 / 24); // Calculates the number of days
        const hours = Math.floor(diff / 1000 / 60 / 60) % 24; // Calculates the number of hours
        const minutes = Math.floor(diff / 1000 / 60) % 60; // Calculates the number of minutes
        const seconds = Math.floor(diff / 1000) % 60; // Calculates the number of seconds

        let result = days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds "; // Formats the countdown result

        messageElement.textContent = result; // Sets the message element text content to the countdown result
    }

    const intervalId = setInterval(updateCountdown, 1000); // Sets an interval to update the countdown every second
}

// Function to handle chat input
const handleChat = () => {
    userMessage = chatInput.value.trim(); // Gets the trimmed value of the chat input
    if (!userMessage) return; // Exits the function if the user message is empty

    chatBox.appendChild(createTextLi(userMessage, 'outgoing')); // Appends the outgoing message to the chatbox
    chatBox.scrollTo(0, chatBox.scrollHeight); // Scrolls to the bottom of the chatbox

    setTimeout(() => {
        const incomingTextLi = createTextLi("Writing...", 'incoming'); // Creates an incoming message with "Writing..." text
        chatBox.appendChild(incomingTextLi); // Appends the incoming message to the chatbox
        chatBox.scrollTo(0, chatBox.scrollHeight); // Scrolls to the bottom of the chatbox
        generateResponse(incomingTextLi); // Generates a response from the bot
    });
}

sendTextBtn.addEventListener('click', handleChat); // Adds a click event listener to the send button to handle chat input

botToggler.addEventListener('click', function() {
    document.body.classList.toggle('show-bot'); // Toggles the 'show-bot' class on the body element
});

botCloseBtn.addEventListener('click', function() {
    document.body.classList.remove('show-bot'); // Removes the 'show-bot' class from the body element
});
