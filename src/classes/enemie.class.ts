import { Character, Direction } from "./character.class";
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

const SpriteFrameCount: Record<AnimationEnemie, number> = {
  [AnimationEnemie.dying]: 16,
  [AnimationEnemie.hurt]: 11,
  [AnimationEnemie.walking]: 23,
  [AnimationEnemie.slashing]: 11,
};

export abstract class Enemie extends Character {
  projectileSpeed: number = 0;
  constructor(startingX: number, startingY: number, world: World) {
    super(startingX, startingY, world);
  }

  abstract move(): void;
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
  speed: number = 5;

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

  move(): void {}

  update(): void {}

  setDirection(direction: Direction): void {
    this.direction = direction;
  }
}

abstract class Zombie extends Enemie {
  width: number = 100;
  height: number = 100;

  frameWidth: number = 909.58;
  frameHeight: number = 908.88;
  animation: AnimationEnemie = AnimationEnemie.walking;

  hp = 4;
  speed: number = 5;

  hitboxOffsetX: number = 0;
  hitboxOffsetY: number = 0;
  hitboxOffsetWidth: number = 0;
  hitboxOffsetHeight: number = 0;
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

  move() {}
  update(): void {}
  setDirection(direction: Direction): void {}
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
