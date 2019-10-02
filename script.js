// To set up class and constructor for all the sounds
class AudioController {
  constructor() {
    this.bgMusic = new Audio("Assets/Audio/creepy.mp3");
    this.flipSound = new Audio("Assets/Audio/flip.wav");
    this.matchSound = new Audio("Assets/Audio/match.wav");
    this.victorySound = new Audio("Assets/Audio/victory.wav");
    this.gameOverSound = new Audio("Assets/Audio/gameover.wav");
    this.bgMusic.volume = 0.5;
    this.bgMusic.loop = true;
  }

  // To start BGM when game starts
  startMusic() {
    this.bgMusic.play();
  }

  // To stop music when it is required and start music from top
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }

  // Sound for when each card is flipped
  flip() {
    this.flipSound.play();
  }

  // Sound for when there's a match
  match() {
    this.matchSound.play();
  }

  // Stop bgm and plays victory bgm when game is won
  victory() {
    this.stopMusic();
    this.victorySound.play();
  }

  // Stop bgm and plays game over bgm when timer is up
  gameOver() {
    this.stopMusic();
    this.gameOverSound.play();
  }
}

// Setting up class and all the functions to run the game
class MixOrMatch {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.timer = document.getElementById("time-remaining");
    this.ticker = document.getElementById("flips");
    this.audioController = new AudioController();
  }

  // Function to start the game
  startGame() {
    this.cardToCheck = null;
    this.totalClicks = 0;
    this.timeRemaining = this.totalTime;
    this.matchedCards = [];
    this.busy = true;
    // To start the music, shuffle cards, countdown, and prevent user from clicking anything for 0.5 sec
    setTimeout(() => {
      this.audioController.startMusic();
      this.shuffleCards();
      this.countDown = this.startCountDown();
      this.busy = false;
    }, 500);
    this.hideCards();
    this.timer.innerText = this.timeRemaining;
    this.ticker.innerText = this.totalClicks;
  }

  // To flip back all the cards to the original position
  hideCards() {
    this.cardsArray.forEach(card => {
      card.classList.remove("visible");
      card.classList.remove("matched");
    });
  }

  // To enable the animation and sound of card flipping
  flipCard(card) {
    if (this.canFlipCard(card)) {
      card.classList.add("visible");
      this.audioController.flip();
      this.totalClicks++;
      this.ticker.innerText = this.totalClicks;

      if (this.cardToCheck) {
        this.checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }

  // To check if cards clicked are a match
  checkForCardMatch(card) {
    if (this.getCardType(card) === this.getCardType(this.cardToCheck))
      this.cardMatch(card, this.cardToCheck);
    else this.cardMisMatch(card, this.cardToCheck);

    this.cardToCheck = null;
  }

  // To enable animation and sound for when there's a match of cards
  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    card1.classList.add("matched");
    card2.classList.add("matched");
    this.audioController.match();
    if (this.matchedCards.length === this.cardsArray.length) {
      this.victory();
    }
  }

  // To enable animation when cards are not a match, flipping back the cards
  cardMisMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove("visible");
      card2.classList.remove("visible");
      this.busy = false;
    }, 800);
  }

  // To get url info from index.html for each card value for comparison of match
  getCardType(card) {
    return card.getElementsByClassName("card-value")[0].src;
  }

  // To start the countdown of timer
  startCountDown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining;
      if (this.timeRemaining === 0) this.gameOver();
    }, 1000);
  }

  // To show game over screen and sound
  gameOver() {
    clearInterval(this.countDown);
    this.audioController.gameOver();
    document.getElementById("game-over-text").classList.add("visible");
  }

  // To show victory screen and sound
  victory() {
    clearInterval(this.countDown);
    this.audioController.victory();
    document.getElementById("victory-text").classList.add("visible");
  }

  // Card shuffling algorithm
  shuffleCards() {
    for (let i = this.cardsArray.length - 1; i > 0; i--) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      this.cardsArray[randIndex].style.order = i;
      this.cardsArray[i].style.order = randIndex;
    }
  }

  // To check if the cards can be flipped
  canFlipCard(card) {
    return (
      !this.busy &&
      !this.matchedCards.includes(card) &&
      card !== this.cardToCheck
    );
  }
}

function ready() {
  let overlays = Array.from(document.getElementsByClassName("overlay-text"));
  let cards = Array.from(document.getElementsByClassName("card"));
  let game = new MixOrMatch(5, cards);

  overlays.forEach(overlay => {
    overlay.addEventListener("click", () => {
      overlay.classList.remove("visible");
      game.startGame();
    });
  });

  cards.forEach(card => {
    card.addEventListener("click", () => {
      game.flipCard(card);
    });
  });
}

// To check if all elements in index.html has been loaded before JS functions are loaded

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready());
} else {
  ready();
}
