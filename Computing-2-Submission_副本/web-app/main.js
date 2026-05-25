import {
  createGame,
  nextTurn,
  getGameState
} from "./game.js";

const TOTAL_COOKIES = 4;
const BOARD_SIZE = 8;
const MAX_LIVES = 3;
const HEART_SRC = "assets/items/heart.png";
const COOKIE_HUD_SRC = "assets/items/cookie.png";

// Map of different levels
const LEVELS = [
  {
    //Level 1
    walls: [
      { row: 0, col: 3 },{ row: 1, col: 3 }, { row: 1, col: 5 },
      { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 5 }, { row: 2, col: 7 },
      { row: 3, col: 3 },{ row: 4, col: 1 }, { row: 4, col: 3 }, { row: 4, col: 5 },
      { row: 5, col: 1 },{ row: 6, col: 3 }, { row: 6, col: 4 }, { row: 6, col: 6 }
    ],
    cookies: [
      { row: 0, col: 1 }, { row: 3, col: 4 }, { row: 5, col: 2 }, { row: 7, col: 6 }
    ],
    playerStart: { row: 1, col: 0 },
    alien: { row: 7, col: 0 },
    exit: { row: 0, col: 7 }
  },
  {
    //Level 2
    walls: [
      { row: 0, col: 4 }, { row: 0, col: 5 }, { row: 0, col: 6 },{ row: 1, col: 1 }, { row: 1, col: 6 },
      { row: 2, col: 1 }, { row: 2, col: 3 }, { row: 2, col: 4 }, { row: 2, col: 6 },{ row: 3, col: 1 }, 
      { row: 3, col: 6 },{ row: 4, col: 1 }, { row: 4, col: 3 }, { row: 4, col: 4 }, { row: 4, col: 6 },
      { row: 5, col: 1 }, { row: 5, col: 6 },{ row: 6, col: 1 }, { row: 6, col: 2 }, { row: 6, col: 3 }, 
      { row: 6, col: 4 },{ row: 7, col: 4 }
    ],
    cookies: [
      { row: 0, col: 2 }, { row: 3, col: 3 }, { row: 5, col: 5 }, { row: 7, col: 1 }
    ],
    playerStart: { row: 0, col: 0 },
    alien: { row: 7, col: 7 },
    exit: { row: 7, col: 6 }
  },
  {
    //Level 3
    walls: [
      { row: 0, col: 2 },{ row: 1, col: 2 }, { row: 1, col: 4 }, { row: 1, col: 6 },
      { row: 2, col: 4 }, { row: 2, col: 6 },{ row: 3, col: 0 }, { row: 3, col: 1 }, { row: 3, col: 4 },
      { row: 4, col: 4 }, { row: 4, col: 6 },{ row: 5, col: 2 }, { row: 5, col: 4 }, { row: 5, col: 6 },
      { row: 6, col: 2 },{ row: 7, col: 2 }, { row: 7, col: 4 }, { row: 7, col: 5 }
    ],
    cookies: [
      { row: 0, col: 7 }, { row: 2, col: 1 }, { row: 4, col: 5 }, { row: 6, col: 7 }
    ],
    playerStart: { row: 0, col: 0 },
    alien: { row: 7, col: 7 },
    exit: { row: 7, col: 0 }
  },
   {
    //Level 4
    walls: [
      { row: 1, col: 1 }, { row: 1, col: 3 }, { row: 1, col: 5 }, { row: 1, col: 7 },
      { row: 2, col: 2 }, { row: 2, col: 6 },{ row: 3, col: 0 }, { row: 3, col: 4 },
      { row: 4, col: 2 }, { row: 4, col: 4 }, { row: 4, col: 6 },{ row: 5, col: 0 }, 
      { row: 5, col: 3 }, { row: 5, col: 7 },{ row: 6, col: 1 }, { row: 6, col: 5 },
      { row: 7, col: 3 }
    ],
    cookies: [
      { row: 0, col: 3 }, { row: 3, col: 6 }, { row: 5, col: 2 }, { row: 7, col: 7 }
    ],
    playerStart: { row: 0, col: 0 },
    alien: { row: 4, col: 0 },
    exit: { row: 7, col: 0 }
  },
];


// Game state

let currentLevel = 0;
let game = createGameForLevel(currentLevel);

function createGameForLevel(level) {
  const L = LEVELS[level];
  return {
    ...createGame({ lives: 3, steps: 40 }),
    walls:       L.walls.filter(Boolean).map(w => ({ ...w })),
    cookies:     L.cookies.map(c => ({ ...c })),
    playerStart: { ...L.playerStart },
    player:      { ...L.playerStart },
    alien:       { ...L.alien },
    exit:        { ...L.exit }
  };
}


// Audio

const bgMusic = new Audio("assets/music/supershy.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.1;

const coinSound = new Audio("assets/music/pickupCoin.wav");
coinSound.volume = 0.3;
function playCookieSound() {
  coinSound.currentTime = 0;
  coinSound.play().catch(() => {});
}

const failSound = new Audio("assets/music/gameover.mp3");
failSound.volume = 0.3;

const hurtSound = new Audio("assets/music/Hurt.wav");
hurtSound.volume = 0.3;
function playHurtSound() {
  hurtSound.currentTime = 0;
  hurtSound.play().catch(() => {});
}

const levelUpSound = new Audio("assets/music/levelup.mp3");
levelUpSound.volume = 0.3;

let audioStarted = false;
function startAudio() {
  if (!audioStarted) {
    bgMusic.play().catch(() => {});
    audioStarted = true;
  }
}

const musicToggleBtn = document.getElementById("music-toggle");
musicToggleBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    musicToggleBtn.textContent = "🔊";
  } else {
    bgMusic.pause();
    musicToggleBtn.textContent = "🔇";
  }
});

// DOM references

const boardEl      = document.getElementById("board");
const stepsEl      = document.getElementById("steps-count");
const hudLivesEl   = document.getElementById("hud-lives");
const hudCookiesEl = document.getElementById("hud-cookies");
const overlayEl    = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayCookies = document.getElementById("overlay-cookies");
const overlaySub   = document.getElementById("overlay-sub");
const resetBtn     = document.getElementById("reset-button");


// Board generation — runs once, creates all 64 cells

function buildBoard() {
  boardEl.innerHTML = "";
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.setAttribute("role", "gridcell");
      boardEl.appendChild(cell);
    }
  }
}

// Render — updates cell classes to reflect current game state

function hasPosition(list, row, col) {
  return list.some(p => p.row === row && p.col === col);
}

function renderBoard() {
  const state = getGameState(game);

  boardEl.querySelectorAll(".cell").forEach(cell => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    cell.className = "cell";

    if (hasPosition(game.walls, row, col)) {
      cell.classList.add("cell--wall");
    } else if (row === game.exit.row && col === game.exit.col) {
      cell.classList.add("cell--exit");
    } else if (hasPosition(game.cookies, row, col)) {
      cell.classList.add("cell--cookie");
    }

    if (row === game.alien.row && col === game.alien.col) {
      cell.classList.add("cell--alien");
    }

    if (row === game.player.row && col === game.player.col) {
      cell.classList.add("cell--player");
    }

    // ARIA label for screen readers
    cell.setAttribute("aria-label", getCellLabel(row, col));
  });
}

function getCellLabel(row, col) {
  if (game.player.row === row && game.player.col === col) return "Player";
  if (game.alien.row  === row && game.alien.col  === col) return "Alien";
  if (game.exit.row   === row && game.exit.col   === col) return "Exit";
  if (hasPosition(game.cookies, row, col)) return "Cookie";
  if (hasPosition(game.walls,   row, col)) return "Wall";
  return "Empty";
}


function renderHUD() {
  stepsEl.textContent = game.steps;

  // Hearts
  hudLivesEl.innerHTML = "";
  for (let i = 0; i < MAX_LIVES; i++) {
    const img = document.createElement("img");
    img.src = HEART_SRC;
    img.alt = i < game.lives ? "life" : "lost life";
    img.className = "hud__icon" + (i < game.lives ? "" : " hud__icon--dim");
    hudLivesEl.appendChild(img);
  }

  hudCookiesEl.innerHTML = "";
  for (let i = 0; i < TOTAL_COOKIES; i++) {
    const img = document.createElement("img");
    img.src = COOKIE_HUD_SRC;
    img.alt = i < game.collectedCookies ? "cookie collected" : "cookie remaining";
    img.className = "hud__icon hud__icon--cookie" +
      (i < game.collectedCookies ? "" : " hud__icon--dim");
    hudCookiesEl.appendChild(img);
  }
  const countSpan = document.createElement("span");
  countSpan.className = "hud__cookie-count";
  countSpan.textContent = `${game.collectedCookies}/${TOTAL_COOKIES}`;
  hudCookiesEl.appendChild(countSpan);
}

// Overlay — win / lose message centred over the board

function renderStatus() {
  if (game.status === "win") {
    const perfect = game.collectedCookies >= TOTAL_COOKIES;

    overlayTitle.textContent = perfect ? "🎉 You Win!" : "You Escaped!";
    overlayTitle.className = "overlay__title overlay__title--win";

    overlayCookies.innerHTML = "";
    for (let i = 0; i < TOTAL_COOKIES; i++) {
      const img = document.createElement("img");
      img.src = COOKIE_HUD_SRC;
      img.alt = i < game.collectedCookies ? "collected" : "missed";
      img.className = "overlay__cookie-icon" +
        (i < game.collectedCookies ? "" : " overlay__cookie-icon--dim");
      overlayCookies.appendChild(img);
    }

    const nextHint = currentLevel < LEVELS.length - 1
      ? "Press N — next level  |  R — restart"
      : "All levels done!  Press R to play again";
    overlaySub.textContent = `${game.collectedCookies}/${TOTAL_COOKIES} cookies  •  ${nextHint}`;

    if (!overlayEl.classList.contains("is-visible")) {
      levelUpSound.currentTime = 0;
      levelUpSound.play().catch(() => {});
    }
    overlayEl.classList.add("is-visible");

  } else if (game.status === "lose") {
    overlayTitle.textContent = "💀 Game Over";
    overlayTitle.className = "overlay__title overlay__title--lose";
    overlayCookies.innerHTML = "";
    overlaySub.textContent = "No lives or steps left.  Press R to restart.";
    if (!overlayEl.classList.contains("is-visible")) {
      failSound.currentTime = 0;
      failSound.play().catch(() => {});
    }
    overlayEl.classList.add("is-visible");

  } else {
    overlayEl.classList.remove("is-visible");
  }
}

// Full render

function render() {
  renderBoard();
  renderHUD();
  renderStatus();
}


// Input

const KEY_DIRECTION = {
  ArrowUp:    "up",
  ArrowDown:  "down",
  ArrowLeft:  "left",
  ArrowRight: "right"
};

document.addEventListener("keydown", handleKey);

function handleKey(event) {
  startAudio();

  // Next level
  if ((event.key === "n" || event.key === "N") && game.status === "win") {
    if (currentLevel < LEVELS.length - 1) {
      currentLevel++;
      game = createGameForLevel(currentLevel);
      render();
    }
    return;
  }

  // Restart
  if (event.key === "r" || event.key === "R") {
    game = createGameForLevel(currentLevel);
    render();
    return;
  }

  if (game.status !== "running") return;

  const direction = KEY_DIRECTION[event.key];
  if (!direction) return;

  // Prevent page scrolling with arrow keys
  event.preventDefault();

  const cookiesBefore = game.collectedCookies;
  const livesBefore = game.lives;

  game = nextTurn(game, direction);

  if (game.collectedCookies > cookiesBefore) playCookieSound();
  if (game.lives < livesBefore) playHurtSound();
  console.log(getGameState(game));
  render();
}

// Reset button
resetBtn.addEventListener("click", () => {
  game = createGameForLevel(currentLevel);
  render();
  boardEl.focus();
});


// Boot

buildBoard();
render();
boardEl.focus();