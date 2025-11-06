const gameBoard = document.getElementById("game-board");
const timerDisplay = document.getElementById("timer");
const bestScoreDisplay = document.getElementById("best-score");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let timer = 0;
let timerInterval;

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

// Trộn bài
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Khởi tạo game
function startGame() {
  gameBoard.innerHTML = "";
  matchedPairs = 0;
  timer = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
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

// Lật thẻ
function flipCard() {
  if (lockBoard || this === firstCard || this.style.visibility === "hidden") return;

  this.classList.add("flip");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

// Kiểm tra ghép cặp
function checkMatch() {
  if (firstCard.dataset.name === secondCard.dataset.name) {
    correctMatch();
  } else {
    wrongMatch();
  }
}

// Ghép đúng
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

// Ghép sai
function wrongMatch() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetTurn();
    lockBoard = false;
  }, 800);
}

// Reset lượt
function resetTurn() {
  firstCard = null;
  secondCard = null;
}

// Kết thúc game
function gameOver() {
  clearInterval(timerInterval);

  // Lưu thời gian nhanh nhất
  let bestTime = localStorage.getItem("bestTime");
  bestTime = bestTime ? parseInt(bestTime) : Infinity;

  if (timer < bestTime) {
    localStorage.setItem("bestTime", timer);
    bestTime = timer;
  }

  bestScoreDisplay.textContent = `Thời gian nhanh nhất: ${bestTime}s`;

  setTimeout(() => {
    alert(`Hoàn thành! Thời gian: ${timer}s`);
    startGame();
  }, 500);
}

// Load thời gian nhanh nhất khi mở trang
window.onload = () => {
  const bestTime = localStorage.getItem("bestTime") || "-";
  bestScoreDisplay.textContent = bestTime !== "-" 
    ? `Thời gian nhanh nhất: ${bestTime}s` 
    : "Thời gian nhanh nhất: -";
  startGame();
};

// Kết thúc game
function gameOver() {
  clearInterval(timerInterval);

  // Lưu thời gian nhanh nhất
  let bestTime = localStorage.getItem("bestTime");
  bestTime = bestTime ? parseInt(bestTime) : Infinity;

  if (timer < bestTime) {
    localStorage.setItem("bestTime", timer);
    bestTime = timer;
  }

  bestScoreDisplay.textContent = `Thời gian nhanh nhất: ${bestTime}s`;

  // 🔥 Hiện hình hoàn thành
  const finalImageContainer = document.getElementById("final-image-container");
  const finalImage = document.getElementById("final-image");

  finalImageContainer.style.display = "block";

  // Hiện mờ dần
  setTimeout(() => {
    finalImage.classList.add("show");
  }, 200);

  // Sau vài giây hiện thông báo & chơi lại
  setTimeout(() => {
    alert(`Hoàn thành! Thời gian: ${timer}s`);
    finalImage.classList.remove("show");
    finalImageContainer.style.display = "none";
    startGame();
  }, 5000); // Hiện hình trong 5 giây
}