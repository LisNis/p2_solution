// calendar
const header = document.querySelector('.calendar h3');
const dates = document.querySelector('.dates');
const navs = document.querySelectorAll('#prev, #next');

// the todo list
const inputBox = document.getElementById('todo-input');
const listContainer = document.getElementById('list-container');

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

let date = new Date();
let month = date.getMonth(); 
let year = date.getFullYear();

function renderCalendar() {
    const start = new Date(year, month, 1).getDay();
    const endDate = new Date(year, month + 1, 0).getDate();
    const end = new Date(year, month, endDate).getDay();
    const endDatePrev = new Date(year, month, 0).getDate();

    let datesHtml = '';

    // Previous months dates
    for (let i = start; i > 0; i--) {
        datesHtml += `<li class="inactive">${endDatePrev - i + 1}</li>`;
    }

    // Current months dates
    for (let i = 1; i <= endDate; i++) {
        let className =
            i === date.getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear()
                ? ' class="today"'
                : '';

        datesHtml += `<li${className}>${i}</li>`;
    }

    // Next months dates
    for (let i = end + 1; i < 7; i++) {
        datesHtml += `<li class="inactive">${i - end}</li>`;
    }

    dates.innerHTML = datesHtml;
    header.textContent = `${months[month]} ${year}`;

    navs.forEach(nav => {
        nav.addEventListener('click', e => {
            const btnId = e.target.id;
    
            if (btnId === 'prev') {
                month = (month === 0) ? 11 : month - 1;
                year = (month === 11) ? year - 1 : year;
            } else {
                month = (month === 11) ? 0 : month + 1;
                year = (month === 0) ? year + 1 : year;
            }
    
            renderCalendar();
        });
    });
       
}
renderCalendar();

function addTask(){
    if(inputBox.value === ''){
        console.log("You need to write something");
    } else {
        let li = document.createElement('li');
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement('span');
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    inputBox.value = '';
    saveData();
}

listContainer.addEventListener('click', function(e) {
    if(e.target.tagName === 'LI'){
        e.target.classList.toggle('checked');
        saveData();

    } else if (e.target.tagName === 'SPAN') {
        e.target.parentElement.remove();
        saveData();
    }

});

function saveData() {
    localStorage.setItem('data', listContainer.innerHTML);
}

function displayList() {
    listContainer.innerHTML = localStorage.getItem('data');
}
displayList();