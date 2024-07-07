const startButton = document.getElementById("button");
const questionText = document.getElementById("question-text");
const choices = document.getElementById("choices");
const text1 = document.getElementById("text1");
const text2 = document.getElementById("text2");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const submitButton = document.getElementById("submit-button");
const timer = document.getElementById('timer');
const refreshButton=document.getElementById('refreshbutton');
let currentQuestionIndex = 0;
let totalquestions=10;
let score = 0;
let questions = [];
let timers;
let previousselectedChoice;
let selectedAnswers = [];

// Event listeners for the navigation buttons
prevButton.addEventListener("click", () => {
    clearInterval(timers);
    navigateQuestion(-1);
    startTimer();
});
submitButton.addEventListener("click", endQuiz);
nextButton.addEventListener("click", () => {
    clearInterval(timers);
    navigateQuestion(1);
    startTimer();
});

// Event listener for the start button
startButton.addEventListener("click", () => {
    startQuiz();
    startTimer();
});

// Function to start the quiz
function startQuiz() {
    startButton.classList.add("notvisible");
    text1.classList.add("notvisible");
    text2.classList.add("notvisible");
    timer.classList.add("visibletimer");
    loadQuestions();
}

// Function to load questions from the API
function loadQuestions() {
    fetch("https://opentdb.com/api.php?amount=10&category=27&difficulty=medium")
        .then((response) => response.json())
        .then((data) => {
            questions = data.results;
            loadQuestion(currentQuestionIndex);
        });
}

// Function to load a specific question
function loadQuestion(index) {
    const question = questions[index];
    questionText.textContent = `Question ${currentQuestionIndex + 1}. ${question.question}`;

    choices.innerHTML = "";
    question.incorrect_answers.forEach((choice) => {
        addChoice(choice, false);
    });
    addChoice(question.correct_answer, true);
    
    const scoreDisplay = document.createElement("p");
    scoreDisplay.textContent = `Current Score: ${score}/10`;
    choices.appendChild(scoreDisplay);

    // Update button visibility based on the current question
    questionText.classList.add("questiontext1");
    prevButton.classList.add("inlinebuttons");
    nextButton.classList.add("inlinebuttons");
    submitButton.classList.add("inlinebuttons");
    prevButton.disabled = index === 0;
    submitButton.disabled = index < questions.length - 1;
    nextButton.disabled = index === questions.length -1;
}

// Function to add a choice (correct or incorrect)
function addChoice(text, correct) {
    const li = document.createElement("li");
    li.textContent = text;
    li.addEventListener("click", () => handleChoice(li, correct));
    choices.appendChild(li);
}

// Function to handle user's choice
function handleChoice(selectedChoice, correct) {
    if(previousselectedChoice)
    {
        previousselectedChoice.classList.remove("selected");
    }
    
    // Apply the "selected" class for the clicked choice
    selectedChoice.classList.add("selected");
    previousselectedChoice=selectedChoice;
    selectedAnswers[currentQuestionIndex] = {
        selectedChoice: selectedChoice.textContent,
        correct: correct
    };
    if (correct) {
        score++;
    }
    if (currentQuestionIndex < totalquestions - 1) {
            nextQuestion();
        } else {
            endQuiz();
        }
    }
// Function to navigate to the previous or next question
function navigateQuestion(offset) {
    const newIndex = currentQuestionIndex + offset;

    if (offset === -1) {
        // If going back to the previous question, check if the previous question was answered
        if (selectedAnswers[newIndex]) {
            // If the previous question was answered correctly, deduct the score
            if (selectedAnswers[newIndex].correct) {
                score--;
            }
            delete selectedAnswers[newIndex];
        }
    } 
if (newIndex >= 0 && newIndex < questions.length) {
        currentQuestionIndex = newIndex;
        loadQuestion(newIndex);
    }
}
//Function to start the timer
function startTimer() {
    let seconds = 30;
    timers = setInterval(function () {
        timer.innerText = seconds;
        if (seconds === 0) {
            clearInterval(timers);
            if(currentQuestionIndex == questions.length-1)
            {
                endQuiz();
            }
            else
            {
                nextQuestion();
            }
            // Handle time up, move to the next question or end the quiz
            
        }
        seconds--;
    },1000);
}
//Function for next question
function nextQuestion() {
    clearInterval(timers);
    navigateQuestion(1);
    startTimer();
}

// Function to end the quiz and display the score
function endQuiz() {
    clearInterval(timers);
    questionText.textContent = `Your Score: ${score}/10`;
    choices.innerHTML = "";
    prevButton.classList.remove("inlinebuttons");
    nextButton.classList.remove("inlinebuttons");
    submitButton.classList.remove("inlinebuttons");
    timer.classList.remove("visibletimer");
    refreshButton.classList.add("inlinebuttons");

}
//Function to refresh the page
function refreshQuiz() {
    location.reload();
}

