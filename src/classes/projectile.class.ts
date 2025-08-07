import { imageCache } from './imageCache';
import { Character, Direction } from './character.class';
import { EnemyHurtState } from './enemieStates.class';
import { Hitbox } from './hitbox.class';
import { Player } from './player.class';
import { DyingState, HurtState } from './states.class';
import { World } from './world.class';

/**
 * projectile class
 */
export class Projectile {
  img!: HTMLImageElement;
  x!: number;
  y!: number;
  world!: World;
  projectileSpeed!: number;
  originClass!: Character;
  ctx!: CanvasRenderingContext2D;
  spriteWidth!: number;
  spriteHeight!: number;
  spritePosition: number = 0;
  spriteRow!: number;
  origin: string = 'player';
  removeProj: boolean = false;
  direction: Direction = Direction.right;
  projectileSizeWidth!: number;
  projectileSizeHeight!: number;
  hitbox!: Hitbox;
  hitboxOffsetX: number = -50;
  hitboxOffsetY: number = -40;
  hitboxOffsetWidth: number = -80;
  hitboxOffsetHeight: number = -70;
  bossProjDuration: number = 2;
  counter: number = 0;
  imgRight!: HTMLImageElement;
  imgLeft!: HTMLImageElement;

  constructor(originClass: Character, ctx: CanvasRenderingContext2D) {
    this.x = originClass.x;
    this.y = originClass.y;
    this.world = originClass.world;
    this.projectileSpeed = originClass.projectileSpeed;
    this.originClass = originClass;
    this.ctx = ctx;
    this.direction = originClass.direction;

    if (originClass instanceof Player) {
      this.img = imageCache['playerProjLeft'];
      this.imgLeft = imageCache['playerProjLeft'];
      this.imgRight = imageCache['playerProjRight'];
      this.spriteRow = 0;
      this.spriteWidth = 46.8;
      this.spriteHeight = 30;
      this.origin = 'player';
      this.projectileSizeHeight = 100;
      this.projectileSizeWidth = 150;
      this.hitboxOffsetX = -50;
      this.hitboxOffsetY = -40;
      this.hitboxOffsetWidth = -80;
      this.hitboxOffsetHeight = -70;
      if (this.direction === Direction.right) {
        this.img = this.imgRight;
      } else {
        this.img = this.imgLeft;
      }
    } else {
      this.img = imageCache['bossProj'];
      this.spriteRow = 0;
      this.spriteWidth = 36.25;
      this.spriteHeight = 43;
      this.projectileSizeHeight = 100;
      this.projectileSizeWidth = 80;
      this.hitboxOffsetX = -15;
      this.hitboxOffsetY = -20;
      this.hitboxOffsetWidth = -40;
      this.hitboxOffsetHeight = -20;
      this.origin = 'boss';
      this.y = originClass.y + 22;
      if (this.direction === 'right') {
        this.x = originClass.x + originClass.width - 40;
      } else {
        this.x = originClass.x - 20;
      }
    }

    this.hitbox = new Hitbox(
      this,
      this.projectileSizeWidth,
      this.projectileSizeHeight,
      this.hitboxOffsetX,
      this.hitboxOffsetY,
      this.hitboxOffsetWidth,
      this.hitboxOffsetHeight
    );
  }

  /**
   * updates the prjectiles by moving it, updating the hitbox, and checking for collisions or if its out of screen
   */
  update() {
    this.moveProj();
    this.checkIfOutOfScreen();
    this.animateProj();
    this.hitbox.update();
    this.checkCollision();
  }

  /**
   * draws the image
   */
  draw() {
    this.ctx.drawImage(
      this.img,
      this.spriteWidth * this.spritePosition,
      this.spriteHeight * this.spriteRow,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.projectileSizeWidth,
      this.projectileSizeHeight
    );
  }

  /**
   * if its a player proj, its moves the projectile in a specific direction
   *
   * @returns nothing
   */
  moveProj() {
    if (this.origin === 'boss') return;
    if (this.direction === 'right') {
      this.x += this.projectileSpeed;
    } else {
      this.x -= this.projectileSpeed;
    }
  }

  /**
   * checks if the proj is out of viewport and than sets removeProj to true, so it can get deleted
   */
  checkIfOutOfScreen() {
    if (this.x + this.spriteWidth < 0) {
      this.removeProj = true;
    } else if (this.x > this.world.width) {
      this.removeProj = true;
    }
  }

  /**
   * animates the sritesheet
   */
  animateProj() {
    if (this.origin === 'player') {
      if (this.spritePosition > 15) this.spritePosition = 10;
      this.spritePosition++;
    } else {
      if (this.spritePosition > 51) {
        if (this.counter < this.bossProjDuration) {
          this.spritePosition = -1;
          this.counter++;
        } else {
          this.removeProj = true;
        }
      }
      this.spritePosition++;
    }
  }

  /**
   * counters the parallax effect
   */
  move() {
    this.x -= this.world.player.velocityX * 0.5;
  }

  /**
   * checks if proj is colliding with player or a enemy
   */
  checkCollision() {
    if (this.originClass instanceof Player) {
      this.checkPlayerCollision();
    } else {
      this.checkEnemyCollision();
    }
  }

  /**
   * takes every enemy and calculates if the hitbox of the projectile is colliding with a hitbox of an enemy and ifso sets them in a hurt state
   */
  checkPlayerCollision() {
    this.originClass.world.enemies.forEach((enemy) => {
      if (
        this.hitbox.x < enemy.hitbox.x + enemy.hitbox.width &&
        this.hitbox.x + this.hitbox.width > enemy.hitbox.x &&
        this.hitbox.y < enemy.hitbox.y + enemy.hitbox.height &&
        this.hitbox.y + this.hitbox.height > enemy.hitbox.y
      ) {
        if (enemy.state instanceof EnemyHurtState) return;
        enemy.setState(new EnemyHurtState(this.world.player, enemy));
        this.removeProj = true;
      }
    });
  }

  /**
   * checks if the hitbox of the proj is colliding with the player and if so sets the player in the hurt state
   *
   * @returns nothing
   */
  checkEnemyCollision() {
    if (
      this.hitbox.x <
        this.originClass.world.player.hitbox.x + this.originClass.world.player.hitbox.width &&
      this.hitbox.x + this.hitbox.width > this.originClass.world.player.hitbox.x &&
      this.hitbox.y <
        this.originClass.world.player.hitbox.y + this.originClass.world.player.hitbox.height &&
      this.hitbox.y + this.hitbox.height > this.originClass.world.player.hitbox.y
    ) {
      if (this.originClass.world.player.state instanceof DyingState) return;
      this.originClass.world.player.setState(new HurtState(this.originClass.world.player));
      this.removeProj = true;
    }
  }
}
