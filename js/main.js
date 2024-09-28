let score;
let lives;
let currentQuestionIndex = 0;
let questions = [];
let userId = '';
const lifeUpThreshold = 10; // Points needed to earn an extra life

// Load Questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        startGame();
    } catch (error) {
        console.error("Error loading questions:", error);
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
};

// Event Listeners for Game Start
document.getElementById('submit-id-button').addEventListener('click', () => {
    userId = document.getElementById('user-id-input').value;
    if (userId) {
        localStorage.setItem('userId', userId);
        document.getElementById('user-id-section').classList.add('hidden');
        document.getElementById('start-button').classList.remove('hidden');
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
        answerButton.addEventListener('click', () => checkAnswer(index));
        answersContainer.appendChild(answerButton);
    });
}

function checkAnswer(selectedIndex) {
    const correctIndex = questions[currentQuestionIndex].correctAnswer;
    if (selectedIndex === correctIndex) {
        score += 10; // Increment score by 10 for each correct answer
        // if (score % lifeUpThreshold === 0 && lives < 4) {
        //     lives++;  // Award extra life every 10 points
        //     updateLives();
        // }
    } else {
        loseLife();
    }

    updateScore();
    currentQuestionIndex++;
    showQuestion();
}

function loseLife() {
    lives--;
    updateLives();
    if (lives < 1) {
        endGame();
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
    document.getElementById('final-score').innerText = `Final Score: ${score}`;
    localStorage.setItem(`${userId}-score`, score);
}

document.getElementById('restart-button').addEventListener('click', () => {
    document.getElementById('game-over-screen').classList.add('hidden');
    loadQuestions();
});
