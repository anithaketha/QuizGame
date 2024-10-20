const playerForm = document.getElementById('playerForm');
const categorySelect = document.getElementById('categorySelect');
const categorySelection = document.getElementById('category-selection');
const startQuestionsBtn = document.getElementById('startQuestionsBtn');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const resultContainer = document.getElementById('result');
// questionContainer.classList.add("container")
// questionElement.classList.add("questioin-container")
let player1Name, player2Name;
let currentPlayer = 1;
let playerScores = { player1: 0, player2: 0 };
let questions = [];
let currentQuestionIndex = 0;

const fetchQuestions = async () => {
  const response = await fetch('https://opentdb.com/api.php?amount=10');
  const data = await response.json();
  questions = data.results; 
  
  currentQuestionIndex = 0;
  displayQuestion();
};

const displayQuestion = () => {
  questionContainer.style.display = 'block';
  const question = questions[currentQuestionIndex];
  
  questionElement.textContent = question.question;
  optionsElement.innerHTML = '';
  
  const options = [...question.incorrect_answers, question.correct_answer];
  // options.sort(() => Math.random() - 0.5);
  
  options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.classList.add("optionButton")
    button.onclick = () => handleAnswer(option, question.correct_answer);
    optionsElement.appendChild(button);
  });
};

const handleAnswer = (selectedAnswer, correctAnswer) => {
  const question = questions[currentQuestionIndex];
  const difficulty = question.difficulty;
  
  if (selectedAnswer === correctAnswer) {
    let points = 0;
    if (difficulty === 'easy') 
        {
        points = 10
    };
    if (difficulty === 'medium') points = 15;
    if (difficulty === 'hard') points = 20;
    if (currentPlayer === 1) {
      playerScores.player1 += points;
    } else {
      playerScores.player2 += points;
    }
  }

  nextBtn.style.display = 'block';
};

// Proceed to the next question
nextBtn.onclick = () => {
  currentQuestionIndex++;
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
    nextBtn.style.display = 'none';
  } else {
    endGame();
  }
};

// End the game and display the result
const endGame = () => {
  questionContainer.style.display = 'none';
  resultContainer.style.display = 'block';
  
  const winner = playerScores.player1 > playerScores.player2 ? player1Name :
                 playerScores.player2 > playerScores.player1 ? player2Name : 'It\'s a tie!';
  
  resultContainer.innerHTML = `
    <h2>Game Over</h2>
    <p>${player1Name}: ${playerScores.player1} points</p>
    <p>${player2Name}: ${playerScores.player2} points</p>
    <h3>Congoooo !!  ${winner}</h3>
  `;
};

// Player setup form submission
playerForm.onsubmit = (e) => {
  e.preventDefault();
  player1Name = document.getElementById('player1').value;
  player2Name = document.getElementById('player2').value;

  playerForm.style.display = 'none';
  categorySelection.style.display = 'none'; // Hiding
  
  fetchQuestions(); 
};