// Select all elements with class 'radio-container'
const radioContainers = document.querySelectorAll('.radio-container'); // Selects all elements with the class 'radio-container'

// Select the submit button by its ID
const submitBtn = document.getElementById('submitBtn'); // Selects the element with ID 'submitBtn'

// Select the result display element by its ID
const resultQuiz = document.getElementById('result-quiz'); // Selects the element with ID 'result-quiz'

// Iterate over each radio container
radioContainers.forEach(container => {
    // Select all radio inputs within the current container
    const radioInputs = container.querySelectorAll('input[type="radio"]'); // Selects all radio input elements within the current container
    
    // Add click event listener to each radio input
    radioInputs.forEach(input => {
        input.addEventListener('click', function() {
            // Uncheck all other radio buttons in the same container
            radioInputs.forEach(radio => {
                if (radio !== input) {
                    radio.checked = false; // Uncheck the radio button if it's not the one that was clicked
                }
            });
        });
    });
});

// Add click event listener to the submit button
submitBtn.addEventListener('click', function() {
    // Select all radio inputs on the page
    const radioInputs = document.querySelectorAll('input[type="radio"]'); // Selects all radio input elements on the page

    // Initialize total points
    let totalPoints = 0; // Initializes a variable to keep track of the total points

    // Sum the values of checked radio inputs
    radioInputs.forEach(input => {
        if (input.checked) { // If the radio input is checked
            totalPoints += parseInt(input.value); // Add the value of the checked radio input to the total points
        }
    });

    // Determine and display the result based on total points
    if(totalPoints >= 45) { // If total points are 45 or more
        resultQuiz.textContent = "Very High team cohesion"; // Display 'Very High team cohesion'
    } else if(totalPoints < 45 && totalPoints >= 38) { // If total points are between 38 and 44
        resultQuiz.textContent = "High team cohesion"; // Display 'High team cohesion'
    } else if(totalPoints < 38 && totalPoints >= 28) { // If total points are between 28 and 37
        resultQuiz.textContent = "Neutral team cohesion"; // Display 'Neutral team cohesion'
    } else if(totalPoints < 28 && totalPoints >= 20) { // If total points are between 20 and 27
        resultQuiz.textContent = "Low team cohesion"; // Display 'Low team cohesion'
    } else if(totalPoints > 20) { // If total points are 20 or less
        resultQuiz.textContent = "Very low team cohesion"; // Display 'Very low team cohesion'
    } else {
        console.log("Something went wrong"); // Log an error message if something went wrong
    }

    // Log the total points for debugging
    console.log("Total points: ", totalPoints); // Logs the total points to the console
});
