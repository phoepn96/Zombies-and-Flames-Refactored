import { World } from "./world.class";

const bg = document.getElementById("bg");
const third = document.getElementById("third");
const second = document.getElementById("second");
const first = document.getElementById("first");
const forth = document.getElementById("forth");

export abstract class Background {
  abstract parallaxDivider: number;
  abstract img: HTMLImageElement;
  width: number;
  height: number;
  x: number;
  y: number = 0;

  constructor(public world: World, position: number) {
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
export class BackgroundLayer extends Background {
  parallaxDivider: number = 5;
  img: HTMLImageElement = bg as HTMLImageElement;
  constructor(public world: World, public position: number) {
    super(world, position);
  }
}

export class FirstLayer extends Background {
  parallaxDivider: number = 5;
  img: HTMLImageElement = first as HTMLImageElement;
  constructor(public world: World, public position: number) {
    super(world, position);
  }
}

export class SecondLayer extends Background {
  parallaxDivider: number = 4;
  img: HTMLImageElement = second as HTMLImageElement;
  constructor(world: World, position: number) {
    super(world, position);
  }
}

export class ThirdLayer extends Background {
  parallaxDivider: number = 3;
  img: HTMLImageElement = third as HTMLImageElement;
  constructor(public world: World, public position: number) {
    super(world, position);
  }
}

export class ForthLayer extends Background {
  parallaxDivider: number = 2;
  img: HTMLImageElement = forth as HTMLImageElement;
  constructor(public world: World, public position: number) {
    super(world, position);
  }
}
