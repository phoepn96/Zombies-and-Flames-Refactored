import { World } from "./world.class";

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
  abstract animation: unknown;
  public spritePosition: number = 0;
  public direction: Direction = Direction.right;

  //Char Stats
  abstract hp: number;
  abstract speed: number;
  public velocityX: number = 0;
  public velocityY: number = 0;

  constructor(startingX: number, startingY: number, world: World) {
    this.x = startingX;
    this.y = startingY;
    this.world = world;
  }

  abstract update(): void;
  abstract draw(): void;
  abstract setDirection(direction: Direction): void;
}

export enum Direction {
  left = "left",
  right = "right",
}
