import { Hitbox } from './hitbox.class';
import { AnimationPlayer } from './player.class';
import { World } from './world.class';
import { AnimationEnemie } from './enemie.class';

/**
 * Thats the super class for all Characters in game and definies their must have values, like x and y corrdinates, images, hitboxes etc. Furthermore every char must have a update, a setDirection and a draw method
 */
export abstract class Character {
  /**
   * defines the world of the charakter and the variables needed to draw
   */
  public world: World;
  public x: number;
  public y: number;
  abstract width: number;
  abstract height: number;
  protected abstract img: HTMLImageElement;
  protected abstract imgRight: HTMLImageElement;
  protected abstract imgLeft: HTMLImageElement;

  /**
   * values needed for animating the spritesheets
   */
  abstract frameWidth: number;
  abstract frameHeight: number;
  abstract animation: AnimationPlayer | AnimationEnemie;
  public spritePosition: number = 0;
  public direction: Direction = Direction.right;
  public maxFrameCount: number = 23;

  /**
   * those are the stats of the character
   */
  abstract hp: number;
  abstract speed: number;
  public velocityX: number = 0;
  public velocityY: number = 0;
  abstract projectileSpeed: number;

  /**
   * stats requiered for the hitbox of the characters
   */
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

  /**
   * drwas the character
   */
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

  /**
   * sets the direction of the character to a new direction
   *
   * @param direction direction of the character eather left or right,
   */
  abstract setDirection(direction: Direction): void;
}

/**
 * direction of the character either left or right
 */
export enum Direction {
  left = 'left',
  right = 'right',
}
