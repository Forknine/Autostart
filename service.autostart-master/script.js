const BOARD_SIZE = 8;
const TOTAL_CARDS = BOARD_SIZE * BOARD_SIZE;
const MATCHES_REQUIRED = TOTAL_CARDS / 2;
const SYMBOLS = [
  "😺",
  "🦊",
  "🐵",
  "🐸",
  "🐼",
  "🐷",
  "🐮",
  "🐻",
  "🐰",
  "🦄",
  "🐙",
  "🦉",
  "🐶",
  "🐹",
  "🐨",
  "🐥",
  "🐔",
  "🦕",
  "🦖",
  "🐝",
  "🐢",
  "🐞",
  "🐧",
  "🦓",
  "🦁",
  "🐯",
  "🐲",
  "👾",
  "🤖",
  "👽",
  "💩",
  "🎃"
];

if (SYMBOLS.length < MATCHES_REQUIRED) {
  throw new Error("Not enough symbols to create the deck");
}

const boardEl = document.getElementById("board");
const moveCountEl = document.getElementById("move-count");
const matchCountEl = document.getElementById("match-count");
const timeElapsedEl = document.getElementById("time-elapsed");
const messageEl = document.getElementById("game-message");
const restartBtn = document.getElementById("restart");

let gameState;

function createDeck() {
  const selectedSymbols = SYMBOLS.slice(0, MATCHES_REQUIRED);
  const pairedSymbols = selectedSymbols.flatMap((symbol) => [symbol, symbol]);
  return shuffle(pairedSymbols).map((symbol, index) => ({
    id: `${symbol}-${index}`,
    symbol
  }));
}

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function initGame() {
  clearBoard();
  gameState = {
    deck: createDeck(),
    flippedCards: [],
    matches: 0,
    moves: 0,
    lockBoard: false,
    startTime: null,
    timerId: null
  };

  updateScoreboard();
  messageEl.textContent = "";
  renderBoard();
}

function clearBoard() {
  stopTimer();
  while (boardEl.firstChild) {
    boardEl.removeChild(boardEl.firstChild);
  }
}

function renderBoard() {
  boardEl.style.setProperty("--columns", BOARD_SIZE);
  boardEl.setAttribute("aria-live", "polite");

  gameState.deck.forEach((cardData) => {
    const button = document.createElement("button");
    button.className = "card";
    button.dataset.symbol = cardData.symbol;
    button.dataset.cardId = cardData.id;
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "Hidden card");

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const front = document.createElement("div");
    front.className = "card-face card-front";

    const back = document.createElement("div");
    back.className = "card-face card-back";
    back.textContent = cardData.symbol;

    inner.append(front, back);
    button.append(inner);
    button.addEventListener("click", () => handleCardFlip(button));
    boardEl.append(button);
  });
}

function handleCardFlip(card) {
  if (gameState.lockBoard || card.classList.contains("flipped") || card.classList.contains("matched")) {
    return;
  }

  if (!gameState.startTime) {
    startTimer();
  }

  card.classList.add("flipped");
  card.setAttribute("aria-pressed", "true");
  card.setAttribute("aria-label", `Card showing ${card.dataset.symbol}`);
  gameState.flippedCards.push(card);

  if (gameState.flippedCards.length === 2) {
    gameState.lockBoard = true;
    gameState.moves += 1;
    updateScoreboard();
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = gameState.flippedCards;

  if (first.dataset.symbol === second.dataset.symbol) {
    first.classList.add("matched");
    second.classList.add("matched");
    first.disabled = true;
    second.disabled = true;
    gameState.matches += 1;
    messageEl.textContent = getCelebrationMessage(gameState.matches);
    gameState.flippedCards = [];
    gameState.lockBoard = false;
    updateScoreboard();
    checkForWin();
  } else {
    setTimeout(() => {
      first.classList.remove("flipped");
      second.classList.remove("flipped");
      first.setAttribute("aria-pressed", "false");
      second.setAttribute("aria-pressed", "false");
      first.setAttribute("aria-label", "Hidden card");
      second.setAttribute("aria-label", "Hidden card");
      gameState.flippedCards = [];
      gameState.lockBoard = false;
    }, 800);
  }
}

function checkForWin() {
  if (gameState.matches === MATCHES_REQUIRED) {
    stopTimer();
    const totalTime = Math.floor((Date.now() - gameState.startTime) / 1000);
    messageEl.textContent = `You matched every cartoon buddy in ${gameState.moves} moves and ${totalTime} seconds!`;
  }
}

function updateScoreboard() {
  moveCountEl.textContent = gameState.moves;
  matchCountEl.textContent = gameState.matches;
}

function startTimer() {
  gameState.startTime = Date.now();
  gameState.timerId = setInterval(() => {
    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    timeElapsedEl.textContent = elapsed;
  }, 1000);
}

function stopTimer() {
  if (gameState?.timerId) {
    clearInterval(gameState.timerId);
  }
  timeElapsedEl.textContent = gameState?.startTime ? Math.floor((Date.now() - gameState.startTime) / 1000) : 0;
}

function getCelebrationMessage(matches) {
  const cheers = [
    "Sweet match!",
    "Cartoon buddies reunited!",
    "Smiles all around!",
    "High-five those heroes!",
    "Toon-tastic memory!"
  ];
  if (matches === MATCHES_REQUIRED) {
    return "Final pair complete!";
  }
  return cheers[matches % cheers.length];
}

restartBtn.addEventListener("click", initGame);

initGame();
