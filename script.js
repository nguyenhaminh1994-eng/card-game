// ===== CONFIG =====
const ROWS = 3;
const COLS = 4;
const TOTAL = ROWS * COLS; // 12 tiles

// elements
const gameBoard = document.getElementById('game-board');
const finalFull = document.getElementById('final-full');
const restartBtn = document.getElementById('restart-btn');
const timerDisplay = document.getElementById('timer');
const bestScoreDisplay = document.getElementById('best-score');

// state
let deck = [];       // list of ids 1..6 duplicated to fill 12 tiles
let assigned = [];   // assigned faceup id per position (length 12)
let opened = [];     // opened cards (up to 2)
let lock = false;
let matched = 0;
let timer = 0;
let timerInterval = null;
let timerRunning = false;

// images settings
const facedownSrc = 'images/facedown.png';   // ← THÊM THEO YÊU CẦU
const faceupSources = [
  'images/faceup_1.png',
  'images/faceup_2.png',
  'images/faceup_3.png',
  'images/faceup_4.png',
  'images/faceup_5.png',
  'images/faceup_6.png'
];

// piece images under images/piece_final/piece_1.png .. piece_12.png
function piecePath(index){ // index 1..12
  return `images/piece_final/piece_${index}.png`;
}

// shuffle helper
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// START GAME
function startGame(){
  // reset
  gameBoard.innerHTML = '';
  finalFull.classList.remove('show');
  finalFull.style.display = 'none';
  opened = [];
  lock = false;
  matched = 0;
  stopTimer();
  timer = 0;
  timerRunning = false;
  updateTimerDisplay(0);
  updateBestDisplay();

  // build faceup pool
  deck = [];
  for(let i=1;i<=6;i++) deck.push(i);
  deck = [...deck, ...deck];
  shuffle(deck);

  assigned = deck.slice();

  // create cards
  for(let pos=0; pos<TOTAL; pos++){
    const id = assigned[pos];
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.pos = pos;
    card.dataset.face = id;

    const inner = document.createElement('div');
    inner.className = 'card-inner';

    // ---- FRONT (facedown.png) ----
    const front = document.createElement('div');
    front.className = 'face front';
    const fimg = document.createElement('img');
    fimg.src = facedownSrc;   // ← SỬ DỤNG facedown.png
    fimg.alt = 'facedown';
    front.appendChild(fimg);

    // ---- BACK (faceup) ----
    const back = document.createElement('div');
    back.className = 'face back';
    const bimg = document.createElement('img');
    bimg.src = faceupSources[id - 1];
    bimg.alt = `faceup ${id}`;
    back.appendChild(bimg);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', () => onCardClick(card));

    gameBoard.appendChild(card);
  }
}

// CLICK HANDLER
function onCardClick(card){
  if(lock) return;
  if(card.classList.contains('flip') || card.classList.contains('matched')) return;

  if(!timerRunning){
    startTimer();
    timerRunning = true;
  }

  card.classList.add('flip');
  opened.push(card);

  if(opened.length === 2){
    lock = true;
    setTimeout(checkPair, 600);
  }
}

// CHECK PAIR
function checkPair(){
  const [a,b] = opened;
  if(!a || !b){ opened = []; lock = false; return; }

  const faceA = a.dataset.face;
  const faceB = b.dataset.face;

  if(faceA === faceB){
    a.classList.add('matched');
    b.classList.add('matched');

    const posA = parseInt(a.dataset.pos, 10);
    const posB = parseInt(b.dataset.pos, 10);

    const backImgA = a.querySelector('.face.back img');
    const backImgB = b.querySelector('.face.back img');

    backImgA.src = piecePath(posA + 1);
    backImgB.src = piecePath(posB + 1);

    matched += 2;

    if(matched === TOTAL){
      stopTimer();
      trySaveBestTime(timer);
      setTimeout(()=> revealFull(), 450);
    }
  } else {
    a.classList.remove('flip');
    b.classList.remove('flip');
  }

  opened = [];
  lock = false;
}

// SHOW FINAL IMAGE
function revealFull(){
  const cards = document.querySelectorAll('.card');
  cards.forEach(c => {
    c.style.transition = 'opacity 0.35s';
    c.style.opacity = '0';
  });

  setTimeout(()=>{
    cards.forEach(c => c.style.display = 'none');
    finalFull.style.display = 'block';
    finalFull.classList.add('show');
  }, 360);
}

// TIMER
function startTimer(){
  if(timerInterval) return;
  timerInterval = setInterval(()=>{
    timer++;
    updateTimerDisplay(timer);
  }, 1000);
}
function stopTimer(){
  if(timerInterval){ clearInterval(timerInterval); timerInterval = null; }
}
function updateTimerDisplay(sec){
  timerDisplay.textContent = `Thời gian: ${sec}s`;
}
function trySaveBestTime(sec){
  const key = 'bestTime';
  let best = localStorage.getItem(key);
  best = best ? parseInt(best,10) : Infinity;
  if(sec < best){
    localStorage.setItem(key, sec);
    bestScoreDisplay.textContent = `Thời gian nhanh nhất: ${sec}s`;
  } else if(best !== Infinity){
    bestScoreDisplay.textContent = `Thời gian nhanh nhất: ${best}s`;
  }
}
function updateBestDisplay(){
  const key = 'bestTime';
  const best = localStorage.getItem(key);
  bestScoreDisplay.textContent = best ? `Thời gian nhanh nhất: ${best}s` : 'Thời gian nhanh nhất: -';
}

// RESTART
restartBtn.addEventListener('click', ()=>{
  const cards = document.querySelectorAll('.card');
  cards.forEach(c => {
    c.style.display = '';
    c.style.opacity = '';
    c.className = 'card';
  });
  finalFull.classList.remove('show');
  finalFull.style.display = 'none';
  startGame();
});

// initial
startGame();
window.addEventListener('resize', ()=>{});
