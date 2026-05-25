/**
 * @fileoverview Space Maze Chase - Core Game Logic
 * A turn-based 8×8 space board game. The player moves one square per turn,
 * while the alien advances towards the player. The player must collect cookies,
 * avoid the alien, and reach the exit before running out of lives or steps.
 * @module game
 */

"use strict";

// Type Definitions

/**
 * Represents a position on the board.
 * @typedef {Object} Position
 * @property {number} row - Row index (0–7)
 * @property {number} col - Column index (0–7)
 */

/**
 * Represents the full game state.
 * @typedef {Object} Game
 * @property {number}          boardSize        - Size of the board (always 8)
 * @property {Position}        playerStart      - Player's default starting position
 * @property {Position}        player           - Current player position
 * @property {Position}        alien            - Current alien position
 * @property {Position}        exit             - Exit position
 * @property {Array<Position>} walls            - List of wall positions
 * @property {Array<Position>} cookies          - Remaining cookie positions
 * @property {number}          collectedCookies - Number of cookies collected so far
 * @property {number}          frozenTurns      - Turns remaining that the alien is frozen
 * @property {number}          playerMoves      - Total number of moves the player has made
 * @property {number}          lives            - Remaining lives
 * @property {number}          steps            - Remaining steps
 * @property {string}          status           - Game status: `"running"` | `"win"` | `"lose"`
 */

/**
 * Configuration options for creating a new game.
 * @typedef {Object} GameConfig
 * @property {number} [lives=3]  - Number of starting lives
 * @property {number} [steps=30] - Number of starting steps
 */


// Game Setup

/**
 * Creates a new game with a fixed 8×8 board layout, including the player,
 * alien, exit, walls, and cookies at their starting positions.
 *
 * The player starts at (row 1, col 0) and must navigate to the exit at
 * (row 0, col 7) while avoiding the alien, which begins at (row 7, col 0).
 *
 * @param {GameConfig} [config={}] - Optional configuration overrides
 * @returns {Game} A freshly initialised game ready to play
 *
 * @example
 * // Start a game with default settings (3 lives, 30 steps)
 * const game = createGame();
 * game.status;           // "running"
 * game.lives;            // 3
 * game.steps;            // 30
 *
 * @example
 * // Start a harder game with fewer lives and steps
 * const game = createGame({ lives: 1, steps: 20 });
 * game.lives;            // 1
 * game.steps;            // 20
 */
function createGame(config = {}) {
  return {
    boardSize: 8,

    playerStart: { row: 1, col: 0 },
    player: { row: 1, col: 0 },

    alien: { row: 7, col: 0 },

    exit: { row: 0, col: 7 },

    walls: [
      { row: 0, col: 3 },{ row: 1, col: 3 },{ row: 1, col: 5 },{ row: 2, col: 0 },
      { row: 2, col: 1 },{ row: 2, col: 5 },{ row: 2, col: 7 },{ row: 3, col: 3 },
      { row: 4, col: 1 },{ row: 4, col: 3 },{ row: 4, col: 5 },{ row: 5, col: 1 },
      { row: 6, col: 3 },{ row: 6, col: 4 },{ row: 6, col: 6 }
    ],

    cookies: [
      { row: 0, col: 1 },{ row: 3, col: 4 },{ row: 5, col: 2 },{ row: 7, col: 6 }
    ],

    collectedCookies: 0,
    frozenTurns: 0,
    playerMoves: 0,
    lives: config.lives ?? 3,
    steps: config.steps ?? 30,

    status: "running"
  };
}

/**
 * Restarts the game, returning all board elements to their starting positions
 * and restoring default lives and steps.
 *
 * @returns {Game} A fresh game in its default starting state
 *
 * @example
 * // Restart after losing
 * let game = nextTurn(createGame({ lives: 1 }), "right");
 * game.status;           // "lose"
 * game = resetGame();
 * game.status;           // "running"
 * game.lives;            // 3
 */
function resetGame() {
  return createGame();
}


// Player Actions

/**
 * Checks whether the player can move to a given position —
 * i.e. the position is inside the board and not blocked by a wall.
 *
 * @param {Game}     game - Current game state
 * @param {Position} pos  - The position to check
 * @returns {boolean} `true` if the position is reachable, `false` otherwise
 *
 * @example
 * // An open cell is reachable
 * isValidMove(game, { row: 3, col: 4 });  // → true
 *
 * @example
 * // A wall blocks movement
 * isValidMove(game, { row: 0, col: 3 });  // → false
 *
 * @example
 * // Outside the board is not reachable
 * isValidMove(game, { row: -1, col: 0 }); // → false
 */
function isValidMove(game, { row, col }) {
  const insideBoard =
    row >= 0 &&
    row < game.boardSize &&
    col >= 0 &&
    col < game.boardSize;

  if (!insideBoard) return false;

  return !game.walls.some(wall => wall.row === row && wall.col === col);
}

/**
 * Attempts to move the player one square in the given direction.
 * The move is ignored if the destination is a wall or outside the board.
 * Has no effect if the game has already ended.
 *
 * @param {Game}                          game      - Current game state
 * @param {"up"|"down"|"left"|"right"}    direction - Direction to move
 * @returns {Game} Updated game state with the player at the new position,
 *                 or the original state if the move was not possible
 *
 * @example
 * // Moving into an open cell succeeds
 * const game = createGame();
 * const next = movePlayer(game, "right");
 * next.player;   // { row: 1, col: 1 }
 * game.player;   // { row: 1, col: 0 } — original state is unchanged
 *
 * @example
 * // Moving into a wall is ignored
 * const blocked = movePlayer(game, "up");
 * blocked.player; // { row: 1, col: 0 } — player did not move
 */
function movePlayer(game, direction) {
  if (game.status !== "running") return game;

  let newRow = game.player.row;
  let newCol = game.player.col;

  if (direction === "up")    newRow--;
  if (direction === "down")  newRow++;
  if (direction === "left")  newCol--;
  if (direction === "right") newCol++;

  if (!isValidMove(game, { row: newRow, col: newCol })) return game;

  return {
    ...game,
    player: { row: newRow, col: newCol }
  };
}

// Game Mechanics

/**
 * Advances the game by one full turn in response to the player's chosen direction.
 *
 * Each turn the player moves, picks up any cookie on their new square,
 * and is checked for a collision with the alien. If the player reaches the exit
 * they win immediately. The alien then takes a step every two player moves,
 * after which collisions are checked again. The player's step count decreases
 * by one; if no steps or lives remain, the game is lost.
 *
 * Has no effect if the game has already ended.
 *
 * @param {Game}                          game      - Current game state
 * @param {"up"|"down"|"left"|"right"}    direction - Player's chosen direction
 * @returns {Game} New game state after the turn resolves
 *
 * @example
 * // A normal turn moves the player and spends a step
 * const game = createGame();
 * const next = nextTurn(game, "right");
 * next.player;   // { row: 1, col: 1 }
 * next.steps;    // 29
 *
 * @example
 * // Reaching the exit ends the game immediately
 * // (assuming the player is one step away from the exit)
 * const atExit = nextTurn(nearExitGame, "right");
 * atExit.status; // "win"
 */
function nextTurn(game, direction) {
  if (game.status !== "running") return game;

  const moved = movePlayer(game, direction);
  
  // 如果玩家没有移动（撞墙或出界），不消耗步数
  if (moved.player.row === game.player.row && moved.player.col === game.player.col) {
    return game;
  }

  let state = { ...moved, playerMoves: moved.playerMoves + 1 };

  state = collectCookie(state);
  state = checkCollision(state);

  if (checkWin(state)) {
    return { ...state, status: "win" };
  }

  if (state.playerMoves % 2 === 0) {
    state = moveAlien(state);
    state = checkCollision(state);
  }

  state = { ...state, steps: state.steps - 1 };

  if (checkLose(state)) {
    return { ...state, status: "lose" };
  }

  return state;
}

/**
 * Moves the alien one step closer to the player.
 * The alien can pass through walls and moves along whichever axis
 * has the greater distance to the player.
 *
 * Has no effect if the game has already ended.
 *
 * @param {Game} game - Current game state
 * @returns {Game} Updated game state with the alien's new position
 *
 * @example
 * // Alien moves one step closer to the player each time it acts
 * const game = createGame();
 * // alien starts at { row: 7, col: 0 }, player at { row: 1, col: 0 }
 * const next = moveAlien(game);
 * next.alien;    // { row: 6, col: 0 } — moved up toward the player
 *
 */
function moveAlien(game) {
  if (game.status !== "running") return game;

  if (game.frozenTurns > 0) {
    return { ...game, frozenTurns: game.frozenTurns - 1 };
  }

  let newRow = game.alien.row;
  let newCol = game.alien.col;

  const rowDiff = game.player.row - game.alien.row;
  const colDiff = game.player.col - game.alien.col;

  if (Math.abs(rowDiff) >= Math.abs(colDiff)) {
    newRow += Math.sign(rowDiff);
  } else {
    newCol += Math.sign(colDiff);
  }

  const insideBoard =
    newRow >= 0 &&
    newRow < game.boardSize &&
    newCol >= 0 &&
    newCol < game.boardSize;

  if (!insideBoard) return game;

  return {
    ...game,
    alien: { row: newRow, col: newCol }
  };
}

/**
 * Picks up a cookie if the player is standing on one,
 * adding it to the player's collection.
 * Has no effect if there is no cookie at the player's current position.
 *
 * @param {Game} game - Current game state
 * @returns {Game} Updated game state with one fewer cookie on the board
 *                 and the collected count incremented,
 *                 or the original state if no cookie was present
 *
 * @example
 * // Player lands on a cookie square
 * const withCookie = { ...createGame(), player: { row: 0, col: 1 } };
 * const next = collectCookie(withCookie);
 * next.collectedCookies; // 1
 * next.cookies.length;   // 3 — one fewer remaining
 *
 * @example
 * // No cookie at the player's position — state is unchanged
 * const noCookie = collectCookie(createGame());
 * noCookie.collectedCookies; // 0
 */
function collectCookie(game) {
  const index = game.cookies.findIndex(
    cookie =>
      cookie.row === game.player.row &&
      cookie.col === game.player.col
  );

  if (index === -1) return game;

  return {
    ...game,
    cookies: game.cookies.filter((_, i) => i !== index),
    collectedCookies: game.collectedCookies + 1
  };
}

/**
 * Checks whether the alien has caught the player.
 * If so, the player loses one life and is returned to their starting position.
 * If no lives remain, the game ends immediately with a loss.
 * Has no effect if the player and alien are not on the same square.
 *
 * @param {Game} game - Current game state
 * @returns {Game} Updated game state with one fewer life and the player
 *                 repositioned, or the game ended if no lives remain,
 *                 or the original state if no collision occurred
 *
 * @example
 * // Player and alien share a square — player loses a life and respawns
 * const caught = { ...createGame(), player: { row: 7, col: 0 } };
 * const next = checkCollision(caught);
 * next.lives;    // 2
 * next.player;   // { row: 1, col: 0 } — back at start
 *
 * @example
 * // Last life lost — game ends
 * const lastLife = { ...createGame(), lives: 1, player: { row: 7, col: 0 } };
 * const next = checkCollision(lastLife);
 * next.status;   // "lose"
 */
function checkCollision(game) {
  const caught =
    game.player.row === game.alien.row &&
    game.player.col === game.alien.col;

  if (!caught) return game;

  const newLives = game.lives - 1;

  if (newLives <= 0) {
    return { ...game, lives: newLives, status: "lose" };
  }

  return {
    ...game,
    lives: newLives,
    player: { ...game.playerStart }
  };
}


// Game State

/**
 * Returns `true` if the player has reached the exit.
 *
 * @param {Game} game - Current game state
 * @returns {boolean} `true` if the player is on the exit square, `false` otherwise
 *
 * @example
 * // Player has not yet reached the exit
 * checkWin(createGame()); // → false
 *
 * @example
 * // Player is on the exit square
 * const atExit = { ...createGame(), player: { row: 0, col: 7 } };
 * checkWin(atExit);       // → true
 */
function checkWin(game) {
  return (
    game.player.row === game.exit.row &&
    game.player.col === game.exit.col
  );
}

/**
 * Returns `true` if the game is over due to the player having no lives
 * or no steps remaining.
 *
 * @param {Game} game - Current game state
 * @returns {boolean} `true` if the player has lost, `false` otherwise
 *
 * @example
 * // Game still in progress
 * checkLose(createGame()); // → false
 *
 * @example
 * // No steps remaining
 * const noSteps = { ...createGame(), steps: 0 };
 * checkLose(noSteps);      // → true
 *
 * @example
 * // No lives remaining
 * const noLives = { ...createGame(), lives: 0 };
 * checkLose(noLives);      // → true
 */
function checkLose(game) {
  return game.lives <= 0 || game.steps <= 0;
}

/**
 * Returns a summary of the current game state, including the positions of
 * all key entities, the player's remaining resources, and the overall status.
 *
 * @param {Game} game - Current game state
 * @returns {{
 *   player:           Position,
 *   alien:            Position,
 *   exit:             Position,
 *   lives:            number,
 *   steps:            number,
 *   collectedCookies: number,
 *   remainingCookies: number,
 *   frozenTurns:      number,
 *   playerMoves:      number,
 *   status:           string
 * }} A snapshot of the current game state
 *
 * @example
 * // Inspect the state at the start of a game
 * const state = getGameState(createGame());
 * state.status;           // "running"
 * state.lives;            // 3
 * state.remainingCookies; // 4
 * state.collectedCookies; // 0
 */
function getGameState(game) {
  return {
    player: game.player,
    alien: game.alien,
    exit: game.exit,
    lives: game.lives,
    steps: game.steps,
    collectedCookies: game.collectedCookies,
    remainingCookies: game.cookies.length,
    frozenTurns: game.frozenTurns,
    playerMoves: game.playerMoves,
    status: game.status
  };
}

// --- Browser bundle entry ---
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