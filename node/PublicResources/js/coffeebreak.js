// Get canvas element and buttons by their IDs
const canvas = document.getElementById('drawing-board'); // Selects the element with ID 'drawing-board'
const clearBtn = document.getElementById('clear'); // Selects the element with ID 'clear'
const widthOfLine = document.getElementById('lineWidth'); // Selects the element with ID 'lineWidth'
const stroke = document.getElementById('stroke'); // Selects the element with ID 'stroke'
const canvas2d = canvas.getContext('2d'); // Get the 2D drawing context for the canvas

// Get the offset positions of the canvas
const canvasOffsetX = canvas.offsetLeft; // Get the offset left position of the canvas
const canvasOffsetY = canvas.offsetTop; // Get the offset top position of the canvas

// Set the width and height of the canvas based on window size
canvas.width = window.innerWidth - canvasOffsetX; // Set the canvas width to the window width minus the offset
canvas.height = window.innerHeight - canvasOffsetY; // Set the canvas height to the window height minus the offset

// Initialize painting state and line width
let isPainting = false; // Variable to track if painting is in progress, initialized to false
let newLineWidth = 5; // Variable to store the new line width, initialized to 5
let startX; // Variable to store the starting X coordinate
let startY; // Variable to store the starting Y coordinate

// Add event listener to clear button to clear the canvas
clearBtn.addEventListener('click', function() {
    canvas2d.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
});

// Add event listener to change the stroke color based on user input
stroke.addEventListener('input', function() {
    canvas2d.strokeStyle = stroke.value; // Set the stroke style to the value of the stroke input
});

// Add event listener to change the line width based on user input
widthOfLine.addEventListener('input', function() {
    newLineWidth = widthOfLine.value; // Set the new line width to the value of the line width input
});

// Function to draw on the canvas
function draw(e) {
    if (!isPainting) return; // Exit function if not painting

    canvas2d.lineWidth = newLineWidth; // Set the line width to the new line width
    canvas2d.lineCap = 'round'; // Set the line cap style to 'round'

    canvas2d.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY); // Draw a line to the current mouse position, adjusted for canvas offset
    canvas2d.stroke(); // Apply the stroke to the current path
}

// Event listener for mouse down event to start painting
canvas.addEventListener('mousedown', (e) => {
    isPainting = true; // Set isPainting to true
    startX = e.clientX - canvasOffsetX; // Set the starting X coordinate
    startY = e.clientY - canvasOffsetY; // Set the starting Y coordinate
    canvas2d.beginPath(); // Begin a new path
    canvas2d.moveTo(startX, startY); // Move to the starting coordinates
});

// Event listener for mouse up event to stop painting
canvas.addEventListener('mouseup', (e) => {
    isPainting = false; // Set isPainting to false
    canvas2d.closePath(); // Close the current path to prevent connecting lines
});

// Event listener for mouse move event to draw
canvas.addEventListener('mousemove', draw); // Add an event listener to call draw function on mouse move
