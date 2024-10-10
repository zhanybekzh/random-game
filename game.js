document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const modalContent = document.querySelector(".modal-content__inner");
  const historyModal = document.getElementById("historyModal");
  const playerNameInput = document.getElementById("playerName");
  const submitNameBtn = document.getElementById("submitName");
  const game = document.querySelector(".game-container");
  const greeting = document.getElementById("greeting");
  const startGameBtn = document.getElementById("startGame");
  const holes = document.querySelectorAll(".hole");
  const scoreBoard = document.querySelector(".score");
  const moles = document.querySelectorAll(".mole");
  const historyBtn = document.getElementById("historyBtn");
  const historyList = document.getElementById("historyList");
  const closeHistoryBtn = document.getElementById("closeHistoryBtn");
  let playerName = "";
  let timeUp = false;
  let score = 0;
  let lastHole;
  let gameHistory = JSON.parse(localStorage.getItem("gameHistory")) || [];

  modal.style.display = "flex";
  submitNameBtn.addEventListener("click", () => {
    playerName = playerNameInput.value.trim();
    if (playerName) {
      modalContent.innerHTML = `
        <h2 style="font-size: 45px;">Добро пожаловать, ${playerName}!</h2>
        <p style="margin-bottom: 0;"> Основные правила игры:</p><p>кликай на кротов как можно быстрее!</p>
        <button id="startGameBtn" class="btn">Начать игру</button>
      `;
      const startGameBtn = document.getElementById("startGameBtn");
      startGameBtn.addEventListener("click", () => {
        modal.style.display = "none";
        game.style.display = "block";
        greeting.textContent = `Привет, ${playerName}!`;
      });
    } else {
      alert("Пожалуйста, введите имя!");
    }
  });
  startGameBtn.addEventListener("click", startGame);
  function randTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
      return randomHole(holes);
    }
    lastHole = hole;
    return hole;
  }

  function peep() {
    const time = randTime(200, 1000);
    const hole = randomHole(holes);
    hole.classList.add("up");
    setTimeout(() => {
      hole.classList.remove("up");
      if (!timeUp) peep();
    }, time);
  }

  function startGame() {
    this.disabled = true;
    scoreBoard.textContent = 0;
    timeUp = false;
    score = 0;
    peep();
    setTimeout(() => {
      this.disabled = false;
      saveScore(score);
      timeUp = true;
    }, 10000);
  }
  function bonk(e) {
    if (!e.isTrusted) return;
    score += 1;
    this.classList.add("hit");
    setTimeout(() => this.classList.remove("hit"), 200);
    this.classList.remove("up");
    scoreBoard.textContent = score;
  }

  moles.forEach((mole) => mole.addEventListener("click", bonk));

  function saveScore(score) {
    const gameResult = {
      player: playerName,
      score: score,
      date: new Date().toLocaleString(),
    };
    gameHistory.push(gameResult);

    if (gameHistory.length > 10) {
      gameHistory.shift();
    }
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
  }

  historyBtn.addEventListener("click", () => {
    historyList.innerHTML = "";
    gameHistory.forEach((game, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${index + 1}. ${game.player} - ${
        game.score
      } очков (${game.date})`;
      historyList.appendChild(listItem);
    });
    historyModal.style.display = "flex";
  });

  closeHistoryBtn.addEventListener("click", () => {
    historyModal.style.display = "none";
  });
});
