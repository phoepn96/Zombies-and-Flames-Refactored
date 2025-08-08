import { Character } from './character.class';
import { Projectile } from './projectile.class';
import { World } from './world.class';

/**
 * The hitbox of all objects which need to collide
 */
export class Hitbox {
  /**
   * stats the hitbox requieres to draw
   */
  x!: number;
  y!: number;
  world!: World;
  ctx!: CanvasRenderingContext2D;

  constructor(
    public originClass: Character | Projectile,
    public width: number,
    public height: number,
    public offsetX: number,
    public offsetY: number,
    public offsetWidth: number,
    public offsetHeight: number
  ) {
    this.ctx = this.originClass.world.ctx;
    this.x = originClass.x - this.offsetX;
    this.y = originClass.y - this.offsetY;
    this.width = width + offsetWidth;
    this.height = height + offsetHeight;
  }

  /**
   * updates the hitbox
   */
  update() {
    this.x = this.originClass.x - this.offsetX;
    this.y = this.originClass.y - this.offsetY;
  }

  /**
   * draws the hitbox
   */
  draw() {
    this.ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}
