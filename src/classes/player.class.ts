import { Character, Direction } from "./character.class";
import { IdleState, PlayerState } from "./states.class";
import { World } from "./world.class";
import { InputHandler } from "./inputHandler.class";
import { Hitbox } from "./hitbox.class";
import { Projectile } from "./projectile.class";

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

const SpriteFrameCount: Record<AnimationPlayer, number> = {
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
  frameWidth: number = 909.16;
  frameHeight: number = 909.16;
  maxFrameCount: number = 23;

  //Char stats
  hp: number = 10;
  speed: number = 10;
  public jumpForce: number = -20;
  public dashSpeed: number = 20;
  public slideCooldownTime: number = 0.5;
  public slideOnCooldown: boolean = false;
  projectileSpeed: number = 10;

  //State, Handlers, Inputs, etc..
  private state: PlayerState = new IdleState(this);
  private inputHandler: InputHandler = new InputHandler();
  public direction: Direction = Direction.right;
  public hitbox: Hitbox;
  hitboxOffsetX: number = -25;
  hitboxOffsetY: number = -15;
  hitboxOffsetWidth: number = -50;
  hitboxOffsetHeight: number = -30;
  public projectiles: Projectile[] = [];

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
  }

  initImgs() {
    this.imgLeft = document.getElementById("playerLeft") as HTMLImageElement;
    this.imgRight = document.getElementById("playerRight") as HTMLImageElement;
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
    this.hitbox.update();
    this.updateProj();
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
    this.hitbox.draw();
    this.drawProj();
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

  animateSprite() {
    if (this.direction === Direction.right) {
      if (this.spritePosition > SpriteFrameCount[this.animation] - 1)
        this.spritePosition = -1;
      this.spritePosition++;
    } else {
      if (
        this.spritePosition <
        this.maxFrameCount - SpriteFrameCount[this.animation] + 1
      )
        this.spritePosition = this.maxFrameCount + 1;
      this.spritePosition--;
    }
  }

  fireProj() {
    this.projectiles.push(new Projectile(this, this.world.ctx));
  }

  updateProj() {
    this.projectiles.forEach((proj) => {
      proj.update();
    });
  }

  drawProj() {
    this.projectiles.forEach((proj) => proj.draw());
  }

  attack() {}
}
