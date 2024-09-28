let score;
let lives;
let currentQuestionIndex = 0;
let questions = [];
let userId = '';
const lifeUpThreshold = 10; // Points needed to earn an extra life
const questionChangeDelay = 3000; // 3 seconds delay for each question change

// Load Questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        shuffleQuestions();
        startGame();
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}

// Shuffle the questions array
function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

// Game Initialization Logic
window.onload = function () {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
        userId = storedId;
        document.getElementById('user-id-section').classList.add('hidden');
        document.getElementById('start-button').classList.remove('hidden');
    }
    updateHighScoreDisplay(); // Show high score on main screen
};

// Update high score display based on stored value
function updateHighScoreDisplay() {
    const highScore = localStorage.getItem(`${userId}-highscore`) || 0;
    document.getElementById('high-score-text').innerText = `High Score: ${highScore}`;
}

// Event Listeners for Game Start
document.getElementById('submit-id-button').addEventListener('click', () => {
    userId = document.getElementById('user-id-input').value;
    if (userId) {
        localStorage.setItem('userId', userId);
        document.getElementById('user-id-section').classList.add('hidden');
        document.getElementById('start-button').classList.remove('hidden');
        updateHighScoreDisplay(); // Show high score when the user is set
    }
});

document.getElementById('start-button').addEventListener('click', () => {
    loadQuestions();
});

function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('question-container').classList.remove('hidden');
    document.getElementById('life-counter').classList.remove('hidden');
    document.getElementById('score-bar').classList.remove('hidden');
    // Initialize the game state
    score = 0;
    lives = 3;  // Start with 3 lives
    currentQuestionIndex = 0;
    updateLives();
    updateScore();
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }

    const questionData = questions[currentQuestionIndex];
    document.getElementById('question-text').innerText = questionData.question;

    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';

    questionData.answers.forEach((answer, index) => {
        const answerButton = document.createElement('button');
        answerButton.className = 'answer-button';
        answerButton.innerText = answer;
        answerButton.addEventListener('click', () => checkAnswer(index, answerButton));
        answersContainer.appendChild(answerButton);
    });


}

function checkAnswer(selectedIndex, selectedButton) {
    const correctIndex = questions[currentQuestionIndex].correctAnswer;

    // Highlight buttons with colors based on correctness
    const buttons = document.querySelectorAll('.answer-button');
    buttons.forEach((button, index) => {
        if (index === correctIndex) {
            button.classList.add('correct');  // Make the correct button green
        } else if (index === selectedIndex) {
            button.classList.add('incorrect'); // Make the wrong button red
        }
    });

    if (selectedIndex === correctIndex) {
        score += 10; // Increment score by 10 for each correct answer
    } else {
        loseLife();
    }

    updateScore();
        // Automatically move to the next question after 3 seconds
        setTimeout(() => {
            // No matter if a selection was made or not, advance the question
            currentQuestionIndex++;
            showQuestion();
        }, questionChangeDelay);
}

function loseLife() {
    lives--;
    updateLives();
    if (lives < 1) {
        
        setTimeout(() => {
            // No matter if a selection was made or not, advance the question
            // currentQuestionIndex++;
            // showQuestion();
            endGame();
        }, questionChangeDelay);
    }
}

function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

function updateLives() {
    for (let i = 1; i <= 4; i++) {
        let lifeElement = document.getElementById(`life-${i}`);
        if (!lifeElement && i === 4) {
            lifeElement = document.createElement('img');
            lifeElement.src = 'assets/heart.png';
            lifeElement.classList.add('life');
            lifeElement.id = `life-${i}`;
            document.getElementById('life-counter').appendChild(lifeElement);
        }
        lifeElement.style.visibility = i > lives ? 'hidden' : 'visible';
    }
}

function endGame() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('question-container').classList.add('hidden');
    document.getElementById('life-counter').classList.add('hidden');
    document.getElementById('score-bar').classList.add('hidden');
    document.getElementById('final-score').innerText = `Final Score: ${score}`;
     // Check if the current score is higher than the stored high score
     const highScore = parseInt(localStorage.getItem(`${userId}-highscore`) || 0);
     if (score > highScore) {
         localStorage.setItem(`${userId}-highscore`, score);
     }
 
     localStorage.setItem(`${userId}-score`, score);
     updateHighScoreDisplay(); // Update high score display when the game ends
}

document.getElementById('restart-button').addEventListener('click', () => {
    document.getElementById('game-over-screen').classList.add('hidden');
    loadQuestions();
});
