import { World } from "./classes/world.class";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const targetFps: number = 60;
const targetFrameTime = 1000 / targetFps;
let lastTime: number = 0;
let accumulator: number = 0;
let pauseGame = false;

const world = new World(canvas, ctx);

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

startGame();
