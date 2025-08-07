import { Hitbox } from './hitbox.class';
import { AnimationPlayer } from './player.class';
import { World } from './world.class';
import { AnimationEnemie } from './enemie.class';

/**
 * Thats the super class for all Characters in game and definies their must have values, like x and y corrdinates, images, hitboxes etc. Furthermore every char must have a update, a setDirection and a draw method
 */
export abstract class Character {
  //Draw Values
  public world: World;
  public x: number;
  public y: number;
  abstract width: number;
  abstract height: number;

  //Image Stuff
  protected abstract img: HTMLImageElement;
  protected abstract imgRight: HTMLImageElement;
  protected abstract imgLeft: HTMLImageElement;

  //Animation Values
  abstract frameWidth: number;
  abstract frameHeight: number;
  abstract animation: AnimationPlayer | AnimationEnemie;
  public spritePosition: number = 0;
  public direction: Direction = Direction.right;
  public maxFrameCount: number = 23;

  //Char Stats
  abstract hp: number;
  abstract speed: number;
  public velocityX: number = 0;
  public velocityY: number = 0;
  abstract projectileSpeed: number;

  //Hitbox
  abstract hitbox: Hitbox;
  abstract hitboxOffsetX: number;
  abstract hitboxOffsetY: number;
  abstract hitboxOffsetWidth: number;
  abstract hitboxOffsetHeight: number;

  constructor(startingX: number, startingY: number, world: World) {
    this.x = startingX;
    this.y = startingY;
    this.world = world;
  }

  abstract update(): void;

  draw(): void {
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
  }
  abstract setDirection(direction: Direction): void;
}

export enum Direction {
  left = 'left',
  right = 'right',
}
