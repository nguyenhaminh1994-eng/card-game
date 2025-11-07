const gameBoard = document.getElementById("game-board");
const timerDisplay = document.getElementById("timer");
const bestScoreDisplay = document.getElementById("best-score");
const restartBtn = document.getElementById("restart-btn");
const finalImage = document.getElementById("final-image");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let timer = 0;
let timerInterval;
let gameRunning = false;

const images = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
];

let cardsArray = [...images, ...images];

// 🔹 Hàm trộn bài
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 🔹 Bắt đầu game
function startGame() {
  gameBoard.innerHTML = "";
  finalImage.style.display = "none";
  matchedPairs = 0;
  timer = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  gameRunning = true;

  timerDisplay.textContent = `Thời gian: 0s`;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Thời gian: ${timer}s`;
  }, 1000);

  shuffle(cardsArray);
  cardsArray.forEach((img) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = img;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back"><img src="images/${img}" alt=""></div>
      </div>
    `;

    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
}

// 🔹 Lật thẻ
function flipCard() {
  if (!gameRunning || lockBoard || this === firstCard || this.style.visibility === "hidden") return;

  this.classList.add("flip");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

// 🔹 Kiểm tra ghép đúng/sai
function checkMatch() {
  if (firstCard.dataset.name === secondCard.dataset.name) {
    correctMatch();
  } else {
    wrongMatch();
  }
}

// 🔹 Khi ghép đúng
function correctMatch() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.add("fade-out");
    secondCard.classList.add("fade-out");

    setTimeout(() => {
      firstCard.style.visibility = "hidden";
      secondCard.style.visibility = "hidden";

      matchedPairs++;
      resetTurn();
      lockBoard = false;

      if (matchedPairs === images.length) gameOver();
    }, 400);
  }, 200);
}

// 🔹 Khi ghép sai
function wrongMatch() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetTurn();
    lockBoard = false;
  }, 800);
}

// 🔹 Reset lượt
function resetTurn() {
  firstCard = null;
  secondCard = null;
}

// 🔹 Kết thúc game
function gameOver() {
  gameRunning = false;
  clearInterval(timerInterval);

  // Hiện hình final
  finalImage.style.display = "block";

  // Lưu thời gian nhanh nhất
  let bestTime = localStorage.getItem("bestTime");
  bestTime = bestTime ? parseInt(bestTime) : Infinity;

  if (timer < bestTime) {
    localStorage.setItem("bestTime", timer);
    bestTime = timer;
  }

  bestScoreDisplay.textContent = `Thời gian nhanh nhất: ${bestTime}s`;
}

// 🔹 Nút chơi lại
// restartBtn.addEventListener("click", () => {
//   startGame();
// });

// 🔹 Khi load trang, hiển thị best time và bắt đầu game
window.onload = () => {
  const bestTime = localStorage.getItem("bestTime") || "-";
  bestScoreDisplay.textContent = bestTime !== "-" 
    ? `Thời gian nhanh nhất: ${bestTime}s` 
    : "Thời gian nhanh nhất: -";
  startGame();
};
