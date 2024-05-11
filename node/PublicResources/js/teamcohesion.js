const radioContainers = document.querySelectorAll('.radio-container');
const submitBtn = document.getElementById('submitBtn');
const backDrop = document.getElementById('modalBackDrop');
const highlightContainer = document.getElementById('highlight-container');
const resultQuiz = document.getElementById('result-quiz');


radioContainers.forEach(container => {
    const radioInputs = container.querySelectorAll('input[type="radio"]');
    
    radioInputs.forEach(input => {
        input.addEventListener('click', function() {
            radioInputs.forEach(radio => {
                if (radio !== input) {
                    radio.checked = false;
                }
            });
        });
    });
});

submitBtn.addEventListener('click', function() {
    highlightContainer.style.display = 'block';
    backDrop.style.display = 'block';
    const radioInputs = document.querySelectorAll('input[type="radio"]');

    let totalPoints = 0;
    radioInputs.forEach(input => {
        if (input.checked) {
            totalPoints += parseInt(input.value);
        }
    });

    if(totalPoints >= 45) {
        resultQuiz.value = "Very High team cohesion";
    } else if(totalPoints < 45 && totalPoints >= 38) {
        resultQuiz.value = "High team cohesion";
    } else if(totalPoints < 38 && totalPoints >= 28) {
        resultQuiz.value = "Neutral team cohesion";
    } else if(totalPoints < 28 && totalPoints >= 20) {
        resultQuiz.value = "Low team cohesion";
    } else if(totalPoints > 20) {
        resultQuiz.value = "Very low team cohesion";
    } else {
        console.log("Something went wrong");
    }

    console.log("Total points: ", totalPoints);
});