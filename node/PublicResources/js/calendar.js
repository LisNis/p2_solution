const header = document.querySelector('.calendar h3'); // Select the calendar header element
const dates = document.querySelector('.dates'); // Select the container for the dates
const prevBtn = document.querySelector('#prev'); // Select the button to go to the previous month
const nextBtn = document.querySelector('#next'); // Select the button to go to the next month
const newEventModal = document.getElementById('newEventModal'); // Select the modal for adding new events
const backDrop = document.getElementById('modalBackDrop'); // Select the backdrop for the modal

const titleInput = document.getElementById('todo-title'); // Select the input field for the event title
const cancelBtn = document.getElementById('cancel-button'); // Select the cancel button
const addBtn = document.getElementById('add-button'); // Select the add button
const listContainer = document.getElementById('list-container'); // Select the container for the list of events

let nav = 0; // Variable to keep track of the current month (0 is the current month, -1 is the previous month, etc.)
let clicked = null; // Variable to keep track of the clicked date
let events = []; // Array to store events

const weekdays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]; // Array of weekday names

function openModal(date) {
    clicked = date; // Set the clicked date
    newEventModal.style.display = 'block'; // Show the modal
    backDrop.style.display = 'block'; // Show the backdrop
}

function closeModal() {
    newEventModal.style.display = 'none'; // Hide the modal
    backDrop.style.display = 'none'; // Hide the backdrop
    titleInput.value = ''; // Clear the input field
    clicked = null; // Reset the clicked date
}

// Render the calendar for the current month
function renderCalendar() {
    const newDate = new Date(); // Create a new Date object

    if (nav !== 0) {
        newDate.setMonth(new Date().getMonth() + nav); // Adjust the month based on the nav variable
    }

    const day = newDate.getDate(); // Get the current day
    const month = newDate.getMonth(); // Get the current month
    const year = newDate.getFullYear(); // Get the current year

    const firstDayofMonth = new Date(year, month, 1); // Get the first day of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the number of days in the month
    const dateString = firstDayofMonth.toLocaleDateString('en-us', {
        weekday: 'long', 
        year: 'numeric', 
        month: 'numeric',
        day: 'numeric'
    }); // Format the date as a string

    const extraDays = weekdays.indexOf(dateString.split(', ')[0]); // Get the number of extra days at the start of the month
    console.log(extraDays); // Log the number of extra days for debugging

    header.textContent = `${newDate.toLocaleDateString('en-us', { month: 'long'})} ${year}`; // Update the calendar header
    dates.innerHTML = ''; // Clear the dates container

    // Loop through the days of the month and extra days
    for (let i = 1; i <= extraDays + daysInMonth; i++) {
        const daySquare = document.createElement('div'); // Create a new div for each day
        daySquare.classList.add('day'); // Add the 'day' class to the div

        const dayString = `${month + 1}/${i - extraDays}/${year}`; // Create a string for the date

        if (i > extraDays) {
            daySquare.innerText = i - extraDays; // Set the text of the div to the day number
            daySquare.setAttribute('data-day', i - extraDays); // Set the data-day attribute
            daySquare.setAttribute('data-month', month); // Set the data-month attribute
            daySquare.setAttribute('data-year', year); // Set the data-year attribute

            if (i - extraDays === day && nav === 0) {
                daySquare.id = 'currentDay'; // Highlight the current day
            }

            daySquare.addEventListener('click', () => openModal(dayString)); // Add an event listener to open the modal when the day is clicked
        } else {
            daySquare.classList.add('extra'); // Add the 'extra' class to the div for extra days
        }

        dates.appendChild(daySquare); // Append the div to the dates container
    }

    fetchEvents(); // Fetch and render events
}

// Navigate between months
function buttons() {
    nextBtn.addEventListener('click', () => {
        nav++; // Increment the nav variable
        renderCalendar(); // Re-render the calendar
    });

    prevBtn.addEventListener('click', () => {
        nav--; // Decrement the nav variable
        renderCalendar(); // Re-render the calendar
    });
}

buttons(); // Initialize the navigation buttons
renderCalendar(); // Render the calendar

cancelBtn.addEventListener('click', closeModal); // Add an event listener to close the modal when the cancel button is clicked

// Add event to the calendar
addBtn.addEventListener('click', function () {
    const eventTitle = titleInput.value; // Get the event title from the input field
    const eventDate = clicked; // Get the clicked date

    if (eventTitle) {
        const newEvent = {
            title: eventTitle,
            date: eventDate,
        }; // Create a new event object

        fetch('/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEvent)
        }) // Send a POST request to add the new event
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok'); // Throw an error if the response is not ok
                }
                return response.text();
            })
            .then(data => {
                console.log(data); // Log the server response
                alert('Event added successfully'); // Show a success message
                fetchEvents(); // Refresh the events list
                closeModal(); // Close the modal
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error); // Log the error
                alert('There was an error adding the event'); // Show an error message
            });
    }
});

// Fetch events from the server
function fetchEvents() {
    fetch('/events')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched events:', data); // Log the fetched events for debugging
            renderEvents(data); // Render the events on the calendar
        })
        .catch(error => {
            console.error('Error fetching events:', error); // Log the error
        });
}

// Render events on the calendar
function renderEvents(events) {
    dates.querySelectorAll('.day').forEach(day => {
        const dayEvents = day.querySelectorAll('.event');
        dayEvents.forEach(eventElement => eventElement.remove()); // Remove existing events from the day
    });

    events.forEach(event => {
        dates.querySelectorAll('.day').forEach(day => {
            const dayDate = new Date(day.getAttribute('data-year'), day.getAttribute('data-month'), day.getAttribute('data-day'));
            const eventDate = new Date(event.date);

            if (
                eventDate.getDate() === dayDate.getDate() &&
                eventDate.getMonth() === dayDate.getMonth() &&
                eventDate.getFullYear() === dayDate.getFullYear()
            ) {
                if (!day.querySelector(`.event[data-id="${event.date}"]`)) {
                    const calendarEventElement = createEventElement(event, true);
                    calendarEventElement.setAttribute('data-id', event.date); // Add a data-id to identify the event
                    day.appendChild(calendarEventElement); // Append the event to the day
                }
            }
        });
    });
}

// Create an event element
function createEventElement(event, forCalendar = false) {
    const eventElement = document.createElement('div'); // Create a new div for the event
    eventElement.className = 'event'; // Add the 'event' class to the div
    
    const eventTitle = document.createElement('h3'); // Create an h3 for the event title
    eventTitle.textContent = event.title; // Set the text of the h3 to the event title
    eventElement.appendChild(eventTitle); // Append the h3 to the event div

    const eventDate = document.createElement('p'); // Create a p for the event date
    eventDate.textContent = new Date(event.date).toLocaleDateString(); // Set the text of the p to the formatted event date
    eventElement.appendChild(eventDate); // Append the p to the event div

    const deleteButton = document.createElement('button'); // Create a button for deleting the event
    deleteButton.textContent = 'Delete'; // Set the text of the button
    deleteButton.id = 'deleteEvent'; // Set the id of the button
    deleteButton.addEventListener('click', () => {
        deleteEvent(event); // Add an event listener to delete the event when the button is clicked
    });
    eventElement.appendChild(deleteButton); // Append the button to the event div
    
    return eventElement; // Return the event div
}

// Delete an event
function deleteEvent(eventToDelete) {
    fetch(`/events/${encodeURIComponent(eventToDelete.date)}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventToDelete)
    }) // Send a DELETE request to delete the event
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); // Throw an error if the response is not ok
            }
            return response.text();
        })
        .then(data => {
            console.log(data); // Log the server response
            alert('Event deleted successfully'); // Show a success message
            fetchEvents(); // Refresh the events list
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error); // Log the error
            alert('There was an error deleting the event'); // Show an error message
        });
}
