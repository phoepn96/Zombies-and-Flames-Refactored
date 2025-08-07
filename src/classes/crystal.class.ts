import { soundManager } from "../main";
import { imageCache } from "./imageCache";
import { World } from "./world.class";

export class Crystal {
  constructor(public x: number, public y: number, public world: World) {}
  img: HTMLImageElement = imageCache["crystals"];
  frameWidth: number = 512;
  frameHeight: number = 512;
  width: number = 50;
  height: number = 50;
  spritePosition: number = 0;
  animationRow: number = 0;
  isPickedUp = false;

  draw() {
    this.world.ctx.drawImage(
      this.img,
      this.frameWidth * this.spritePosition,
      this.frameHeight * this.animationRow,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update() {
    this.animateSprite();
    this.pickUp();
  }

  animateSprite() {
    if (this.spritePosition > 0 && this.animationRow === 0) {
      this.spritePosition = 0;
      this.animationRow = 1;
    }
    if (this.spritePosition > 0 && this.animationRow === 1) {
      this.spritePosition = 0;
      this.animationRow = 0;
    }
    this.spritePosition++;
  }

  pickUp() {
    if (
      this.world.player.hitbox.x + this.world.player.hitbox.width >=
        this.x + 20 &&
      this.world.player.hitbox.x < this.x + this.width - 20 &&
      this.world.player.hitbox.y + this.world.player.hitbox.height >= this.y
    ) {
      this.isPickedUp = true;
      this.world.player.crystals++;
      soundManager.playSound("pickup");
    }
  }

  move() {
    this.x -= this.world.player.velocityX * 0.5;
  }
}
