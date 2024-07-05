const instruments = [
    { name: 'ピアノ', audio: 'assets/audio/piano.mp3', image: 'assets/images/piano.png' },
    { name: 'ギター', audio: 'assets/audio/guitar.mp3', image: 'assets/images/guitar.png' },
    { name: 'ドラム', audio: 'assets/audio/drums.mp3', image: 'assets/images/drums.png' },
    { name: 'バイオリン', audio: 'assets/audio/violin.mp3', image: 'assets/images/violin.png' },
    { name: 'フルート', audio: 'assets/audio/flute.mp3', image: 'assets/images/flute.png' },
    { name: 'トランペット', audio: 'assets/audio/trumpet.mp3', image: 'assets/images/trumpet.png' },
    { name: 'サックス', audio: 'assets/audio/saxophone.mp3', image: 'assets/images/saxophone.png' },
    { name: 'ハープ', audio: 'assets/audio/harp.mp3', image: 'assets/images/harp.png' },
    { name: 'アコーディオン', audio: 'assets/audio/accordion.mp3', image: 'assets/images/accordion.png' },
    { name: 'マリンバ', audio: 'assets/audio/marimba.mp3', image: 'assets/images/marimba.png' }
];

let currentInstrument;
let score = 0;
let questionCounter = 0;
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const highScoreScreen = document.getElementById('high-score-screen');

const startGameButton = document.getElementById('start-game');
const viewHighScoresButton = document.getElementById('view-high-scores');
const playButton = document.getElementById('play-button');
const choicesContainer = document.getElementById('choices');
const resultDisplay = document.getElementById('result');
const scoreDisplay = document.getElementById('current-score');
const questionCounterDisplay = document.getElementById('current-question');
const nextButton = document.getElementById('next-button');
const finalScoreDisplay = document.getElementById('final-score');
const playAgainButton = document.getElementById('play-again');
const goHomeButton = document.getElementById('go-home');
const viewHighScoresResultButton = document.getElementById('view-high-scores-result');
const backToHomeButton = document.getElementById('back-to-home');
const highScoreList = document.getElementById('high-score-list');

function showScreen(screen) {
    homeScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    highScoreScreen.classList.add('hidden');
    screen.classList.remove('hidden');
}

function startGame() {
    score = 0;
    questionCounter = 0;
    updateScore();
    updateQuestionCounter();
    showScreen(gameScreen);
    nextQuestion();
}

function nextQuestion() {
    if (questionCounter >= 10) {
        endGame();
        return;
    }

    resultDisplay.textContent = '';
    nextButton.classList.add('hidden');
    choicesContainer.innerHTML = '';
    
    currentInstrument = getRandomInstrument();
    const choices = getChoices(currentInstrument);
    
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.classList.add('bg-blue-200', 'px-4', 'py-2', 'rounded', 'w-full', 'flex', 'items-center', 'justify-center', 'mb-2');
        button.addEventListener('click', () => checkAnswer(choice));

        const img = document.createElement('img');
        img.src = choice.image;
        img.alt = choice.name;
        img.classList.add('w-8', 'h-8', 'mr-2');

        const text = document.createElement('span');
        text.textContent = choice.name;

        button.appendChild(img);
        button.appendChild(text);
        choicesContainer.appendChild(button);
    });

    questionCounter++;
    updateQuestionCounter();
}

function getRandomInstrument() {
    return instruments[Math.floor(Math.random() * instruments.length)];
}

function getChoices(correct) {
    const choices = [correct];
    while (choices.length < 3) {
        const randomInstrument = getRandomInstrument();
        if (!choices.includes(randomInstrument)) {
            choices.push(randomInstrument);
        }
    }
    return shuffleArray(choices);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function checkAnswer(choice) {
    if (choice === currentInstrument) {
        resultDisplay.textContent = '正解！';
        score++;
        updateScore();
    } else {
        resultDisplay.textContent = `不正解。正解は${currentInstrument.name}でした。`;
    }
    nextButton.classList.remove('hidden');
}

function updateScore() {
    scoreDisplay.textContent = score;
}

function updateQuestionCounter() {
    questionCounterDisplay.textContent = questionCounter;
}

function endGame() {
    finalScoreDisplay.textContent = score;
    updateHighScores(score);
    showScreen(resultScreen);
}

function updateHighScores(score) {
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5);  // Top 5のスコアのみを保持
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function displayHighScores() {
    highScoreList.innerHTML = '';
    highScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${score}点`;
        li.classList.add('text-xl', 'mb-2');
        highScoreList.appendChild(li);
    });
    showScreen(highScoreScreen);
}

// イベントリスナー
startGameButton.addEventListener('click', startGame);
viewHighScoresButton.addEventListener('click', displayHighScores);
playButton.addEventListener('click', () => {
    const audio = new Audio(currentInstrument.audio);
    audio.play();
});
nextButton.addEventListener('click', nextQuestion);
playAgainButton.addEventListener('click', startGame);
goHomeButton.addEventListener('click', () => showScreen(homeScreen));
viewHighScoresResultButton.addEventListener('click', displayHighScores);
backToHomeButton.addEventListener('click', () => showScreen(homeScreen));

// 初期画面の表示
showScreen(homeScreen);