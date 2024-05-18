document.addEventListener('DOMContentLoaded', function() {
    fetchEvents();
});

function fetchEvents() {
    fetch('/calendar')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(events => {
            renderEvents(events);
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}

// json event
function renderEvents(events) {
    const dates = document.querySelector('.dates');
    dates.querySelectorAll('.day').forEach(day => {
        const dayDate = new Date(day.getAttribute('data-year'), day.getAttribute('data-month'), day.getAttribute('data-day'));
        const event = events.find(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === dayDate.getDate() &&
                   eventDate.getMonth() === dayDate.getMonth() &&
                   eventDate.getFullYear() === dayDate.getFullYear();
        });
        if (event) {
            const eventElement = createEventElement(event);
            day.appendChild(eventElement);
        }
    });
}

function createEventElement(event) {
    const eventElement = document.createElement('div');
    eventElement.className = 'event';
    
    const eventTitle = document.createElement('h3');
    eventTitle.textContent = event.title;
    eventElement.appendChild(eventTitle);
    
    const eventDate = document.createElement('p');
    eventDate.textContent = new Date(event.date).toLocaleDateString();
    eventElement.appendChild(eventDate);
    
    return eventElement;
}

const header = document.querySelector('.calendar h3');
const dates = document.querySelector('.dates');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const newEventModal = document.getElementById('newEventModal');
const backDrop = document.getElementById('modalBackDrop');

const inputBox = document.getElementById('todo-input');
const titleInput = document.getElementById('todo-title');
const cancelBtn = document.getElementById('cancel-button');
const addBtn = document.getElementById('add-button');

let nav = 0;
let clicked = null;

const weekdays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// for at highlight event
function openModal(date) {
    clicked = date;
    newEventModal.style.display = 'block';
    backDrop.style.display = 'block';
}

// vigtig function (impl.), render calendar med alle dage 
function renderCalendar() {
    const newDate = new Date();

    if (nav !== 0) {
        newDate.setMonth(new Date().getMonth() + nav);
    }

    const day = newDate.getDate();
    const month = newDate.getMonth();
    const year = newDate.getFullYear();

    // which year, which month, the first day
    const firstDayofMonth = new Date(year, month, 1);
    // which year, the next month, the last day of the previous month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // first day of the month, based on location, so month/day/year
    const dateString = firstDayofMonth.toLocaleDateString('en-us', {
        // Long: Monday, short: Mon, Numeric: 1
        weekday: 'long', 
        year: 'numeric', 
        month: "numeric",
        day: 'numeric'
    });

    // only want to get the first element, the weekday
    const extraDays = weekdays.indexOf(dateString.split(', ')[0]);
    console.log(extraDays);


    header.textContent = `${newDate.toLocaleDateString('en-us', { month: 'long'})} ${year}`;
    dates.innerHTML = '';

    for (let i = 1; i <= extraDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month + 1}/${i - extraDays}/${year}`;

        if (i > extraDays) {
            daySquare.innerText = i - extraDays;
            daySquare.setAttribute('data-day', i - extraDays);
            daySquare.setAttribute('data-month', month);
            daySquare.setAttribute('data-year', year);

            // highlight current day
            if (i - extraDays === day && nav === 0) {
                daySquare.id = 'currentDay';
            }

            daySquare.addEventListener('click', () => openModal(dayString));
        } else {
            daySquare.classList.add('extra');
        }

        dates.appendChild(daySquare);
    }

    fetchEvents(); // Fetch and render events
}

// next og prev button, for de andre months
function buttons() {
    nextBtn.addEventListener('click', () => {
        nav++;
        renderCalendar();
    });

    prevBtn.addEventListener('click', () => {
        nav--;
        renderCalendar();
    });
}

buttons();
renderCalendar();

cancelBtn.addEventListener('click', function() {
    newEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    inputBox.value = '';
    titleInput.value = '';
    clicked = null;
    renderCalendar();
});

addBtn.addEventListener('click', function() {
    let eventDescription = inputBox.value;
    let eventTitle = titleInput.value;

    if (!eventTitle || !clicked) {
        alert('Title and Date are required');
        return;
    }

    const eventData = {
        title: eventTitle,
        date: clicked,
        description: eventDescription
    };

    fetch('/calendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Log the server response
        alert('Event submitted successfully');
        newEventModal.style.display = 'none';
        backDrop.style.display = 'none';
        inputBox.value = '';
        titleInput.value = '';
        clicked = null;
        renderEvents([data]); // Update calendar with new event
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('There was an error submitting the event');
    });
});
