import { gameOverMenu } from "../main";
import {
  Background,
  BackgroundLayer,
  FirstLayer,
  ForthLayer,
  SecondLayer,
  ThirdLayer,
} from "./background.class";
import { Crystal } from "./crystal.class";
import { Boss, Enemie, Zombie1, Zombie2 } from "./enemie.class";
import { EnemyHurtState } from "./enemieStates.class";
import { Player } from "./player.class";
import {
  HurtState,
  JumpingStateAscending,
  JumpingStateDescending,
} from "./states.class";

export class World {
  width: number;
  height: number;
  groundLevel: number = 350;
  centerScreen: number;
  playerStartingX: number;
  player: Player;
  gravity: number = 1;
  backgrounds: Background[][] = [];
  enemies: Enemie[] = [];
  crystals: Crystal[] = [];

  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D
  ) {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.centerScreen = this.width / 2 - 50;
    this.playerStartingX = this.centerScreen;
    this.player = new Player(this.playerStartingX, this.groundLevel, this);
    this.enemies = [
      new Boss(-4000, this.groundLevel - 40, this),
      new Zombie1(1000, this.groundLevel, this),
      new Zombie2(2000, this.groundLevel, this),
      new Boss(4000, this.groundLevel - 40, this),
      new Zombie1(-1000, this.groundLevel, this),
      new Zombie2(-2000, this.groundLevel, this),
      new Zombie1(-1500, this.groundLevel, this),
      new Zombie2(-2500, this.groundLevel, this),
      new Zombie1(1500, this.groundLevel, this),
      new Zombie2(2500, this.groundLevel, this),
    ];
    this.crystals = [
      new Crystal(200, this.groundLevel + 30, this),
      new Crystal(400, this.groundLevel + 30, this),
      new Crystal(50, this.groundLevel + 30, this),
    ];
    this.player.initImgs();
    this.backgrounds = [
      [
        new BackgroundLayer(this, 0),
        new BackgroundLayer(this, 1),
        new BackgroundLayer(this, 2),
      ],
      [
        new FirstLayer(this, 0),
        new FirstLayer(this, 1),
        new FirstLayer(this, 2),
      ],
      [
        new SecondLayer(this, 0),
        new SecondLayer(this, 1),
        new SecondLayer(this, 2),
      ],
      [
        new ThirdLayer(this, 0),
        new ThirdLayer(this, 1),
        new ThirdLayer(this, 2),
      ],
      [
        new ForthLayer(this, 0),
        new ForthLayer(this, 1),
        new ForthLayer(this, 2),
      ],
    ];
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.update();
    this.updateBackgrounds();
    this.updateEnemies();

    this.checkCollisions();
    this.deleteCrystals();
    this.updateCrystals();
    this.killEnemy();
  }

  draw() {
    this.drawBackgrounds();
    this.drawEnemies();
    this.player.draw();
    this.drawCrystals();
  }

  drawCrystals() {
    this.crystals.forEach((crystal) => {
      crystal.draw();
    });
  }

  updateCrystals() {
    this.crystals.forEach((crystal) => {
      crystal.update();
    });
  }
  drawBackgrounds() {
    this.backgrounds.forEach((backgroundLayerArr) => {
      backgroundLayerArr.forEach((backgroundLayer) => {
        backgroundLayer.draw();
      });
    });
  }

  updateBackgrounds() {
    this.backgrounds.forEach((backgroundLayerArr) => {
      this.checkPlatformsRight(backgroundLayerArr);
      this.checkPlatformLeft(backgroundLayerArr);
    });
  }

  updateEnemies() {
    this.enemies.forEach((enemy) => enemy.update());
  }

  checkCollisions() {
    this.enemies.forEach((enemy) => {
      this.checkStomp(enemy);
      this.checkSideCollision(enemy);
    });
  }

  drawEnemies() {
    this.enemies.forEach((enemy) => enemy.draw());
  }

  checkPlatformsRight(backgroundArr: Background[]) {
    if (backgroundArr[1].x + backgroundArr[1].width - 5 < 0) {
      const movedPlatform = backgroundArr.shift();
      if (movedPlatform) {
        const lastPlatform = backgroundArr[backgroundArr.length - 1];
        movedPlatform.x = lastPlatform.x + lastPlatform.width;
        backgroundArr.push(movedPlatform);
      }
    }
  }

  checkPlatformLeft(backgroundArr: Background[]) {
    if (backgroundArr[1].x > this.width - 5) {
      const movedPlatform = backgroundArr.pop();
      if (movedPlatform) {
        const firstPlatform = backgroundArr[0];
        movedPlatform.x = firstPlatform.x - firstPlatform.width;
        backgroundArr.unshift(movedPlatform);
      }
    }
  }

  deleteCrystals() {
    this.crystals = this.crystals.filter((crystal) => {
      return !crystal.isPickedUp;
    });
  }

  killEnemy() {
    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.isDead;
    });
  }

  checkStomp(enemy: Enemie) {
    const player = this.player;
    player.hitbox.update();
    enemy.hitbox.update();
    const p = player.hitbox;
    const e = enemy.hitbox;
    const playerBottom = p.y + p.height;
    const enemyTop = e.y;
    const isHorizontalOverlap = p.x < e.x + e.width && p.x + p.width > e.x;
    const isVerticalOverlap = playerBottom >= enemyTop && p.y < e.y + e.height;
    if (this.player.stompCooldown === true) return;
    if (
      isHorizontalOverlap &&
      isVerticalOverlap &&
      player.state instanceof JumpingStateDescending
    ) {
      enemy.setState(new EnemyHurtState(this.player, enemy));
      this.player.velocityY = this.player.jumpForce;
      this.player.setState(new JumpingStateAscending(this.player));
      this.player.stompCooldown = true;
      setTimeout(() => {
        this.player.stompCooldown = false;
      }, this.player.stompCooldownTime * 1000);
    }
  }

  checkSideCollision(enemy: Enemie) {
    this.player.hitbox.update();
    enemy.hitbox.update();
    const p = this.player.hitbox;
    const e = enemy.hitbox;
    const playerBottom = p.y + p.height;
    const enemyTop = e.y;
    const isHorizontalCollision = p.x < e.x + e.width && p.x + p.width > e.x;
    const isVerticalOverlap =
      playerBottom + 20 > enemyTop && p.y < e.y + e.height;
    const notFromAbove = playerBottom <= enemyTop + 10;
    if (
      isHorizontalCollision &&
      isVerticalOverlap &&
      !notFromAbove &&
      !this.player.hitOnCooldown
    ) {
      this.player.setState(new HurtState(this.player));
      enemy.setState(new EnemyHurtState(this.player, enemy));
    }
  }

  gameOver() {
    gameOverMenu();
  }

  won() {}
}
