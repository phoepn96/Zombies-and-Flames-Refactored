import { SoundManager } from "./classes/soundManager.class";
import { audioTemp, gameOverTemp, muteTemp } from "./classes/templates";
import { World } from "./classes/world.class";

export const localMute: boolean = false;

const menu: HTMLDivElement = document.getElementById(
  "gameMenu"
) as HTMLDivElement;

const startGameBtn: HTMLButtonElement = document.getElementById(
  "startGame"
) as HTMLButtonElement;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const targetFps: number = 45;
const targetFrameTime = 1000 / targetFps;
let lastTime: number = 0;
let accumulator: number = 0;
let pauseGame = false;

const world = new World(canvas, ctx);

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

function startGame(): void {
  requestAnimationFrame(gameLoop);
}

startGameBtn.addEventListener("click", () => {
  menu.classList.add("hide");
  canvas.classList.remove("hide");
  startBgMusic();
  startGame();
});

function startBgMusic() {
  soundManager.playSound("backgroundMusic");
}

const soundButton: HTMLDivElement = document.getElementById(
  "soundButton"
) as HTMLDivElement;

soundButton.addEventListener("click", () => {
  toggleMusic();
});

function toggleMusic() {
  soundManager.toggleMute();
  if (soundManager.muted) {
    soundButton.innerHTML = muteTemp();
  } else {
    soundButton.innerHTML = audioTemp();
  }
}

export function gameOverMenu() {
  canvas.classList.add("hide");
  menu.innerHTML += gameOverTemp;
}
