import { loadImages } from "./classes/imageCache";
import { SoundManager } from "./classes/soundManager.class";
import {
  audioTemp,
  controlTemp,
  gameDescriptionTemp,
  gameOverTemp,
  impressumTemp,
  muteTemp,
  normalMenuTemp,
  wonTemp,
} from "./classes/templates";
import { World } from "./classes/world.class";

const menu: HTMLDivElement = document.getElementById(
  "gameMenu"
) as HTMLDivElement;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const targetFps: number = 45;
const targetFrameTime = 1000 / targetFps;
let lastTime: number = 0;
let accumulator: number = 0;
let pauseGame = false;
let world: World;

async function restartGame() {
  menu.classList.add("hide");
  lastTime = 0;
  accumulator = 0;
  world = new World(canvas, ctx);
  pauseGame = false;
  startBgMusic();
  await startGame();
}

export const soundManager = new SoundManager();
soundManager.loadSound(
  "zombieAttack",
  "assets/sounds/zombieAttack.mp3",
  false,
  0.5
);
soundManager.loadSound(
  "zombieAttack",
  "assets/sounds/zombieAttack.mp3",
  false,
  0.5
);
soundManager.loadSound(
  "playerProj",
  "assets/sounds/playerProj.mp3",
  false,
  0.2
);
soundManager.loadSound("pickup", "assets/sounds/pickup.mp3", false, 0.5);
soundManager.loadSound(
  "reaperFlame",
  "assets/sounds/reaperFlame.mp3",
  false,
  0.5
);
soundManager.loadSound("bossSound", "assets/sounds/bossSound.mp3", false, 0.5);
soundManager.loadSound(
  "backgroundMusic",
  "assets/sounds/backgroundMusic.mp3",
  false,
  0.2
);

function gameLoop(timestamp: number): void {
  if (pauseGame) return;
  if (!lastTime) lastTime = timestamp;
  const deltaTime = timestamp - lastTime;
  accumulator += deltaTime;
  if (accumulator >= targetFrameTime) {
    world.update();
    world.draw();
    accumulator -= targetFrameTime;
  }

  lastTime = timestamp;
  requestAnimationFrame(gameLoop);
}

async function startGame(): Promise<void> {
  await loadImages();
  world = new World(canvas, ctx);
  requestAnimationFrame(gameLoop);
}

function startBgMusic() {
  soundManager.playSound("backgroundMusic");
}

function toggleMusic() {
  const soundButton: HTMLDivElement = document.getElementById(
    "soundButton"
  ) as HTMLDivElement;
  soundManager.toggleMute();
  if (soundManager.muted) {
    soundButton.innerHTML = muteTemp();
  } else {
    soundButton.innerHTML = audioTemp();
  }
}

export function gameOverMenu() {
  pauseGame = true;
  setTimeout(() => {
    menu.classList.remove("hide");
    menu.style.backgroundColor = "transparent";
    menu.style.backgroundImage = "none";
    menu.innerHTML = gameOverTemp();
    playAgainListener();
    soundManager.stopAllSounds();
  }, 5000);
}

export function youWon() {
  pauseGame = true;
  setTimeout(() => {
    menu.classList.remove("hide");
    menu.style.backgroundColor = "transparent";
    menu.style.backgroundImage = "none";
    menu.innerHTML = wonTemp();
    playAgainListener();
    soundManager.stopAllSounds();
  }, 5000);
}

function playAgainListener() {
  const playAgainBtn = document.getElementById("playAgainBtn");
  playAgainBtn?.addEventListener("click", () => {
    restartGame();
  });
}
function addListeners() {
  const startGameBtn: HTMLButtonElement = document.getElementById(
    "startGame"
  ) as HTMLButtonElement;

  const impressumBtn: HTMLButtonElement = document.getElementById(
    "impressum"
  ) as HTMLButtonElement;

  const gameDescriptionBtn: HTMLButtonElement = document.getElementById(
    "gameplay"
  ) as HTMLButtonElement;
  const controlsBtn: HTMLButtonElement = document.getElementById(
    "controls"
  ) as HTMLButtonElement;
  const soundButton: HTMLDivElement = document.getElementById(
    "soundButton"
  ) as HTMLDivElement;

  startGameBtn.addEventListener("click", () => {
    menu.classList.add("hide");
    canvas.classList.remove("hide");
    startBgMusic();
    startGame();
  });
  soundButton.addEventListener("click", () => {
    toggleMusic();
  });
  impressumBtn.addEventListener("click", () => {
    menu.innerHTML = impressumTemp();
    addBackListener();
  });
  gameDescriptionBtn.addEventListener("click", () => {
    menu.innerHTML = gameDescriptionTemp();
    addBackListener();
  });
  controlsBtn.addEventListener("click", () => {
    menu.innerHTML = controlTemp();
    console.log("test");
    addBackListener();
  });
}

function addBackListener() {
  const backBtn: HTMLButtonElement = document.getElementById(
    "backBtn"
  ) as HTMLButtonElement;
  backBtn.addEventListener("click", () => {
    console.log("test2");
    menu.innerHTML = normalMenuTemp();
    addListeners();
  });
}

addListeners();
window.addEventListener("load", async () => {
  await loadImages();
});
