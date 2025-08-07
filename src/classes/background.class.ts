import { imageCache } from './imageCache';
import { World } from './world.class';

/**
 * Abstract class for my background Layers as a building block
 */
export abstract class Background {
  abstract parallaxDivider: number;
  img!: HTMLImageElement;
  width: number;
  height: number;
  x: number;
  y: number = 0;

  constructor(
    public world: World,
    position: number
  ) {
    this.width = this.world.width;
    this.height = this.world.height;
    this.x = position * this.width;
  }

  public draw() {
    this.world.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  public moveBackground(velocityX: number) {
    this.x -= velocityX / this.parallaxDivider;
  }
}

/**
 * Thats the background Layer, basicly just a color
 */
export class BackgroundLayer extends Background {
  parallaxDivider: number = 5;
  constructor(
    public world: World,
    public position: number
  ) {
    super(world, position);
    this.img = imageCache['bg'];
  }
}

/**
 * Thats the first Layer of my Background
 */
export class FirstLayer extends Background {
  parallaxDivider: number = 5;

  constructor(
    public world: World,
    public position: number
  ) {
    super(world, position);
    this.img = imageCache['first'];
  }
}

/**
 * Second Layer
 */
export class SecondLayer extends Background {
  parallaxDivider: number = 4;
  constructor(world: World, position: number) {
    super(world, position);
    this.img = imageCache['second'];
  }
}

/**
 * Third Layer
 */
export class ThirdLayer extends Background {
  parallaxDivider: number = 3;
  constructor(
    public world: World,
    public position: number
  ) {
    super(world, position);
    this.img = imageCache['third'];
  }
}

/**
 * Forth Layer
 */
export class ForthLayer extends Background {
  parallaxDivider: number = 2;
  constructor(
    public world: World,
    public position: number
  ) {
    super(world, position);
    this.img = imageCache['forth'];
  }
}
