import { Character, Direction } from "./character.class";
import {
  EnemyDyingState,
  EnemyState,
  EnemyWalkingState,
} from "./enemieStates.class";
import { Hitbox } from "./hitbox.class";
import { Projectile } from "./projectile.class";
import { World } from "./world.class";

const reaperRight: HTMLImageElement = document.getElementById(
  "reaperRight"
) as HTMLImageElement;
const reaperLeft: HTMLImageElement = document.getElementById(
  "reaperLeft"
) as HTMLImageElement;
const zombie1Right: HTMLImageElement = document.getElementById(
  "zombie1Right"
) as HTMLImageElement;
const zombie1Left: HTMLImageElement = document.getElementById(
  "zombie1Left"
) as HTMLImageElement;
const zombie2Right: HTMLImageElement = document.getElementById(
  "zombie2Right"
) as HTMLImageElement;
const zombie2Left: HTMLImageElement = document.getElementById(
  "zombie2Left"
) as HTMLImageElement;

export enum AnimationEnemie {
  dying = 0,
  hurt = 2,
  walking = 6,
  slashing = 8,
}

export const SpriteFrameCountEnemy: Record<AnimationEnemie, number> = {
  [AnimationEnemie.dying]: 16,
  [AnimationEnemie.hurt]: 11,
  [AnimationEnemie.walking]: 23,
  [AnimationEnemie.slashing]: 11,
};

export abstract class Enemie extends Character {
  projectileSpeed: number = 0;
  attackCooldownTime: number = 3;
  attackOnCooldown = false;
  isDead = false;
  state: EnemyState = new EnemyWalkingState(this.world.player, this);
  animation: AnimationEnemie = AnimationEnemie.walking;
  constructor(startingX: number, startingY: number, world: World) {
    super(startingX, startingY, world);
  }

  setState(state: EnemyState) {
    this.state = state;
    this.state.enter();
  }
  setDirection(direction: Direction): void {
    this.direction = direction;
  }

  update() {
    this.state.checkForAction();
    this.state.update();
    this.hitbox.update();
    this.animateSprite();
    this.checkDirection();
    this.killSelf();
  }

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

  checkDirection() {
    if (this.direction === Direction.right) {
      this.img = this.imgRight;
    } else {
      this.img = this.imgLeft;
    }
  }

  animateSprite() {
    if (this.direction === Direction.right) {
      if (this.spritePosition > SpriteFrameCountEnemy[this.animation] - 1)
        this.spritePosition = -1;
      this.spritePosition++;
    } else {
      if (
        this.spritePosition <
        this.maxFrameCount - SpriteFrameCountEnemy[this.animation] + 1
      )
        this.spritePosition = this.maxFrameCount + 1;
      this.spritePosition--;
    }
  }

  killSelf() {
    if (this.hp <= 0) {
      this.setState(new EnemyDyingState(this));
    }
  }
}

export class Boss extends Enemie {
  width: number = 150;
  height: number = 150;

  //Img Stuff
  protected imgLeft: HTMLImageElement = reaperLeft;
  protected imgRight: HTMLImageElement = reaperRight;
  protected img: HTMLImageElement = this.imgRight;

  //Stats
  hp: number = 10;
  speed: number = 4;

  //Animation Stuff
  frameWidth: number = 909.58;
  frameHeight: number = 908.88;
  animation: AnimationEnemie = AnimationEnemie.walking;
  //Hitbox etc..
  projectiles: Projectile[] = [];
  hitboxOffsetX: number = -30;
  hitboxOffsetY: number = -28;
  hitboxOffsetWidth: number = -65;
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
  }

  fireProj() {
    this.projectiles.push(new Projectile(this, this.world.ctx));
  }

  update() {
    this.state.checkForAction();
    this.state.update();
    this.hitbox.update();
    this.animateSprite();
    this.checkDirection();
    this.projectiles.forEach((proj) => proj.update());
  }

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
    this.hitbox.draw();
    this.removeProjectiles();
  }

  removeProjectiles() {
    this.projectiles = this.projectiles.filter((projectile) => {
      return !projectile.removeProj;
    });
  }
}

abstract class Zombie extends Enemie {
  width: number = 100;
  height: number = 100;

  frameWidth: number = 909.58;
  frameHeight: number = 908.88;

  hp = 4;
  speed: number = 3;

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

export class Zombie1 extends Zombie {
  protected imgRight: HTMLImageElement = zombie1Right;
  protected imgLeft: HTMLImageElement = zombie1Left;
  protected img: HTMLImageElement = this.imgRight;

  constructor(startingX: number, startingY: number, world: World) {
    super(startingX, startingY, world);
  }
}

export class Zombie2 extends Zombie {
  protected imgRight: HTMLImageElement = zombie2Right;
  protected imgLeft: HTMLImageElement = zombie2Left;
  protected img: HTMLImageElement = this.imgRight;

  constructor(startingX: number, startingY: number, world: World) {
    super(startingX, startingY, world);
  }
}
