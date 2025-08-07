import { imageCache } from "./imageCache";
import { Character, Direction } from "./character.class";
import { DyingState, IdleState, PlayerState } from "./states.class";
import { World } from "./world.class";
import { InputHandler } from "./inputHandler.class";
import { Hitbox } from "./hitbox.class";
import { Projectile } from "./projectile.class";
import { Boss } from "./enemie.class";
import { soundManager } from "../main";

export enum AnimationPlayer {
  dying = 0,
  descending = 1,
  hurt = 2,
  idle = 3,
  ascending = 4,
  jumpstart = 5,
  walking = 6,
  slashing = 9,
  slashingAir = 10,
  sliding = 11,
}

export const SpriteFrameCount: Record<AnimationPlayer, number> = {
  [AnimationPlayer.dying]: 14,
  [AnimationPlayer.descending]: 5,
  [AnimationPlayer.hurt]: 11,
  [AnimationPlayer.idle]: 17,
  [AnimationPlayer.ascending]: 5,
  [AnimationPlayer.jumpstart]: 5,
  [AnimationPlayer.walking]: 23,
  [AnimationPlayer.slashing]: 11,
  [AnimationPlayer.slashingAir]: 11,
  [AnimationPlayer.sliding]: 5,
};

export class Player extends Character {
  //Draw Values
  width: number = 100;
  height: number = 100;

  //Img Stuff
  protected imgLeft!: HTMLImageElement;
  protected imgRight!: HTMLImageElement;
  protected img!: HTMLImageElement;

  //Animation Values
  public animation: AnimationPlayer = AnimationPlayer.idle;
  frameWidth: number = 80;
  frameHeight: number = 80;
  maxFrameCount: number = 23;

  //Char stats
  hp: number = 5;
  speed: number = 10;
  public jumpForce: number = -20;
  public dashSpeed: number = 20;
  public slideCooldownTime: number = 0.5;
  public slideOnCooldown: boolean = false;
  projectileSpeed: number = 10;
  public hitCooldown: number = 1;
  public hitOnCooldown = false;
  public stompCooldownTime = 0.2;
  public stompCooldown = false;
  public crystals: number = 0;

  //State, Handlers, Inputs, etc..
  public state: PlayerState = new IdleState(this);
  private inputHandler: InputHandler = new InputHandler();
  public direction: Direction = Direction.right;
  public hitbox: Hitbox;
  hitboxOffsetX: number = -25;
  hitboxOffsetY: number = -15;
  hitboxOffsetWidth: number = -50;
  hitboxOffsetHeight: number = -30;
  public projectiles: Projectile[] = [];
  public lifebar!: HTMLImageElement;
  public crystal!: HTMLImageElement;

  constructor(startingX: number, startingY: number, world: World) {
    super(startingX, startingY, world);
    this.hitbox = new Hitbox(
      this,
      this.width,
      this.height,
      this.hitboxOffsetX,
      this.hitboxOffsetY,
      this.hitboxOffsetWidth,
      this.hitboxOffsetHeight
    );
    this.lifebar = imageCache["lifebar"];
    this.crystal = imageCache["crystals"];
  }

  initImgs() {
    this.imgLeft = imageCache["playerRight"];
    this.imgRight = imageCache["playerLeft"];
    this.img = this.imgRight;
  }

  setState(state: PlayerState) {
    this.state = state;
    this.state.enter();
  }

  update(): void {
    this.state.handleInput(this.inputHandler);
    this.state.update();
    this.setImage();
    this.applyGravity();
    this.animateSprite();
    this.move();
    this.y += this.velocityY;
    this.updateProj();
    this.hitbox.update();
    this.removeProjectiles();
    this.resetGround();
    this.checkDead();
  }

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
    this.drawProj();
    this.drawLifebarAndCrystals();
  }

  setImage() {
    if (this.direction === Direction.right) {
      this.img = this.imgRight;
    } else {
      this.img = this.imgLeft;
    }
  }

  move() {
    this.world.backgrounds.forEach((backgroundLayerArr) => {
      backgroundLayerArr.forEach((background) => {
        background.moveBackground(this.velocityX);
      });
    });
    this.world.enemies.forEach((enemy) => {
      enemy.move();
      if (enemy instanceof Boss) {
        enemy.projectiles.forEach((proj) => proj.move());
      }
    });
    this.world.crystals.forEach((crystal) => {
      crystal.move();
    });
  }

  isOnGround(): boolean {
    return this.y >= this.world.groundLevel;
  }

  setDirection(direction: Direction): void {
    this.direction = direction;
  }

  applyGravity() {
    if (this.isOnGround()) {
      this.y = this.world.groundLevel;
    } else {
      this.velocityY += this.world.gravity;
    }
  }

  checkDead() {
    if (this.hp <= 0) {
      this.hp = 0;
      if (this.state instanceof DyingState) return;
      this.setState(new DyingState(this));
    }
  }

  animateSprite() {
    if (this.direction === Direction.right) {
      if (this.spritePosition > SpriteFrameCount[this.animation] - 1) {
        if (this.state instanceof DyingState) return;
        this.spritePosition = -1;
      }

      this.spritePosition++;
    } else {
      if (
        this.spritePosition <
        this.maxFrameCount - SpriteFrameCount[this.animation] + 1
      ) {
        if (this.state instanceof DyingState) return;
        this.spritePosition = this.maxFrameCount + 1;
      }

      this.spritePosition--;
    }
  }

  fireProj() {
    this.projectiles.push(new Projectile(this, this.world.ctx));
    soundManager.playSound("playerProj");
    setTimeout(() => {
      soundManager.stopSound("playerProj");
    }, 1000);
  }

  updateProj() {
    this.projectiles.forEach((proj) => {
      proj.update();
    });
  }

  drawProj() {
    this.projectiles.forEach((proj) => proj.draw());
  }

  removeProjectiles() {
    this.projectiles = this.projectiles.filter((projectile) => {
      return !projectile.removeProj;
    });
  }

  drawLifebarAndCrystals() {
    this.world.ctx.drawImage(this.lifebar, 50, 50, 75, 75);
    this.world.ctx.fillStyle = "white";
    this.world.ctx.fillText(this.hp.toString(), 84, 90);
    this.world.ctx.drawImage(this.crystal, 0, 0, 512, 512, 580, 50, 75, 75);
    this.world.ctx.fillText(this.crystals.toString(), 617, 95);
  }

  resetGround() {
    if (this.y > this.world.groundLevel) {
      this.y = this.world.groundLevel;
    }
  }
}
