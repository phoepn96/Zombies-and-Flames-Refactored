import { Character, Direction } from "./character.class";
import { IdleState, PlayerState } from "./states.class";
import { World } from "./world.class";
import { InputHandler } from "./inputHandler.class";

export enum Animation {
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

const SpriteFrameCount: Record<Animation, number> = {
  [Animation.dying]: 14,
  [Animation.descending]: 5,
  [Animation.hurt]: 11,
  [Animation.idle]: 17,
  [Animation.ascending]: 5,
  [Animation.jumpstart]: 5,
  [Animation.walking]: 23,
  [Animation.slashing]: 11,
  [Animation.slashingAir]: 11,
  [Animation.sliding]: 5,
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
  public animation: Animation = Animation.idle;
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

  //State, Handlers, Inputs, etc..
  private state: PlayerState = new IdleState(this);
  private inputHandler: InputHandler = new InputHandler();
  public direction: Direction = Direction.right;

  constructor(startingX: number, startingY: number, world: World) {
    super(startingX, startingY, world);
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
    this.x += this.velocityX;
    this.y += this.velocityY;
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
  }

  setImage() {
    if (this.direction === Direction.right) {
      this.img = this.imgRight;
    } else {
      this.img = this.imgLeft;
    }
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

  fireProj() {}
}
