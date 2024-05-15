// der er endnu det problem, at man kan se alle events fra alle dage
// og den gemmer i local storage...

// calendar
const header = document.querySelector('.calendar h3');
const dates = document.querySelector('.dates');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const newEventModal = document.getElementById('newEventModal');
const backDrop = document.getElementById('modalBackDrop');

// the todo list
const inputBox = document.getElementById('todo-input');
const listContainer = document.getElementById('list-container');
const cancelBtn = document.getElementById('cancel-button');
const addBtn = document.getElementById('add-button');

/*
function fetchCalendarData() {
    fetch('/calendar')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            renderCalendar(); 
        })
        .catch(error => {
            console.error('Error fetching calendar data:', error);
        });
}

function updateCalendarData(updatedData) {
    fetch('/calendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(message => {
            console.log('Server response:', message);
        })
        .catch(error => {
            console.error('Error updating calendar data:', error);
        });
}
*/
let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];


const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

// highlight newEvent
function openModal(date) {
    clicked = date;
    newEventModal.style.display = 'block';
    backDrop.style.display = 'block';
}


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

    header.textContent = 
    `${newDate.toLocaleDateString('en-us', { month: 'long'})} ${year}`;

    dates.innerHTML = '';

    for(let i = 1; i <= extraDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month + 1} / ${i-extraDays} / ${year}`;

        if (i > extraDays) {
            daySquare.innerText = i - extraDays;

            // highlight current day
            if (i - extraDays === day && nav === 0) {
                daySquare.id = 'currentDay';
            }

            // finds all events for a month
            const eventForDay = events.find(e => e.date === dayString);
            console.log(eventForDay);

            // creates div for event
            if(eventForDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);
            }

            daySquare.addEventListener('click', () => {
                openModal(dayString);
            });

        } else {
            daySquare.classList.add('extra');
        }

        dates.appendChild(daySquare);
    }
   

}

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


// the todo list

addBtn.addEventListener('click', function(){
    if(inputBox.value){
        let li = document.createElement('li');
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement('span');
        // the x symbol
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        
        events.push({
            date: clicked,
            title: inputBox.value
        });
        
        // todo 
        localStorage.setItem('events', JSON.stringify(events));

    
    } else {
        console.log("You need to write something");  
    }
    inputBox.value = '';

})

cancelBtn.addEventListener('click', function() {
    newEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    inputBox.value = '';
    clicked = null;
    renderCalendar();
});

listContainer.addEventListener('click', function(e) {
    if(e.target.tagName === 'LI'){
        e.target.classList.toggle('checked');
        
        deleteEvent();
        /*deleteEventFromJSON(clicked);
        saveEventsToFile(events); */
    } else if (e.target.tagName === 'SPAN') {
        e.target.parentElement.remove();
        
        deleteEvent();
        /*deleteEventFromJSON(clicked);
        saveEventsToFile(events);*/
    }
});


/*function addNewEvent(calendarData) {
    events.push(calendarData);
    updateCalendarData(events);
}*/


function deleteEvent(date) {
    /*events = events.filter(event => event.date !== date);
    updateCalendarData(events);*/

    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    renderCalendar();
}

function displayList() {
    listContainer.innerHTML = localStorage.getItem('data');
}

//fetchCalendarData();