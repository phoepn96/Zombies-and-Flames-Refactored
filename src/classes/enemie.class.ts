import { imageCache } from './imageCache';
import { soundManager } from '../main';
import { Character, Direction } from './character.class';
import { EnemyDyingState, EnemyState, EnemyWalkingState } from './enemieStates.class';
import { Hitbox } from './hitbox.class';
import { Projectile } from './projectile.class';
import { World } from './world.class';

/**
 * enum for the Y coordinates of the spritesheet, for better readebility
 */
export enum AnimationEnemie {
  dying = 0,
  hurt = 2,
  idle = 3,
  walking = 6,
  slashing = 8,
}

/**
 * Record for the enum above, that matches the X frames for the corrosponding Y Frame
 */
export const SpriteFrameCountEnemy: Record<AnimationEnemie, number> = {
  [AnimationEnemie.dying]: 16,
  [AnimationEnemie.hurt]: 11,
  [AnimationEnemie.walking]: 23,
  [AnimationEnemie.slashing]: 11,
  [AnimationEnemie.idle]: 17,
};

/**
 * super class for all enemies in game, extends the character superclass
 */
export abstract class Enemie extends Character {
  projectileSpeed: number = 0;
  attackCooldownTime: number = 3;
  attackOnCooldown = false;
  isDead = false;
  hurtCooldown: number = 0.5;
  hurtOnCooldown: boolean = false;
  state: EnemyState = new EnemyWalkingState(this.world.player, this);
  animation: AnimationEnemie = AnimationEnemie.walking;
  constructor(startingX: number, startingY: number, world: World) {
    super(startingX, startingY, world);
  }

  /**
   * Sets the state of the enemie instance to a new state and triggers the enter method of that state
   *
   * @param state a state which implements the EnemyState interface
   */
  setState(state: EnemyState) {
    this.state = state;
    this.state.enter();
  }

  /**
   * sets the direction of an enemie to a new direction
   *
   * @param direction Enum its either left or right
   */
  setDirection(direction: Direction): void {
    this.direction = direction;
  }

  /**
   * updates the enemy instance by refreshing the state logic, updating the hitbox, animationg the spritesheet, checking direction, and watching for the hp of the instance
   */
  update() {
    this.state.checkForAction();
    this.state.update();
    this.hitbox.update();
    this.animateSprite();
    this.checkDirection();
    this.killSelf();
  }

  /**
   * watchers where the player is and moves in the direction of the player, with liddle tweaks to support the parallax nature of the game
   */
  move() {
    if (
      (this.direction === Direction.right &&
        this.world.player.direction === Direction.left &&
        this.world.player.velocityX != 0) ||
      (this.direction === Direction.left &&
        this.world.player.direction === Direction.right &&
        this.world.player.velocityX != 0)
    ) {
      this.x -= this.world.player.velocityX * 0.5;
    } else {
      this.x -= this.world.player.velocityX * 0.7;
    }
  }

  /**
   * checks the direction of the instance and gives the right spritesheet
   */
  checkDirection() {
    if (this.direction === Direction.right) {
      this.img = this.imgRight;
    } else {
      this.img = this.imgLeft;
    }
  }

  /**
   * animates the spritesheet
   */
  animateSprite() {
    if (this.direction === Direction.right) {
      if (this.spritePosition > SpriteFrameCountEnemy[this.animation] - 1) this.spritePosition = -1;
      this.spritePosition++;
    } else {
      if (this.spritePosition < this.maxFrameCount - SpriteFrameCountEnemy[this.animation] + 1)
        this.spritePosition = this.maxFrameCount + 1;
      this.spritePosition--;
    }
  }

  /**
   * watches the hp of the instance and sets the dying state if hp = 0
   */
  killSelf() {
    if (this.hp <= 0 && !(this.state instanceof EnemyDyingState)) {
      this.setState(new EnemyDyingState(this));
    }
  }
}

/**
 * class for the boss encounter of the game
 */
export class Boss extends Enemie {
  width: number = 150;
  height: number = 150;

  //Img Stuff
  protected imgLeft!: HTMLImageElement;
  protected imgRight!: HTMLImageElement;
  protected img!: HTMLImageElement;

  //Stats
  maxHp: number = 5;
  hp: number = 5;
  speed: number = 4;

  //Animation Stuff
  frameWidth: number = 80;
  frameHeight: number = 80;
  animation: AnimationEnemie = AnimationEnemie.walking;
  //Hitbox etc..
  projectiles: Projectile[] = [];
  hitboxOffsetX: number = -38;
  hitboxOffsetY: number = -28;
  hitboxOffsetWidth: number = -80;
  hitboxOffsetHeight: number = -50;
  hitbox: Hitbox = new Hitbox(
    this,
    this.width,
    this.height,
    this.hitboxOffsetX,
    this.hitboxOffsetY,
    this.hitboxOffsetWidth,
    this.hitboxOffsetHeight
  );

  constructor(startingX: number, startingY: number, world: World) {
    super(startingX, startingY, world);
    this.imgRight = imageCache['bossRight'];
    this.imgLeft = imageCache['bossLeft'];
    this.img = this.imgRight;
  }

  /**
   * adds a projectile to theproj array of the instance and plays a sound
   */
  fireProj() {
    this.projectiles.push(new Projectile(this, this.world.ctx));
    soundManager.playSound('reaperFlame');
    setTimeout(() => {
      soundManager.stopSound('reaperFlame');
    }, 2000);
  }

  /**
   * updates the instance by updating state, hitbox, animation, direction, all projectiles in the proj array of the instance, watches which projectiles can be deleted and watches the hp of the instance
   */
  update() {
    this.state.checkForAction();
    this.state.update();
    this.hitbox.update();
    this.animateSprite();
    this.checkDirection();
    this.projectiles.forEach((proj) => proj.update());
    this.removeProjectiles();
    this.killSelf();
  }

  /**
   * draws the instance and all of its projectiles on the canvas
   */
  draw() {
    this.projectiles.forEach((proj) => proj.draw());
    this.world.ctx.drawImage(
      this.img,
      this.frameWidth * this.spritePosition,
      this.frameHeight * this.animation,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.drawLifeBar();
  }

  /**
   * draws the lifebar of the boss
   */
  private drawLifeBar() {
    const offset = 2;
    const lifebarWidth = this.width;
    const lifebarHeight = 10;
    const y = this.hitbox.y - lifebarHeight;
    this.world.ctx.fillStyle = '#3b0d0d';
    this.world.ctx.fillRect(this.x, y, lifebarWidth, lifebarHeight);
    const ratio = Math.max(0, Math.min(1, this.hp / this.maxHp));
    this.world.ctx.fillStyle = '#e53935';
    this.world.ctx.fillRect(
      this.x + offset,
      y + offset,
      (lifebarWidth - offset * 2) * ratio,
      lifebarHeight - offset * 2
    );
    this.world.ctx.strokeStyle = '#000';
    this.world.ctx.lineWidth = 1;
    this.world.ctx.strokeRect(this.x, y, lifebarWidth, lifebarHeight);
    this.world.ctx.font = '10px sans-serif';
    this.world.ctx.fillStyle = '#fff';
    this.world.ctx.textAlign = 'center';
    this.world.ctx.textBaseline = 'middle';
    this.world.ctx.fillText(
      `${this.hp}/${this.maxHp}`,
      this.x + lifebarWidth / 2,
      y + lifebarHeight / 2
    );
  }

  /**
   * removes specific projectiles by filtering all prijectiles out, which met requirments like leaving the viewport or colliding
   */
  removeProjectiles() {
    this.projectiles = this.projectiles.filter((projectile) => {
      return !projectile.removeProj;
    });
  }
}

/**
 * super class for the zombie instances which extent the Enemie superclass
 */
abstract class Zombie extends Enemie {
  width: number = 100;
  height: number = 100;

  frameWidth: number = 80;
  frameHeight: number = 80;

  hp = 2;
  speed: number = 3;
  protected imgLeft!: HTMLImageElement;
  protected imgRight!: HTMLImageElement;
  protected img!: HTMLImageElement;
  hitboxOffsetX: number = -30;
  hitboxOffsetY: number = -25;
  hitboxOffsetWidth: number = -55;
  hitboxOffsetHeight: number = -40;
  hitbox: Hitbox = new Hitbox(
    this,
    this.width,
    this.height,
    this.hitboxOffsetX,
    this.hitboxOffsetY,
    this.hitboxOffsetWidth,
    this.hitboxOffsetHeight
  );

  constructor(startingX: number, startingY: number, world: World) {
    super(startingX, startingY, world);
  }
}

/**
 * class for a liddle zombie
 */
export class Zombie1 extends Zombie {
  constructor(startingX: number, startingY: number, world: World) {
    super(startingX, startingY, world);
    this.imgRight = imageCache['zombie1Right'];
    this.imgLeft = imageCache['zombie1Left'];
    this.img = this.imgRight;
  }
}

/**
 * the other liddle zombie
 */
export class Zombie2 extends Zombie {
  constructor(startingX: number, startingY: number, world: World) {
    super(startingX, startingY, world);
    this.imgRight = imageCache['zombie2Right'];
    this.imgLeft = imageCache['zombie2Left'];
    this.img = this.imgRight;
  }
}
