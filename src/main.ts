import { loadImages } from './classes/imageCache';
import { SoundManager } from './classes/soundManager.class';
import {
  audioTemp,
  controlTemp,
  gameDescriptionTemp,
  gameOverTemp,
  impressumTemp,
  muteTemp,
  normalMenuTemp,
  wonTemp,
} from './classes/templates';
import { World } from './classes/world.class';

const menu: HTMLDivElement = document.getElementById('gameMenu') as HTMLDivElement;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const targetFps: number = 45;
const targetFrameTime = 1000 / targetFps;
let lastTime: number = 0;
let accumulator: number = 0;
let pauseGame = false;
let world: World;

/**
 * restarts the game, by resetting deltaTime and creating a new world
 */
async function restartGame() {
  menu.classList.add('hide');
  lastTime = 0;
  accumulator = 0;
  world = new World(canvas, ctx);
  pauseGame = false;
  startBgMusic();
  await startGame();
}

/**
 * initalizes the soundmanger and is loading all sounds
 */
export const soundManager = new SoundManager();
soundManager.loadSound('zombieAttack', 'assets/sounds/zombieAttack.mp3', false, 0.5);
soundManager.loadSound('zombieAttack', 'assets/sounds/zombieAttack.mp3', false, 0.5);
soundManager.loadSound('playerProj', 'assets/sounds/playerProj.mp3', false, 0.2);
soundManager.loadSound('pickup', 'assets/sounds/pickup.mp3', false, 0.5);
soundManager.loadSound('reaperFlame', 'assets/sounds/reaperFlame.mp3', false, 0.5);
soundManager.loadSound('bossSound', 'assets/sounds/bossSound.mp3', false, 0.5);
soundManager.loadSound('backgroundMusic', 'assets/sounds/backgroundMusic.mp3', false, 0.2);
soundManager.loadSound('win', 'assets/sounds/win.mp3', false, 0.2);
soundManager.loadSound('lose', 'assets/sounds/lose.mp3', false, 0.2);
soundManager.loadSound('jump', 'assets/sounds/jump.mp3', false, 0.2);
soundManager.loadSound('walk', 'assets/sounds/walk.mp3', false, 0.2);

/**
 * calculates deltaTime and loops each loop triggering updating and drawing the world
 *
 * @param timestamp number given by the browser engine, which resembles the time for each tick
 * @returns nothing
 */
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

/**
 * starts the game by creating a new world and starting the gameLoop
 */
async function startGame(): Promise<void> {
  await loadImages();
  lastTime = 0;
  accumulator = 0;
  world = new World(canvas, ctx);
  pauseGame = false;
  world = new World(canvas, ctx);
  requestAnimationFrame(gameLoop);
  checkMobileControls();
}

/**
 * starts the bg music
 */
function startBgMusic() {
  soundManager.playSound('backgroundMusic');
}

/**
 * toggles mute on all sounds
 */
function toggleMusic() {
  const soundButton: HTMLDivElement = document.getElementById('soundButton') as HTMLDivElement;
  soundManager.toggleMute();
  if (soundManager.muted) {
    soundButton.innerHTML = muteTemp();
  } else {
    soundButton.innerHTML = audioTemp();
  }
}

/**
 * shows the gameover screen
 */
export function gameOverMenu() {
  pauseGame = true;
  soundManager.playSound('lose');
  setTimeout(() => {
    menu.classList.remove('hide');
    menu.style.backgroundColor = 'transparent';
    menu.style.backgroundImage = 'none';
    menu.innerHTML = gameOverTemp();
    playAgainListener();
    goToMenu();
  }, 3000);
}

/**
 * shows the won screen
 */
export function youWon() {
  pauseGame = true;
  soundManager.playSound('win');
  setTimeout(() => {
    menu.classList.remove('hide');
    menu.style.backgroundColor = 'transparent';
    menu.style.backgroundImage = 'none';
    menu.innerHTML = wonTemp();
    playAgainListener();
    goToMenu();
  }, 3000);
}

/**
 *renders the basic menu
 */
function goToMenu() {
  const backBtn: HTMLButtonElement = document.getElementById('backBtn') as HTMLButtonElement;
  backBtn.addEventListener('click', () => {
    menu.innerHTML = normalMenuTemp();
    menu.classList.remove('hide');
    canvas.classList.add('hide');
    addListenerWithoutSound();
    removeMobileControls();
  });
}

/**
 * adds a eventlistener to the play again button after losing
 */
function playAgainListener() {
  const playAgainBtn = document.getElementById('playAgainBtn');
  playAgainBtn?.addEventListener('click', () => {
    restartGame();
  });
}

/**
 * adds eventlistener to the menu elements
 */
function addListeners() {
  addStartGameListener();
  addGameDescriptionListener();
  addImpressumListener();
  addControlsListener();
  addSoundListener();
}

/**
 * adds all eventlisteners for the main menu exept for the sound
 */
function addListenerWithoutSound() {
  addStartGameListener();
  addGameDescriptionListener();
  addImpressumListener();
  addControlsListener();
}

/**
 * adds a eventlistener to the start game button
 */
function addStartGameListener() {
  const startGameBtn: HTMLButtonElement = document.getElementById('startGame') as HTMLButtonElement;
  startGameBtn.addEventListener('click', () => {
    menu.classList.add('hide');
    canvas.classList.remove('hide');
    startBgMusic();
    startGame();
  });
}

/**
 * adds a eventlistener to the gamedescription button
 */
function addGameDescriptionListener() {
  const gameDescriptionBtn: HTMLButtonElement = document.getElementById(
    'gameplay'
  ) as HTMLButtonElement;
  gameDescriptionBtn.addEventListener('click', () => {
    menu.innerHTML = gameDescriptionTemp();
    addBackListener();
    hideSound();
  });
}

/**
 * adss a eventlistener to the impressum button
 */
function addImpressumListener() {
  const impressumBtn: HTMLButtonElement = document.getElementById('impressum') as HTMLButtonElement;
  impressumBtn.addEventListener('click', () => {
    menu.innerHTML = impressumTemp();
    addBackListener();
    hideSound();
  });
}

/**
 * adds a eventlistener to the control buttons
 */
function addControlsListener() {
  const controlsBtn: HTMLButtonElement = document.getElementById('controls') as HTMLButtonElement;
  controlsBtn.addEventListener('click', () => {
    menu.innerHTML = controlTemp();
    addBackListener();
    hideSound();
  });
}

/**
 * adds a eventlistener to the sound button
 */
function addSoundListener() {
  const soundButton: HTMLDivElement = document.getElementById('soundButton') as HTMLDivElement;
  soundButton.addEventListener('click', () => {
    toggleMusic();
  });
}

/**
 *adds eventliosteners to the menu buttons
 */
function addBackListener() {
  const backBtn: HTMLButtonElement = document.getElementById('backBtn') as HTMLButtonElement;
  backBtn.addEventListener('click', () => {
    menu.innerHTML = normalMenuTemp();
    addListenerWithoutSound();
    showSound();
  });
}

/**
 * checks if the device is in landscape mode, if not than it shows a screen to switch to landscpae mode
 */
function checkOrientation() {
  const rotateScreen = document.getElementById('rotate-screen');
  if (window.matchMedia('(orientation: landscape)').matches) {
    rotateScreen?.classList.add('hide');
  } else {
    rotateScreen?.classList.remove('hide');
  }
}

/**
 * adds a eventlistener to check for orientation
 */
window.addEventListener('resize', checkOrientation);

window.addEventListener('orientationchange', checkOrientation);
checkOrientation();
window.addEventListener('load', addListeners);

/**
 * shows the mobile control button if screen is smaller than 1024px
 */
function checkMobileControls() {
  const mobileControls = document.getElementById('mobile-controls');
  if (window.matchMedia('(pointer: coarse)').matches) {
    mobileControls?.classList.remove('hide');
  } else {
    mobileControls?.classList.add('hide');
  }
}

/**
 * hides the mobile controls
 */
function removeMobileControls() {
  const mobileControls = document.getElementById('mobile-controls');
  mobileControls?.classList.add('hide');
}

/**
 * hides the sound button
 */
function hideSound() {
  const soundButton: HTMLDivElement = document.getElementById('soundButton') as HTMLDivElement;
  soundButton.classList.add('hide');
}

/**
 * shows the sound buttons
 */
function showSound() {
  const soundButton: HTMLDivElement = document.getElementById('soundButton') as HTMLDivElement;
  soundButton.classList.remove('hide');
}
