import { Character, Direction } from "./character.class";
import { Hitbox } from "./hitbox.class";
import { Player } from "./player.class";
import { World } from "./world.class";

const playerProjRight: HTMLImageElement = document.getElementById(
  "playerProj"
) as HTMLImageElement;
const playerProjLeft: HTMLImageElement = document.getElementById(
  "playerProjLeft"
) as HTMLImageElement;
const bossProj: HTMLImageElement = document.getElementById(
  "bossProj"
) as HTMLImageElement;

export class Projectile {
  img!: HTMLImageElement;
  x!: number;
  y!: number;
  world!: World;
  projectileSpeed!: number;
  originClass!: Character;
  ctx!: CanvasRenderingContext2D;
  spriteWidth!: number;
  spriteHeight!: number;
  spritePosition: number = 0;
  spriteRow!: number;
  origin: string = "player";
  removeProj: boolean = false;
  direction: Direction = Direction.right;
  projectileSizeWidth!: number;
  projectileSizeHeight!: number;
  hitbox!: Hitbox;
  hitboxOffsetX: number = -50;
  hitboxOffsetY: number = -40;
  hitboxOffsetWidth: number = -80;
  hitboxOffsetHeight: number = -70;
  bossProjDuration: number = 2;
  counter: number = 0;
  imgRight: HTMLImageElement = playerProjRight;
  imgLeft: HTMLImageElement = playerProjLeft;

  constructor(originClass: Character, ctx: CanvasRenderingContext2D) {
    this.x = originClass.x;
    this.y = originClass.y;
    this.world = originClass.world;
    this.projectileSpeed = originClass.projectileSpeed;
    this.originClass = originClass;
    this.ctx = ctx;
    this.direction = originClass.direction;

    if (originClass instanceof Player) {
      this.img = playerProjRight;
      this.spriteRow = 0;
      this.spriteWidth = 1660;
      this.spriteHeight = 1070;
      this.origin = "player";
      this.projectileSizeHeight = 100;
      this.projectileSizeWidth = 150;
      this.hitboxOffsetX = -50;
      this.hitboxOffsetY = -40;
      this.hitboxOffsetWidth = -80;
      this.hitboxOffsetHeight = -70;
    } else {
      this.img = bossProj;
      this.spriteRow = 0;
      this.spriteWidth = 339;
      this.spriteHeight = 404;
      this.projectileSizeHeight = 100;
      this.projectileSizeWidth = 80;
      this.hitboxOffsetX = -15;
      this.hitboxOffsetY = -20;
      this.hitboxOffsetWidth = -40;
      this.hitboxOffsetHeight = -20;
      this.origin = "boss";
      this.y = originClass.y + 22;
      if (this.direction === "right") {
        this.x = originClass.x + originClass.width - 40;
      } else {
        this.x = originClass.x - 20;
      }
    }

    this.hitbox = new Hitbox(
      this,
      this.projectileSizeWidth,
      this.projectileSizeHeight,
      this.hitboxOffsetX,
      this.hitboxOffsetY,
      this.hitboxOffsetWidth,
      this.hitboxOffsetHeight
    );
    console.log(this.originClass instanceof Player);
  }

  update() {
    this.moveProj();
    this.checkIfOutOfScreen();
    this.animateProj();
    this.hitbox.update();
    if (this.origin === "player") {
      if (this.direction === Direction.right) {
        this.img = this.imgRight;
      } else {
        this.img = this.imgLeft;
      }
    }
  }

  draw() {
    this.ctx.drawImage(
      this.img,
      this.spriteWidth * this.spritePosition,
      this.spriteHeight * this.spriteRow,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.projectileSizeWidth,
      this.projectileSizeHeight
    );
    this.hitbox.draw();
  }

  moveProj() {
    if (this.origin === "boss") return;
    if (this.direction === "right") {
      this.x += this.projectileSpeed;
    } else {
      this.x -= this.projectileSpeed;
    }
  }

  checkIfOutOfScreen() {
    if (this.x + this.spriteWidth < 0) {
      this.removeProj = true;
    } else if (this.x > this.world.width) {
      this.removeProj = true;
    }
  }

  animateProj() {
    if (this.origin === "player") {
      if (this.spritePosition > 15) this.spritePosition = 10;
      this.spritePosition++;
    } else {
      if (this.spritePosition > 51) {
        if (this.counter < this.bossProjDuration) {
          this.spritePosition = -1;
          this.counter++;
        } else {
          this.removeProj = true;
        }
      }
      this.spritePosition++;
    }
  }

  move() {
    this.x -= this.world.player.velocityX * 0.5;
  }
}
