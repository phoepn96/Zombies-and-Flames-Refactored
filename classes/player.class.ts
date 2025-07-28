import { Character, Direction } from "./character.class";
import { IdleState, PlayerState } from "./states.class";
import { World } from "./world.class";

export class Player extends Character {
  //Draw Values
  width: number = 100;
  height: number = 100;

  //Img Stuff
  protected imgLeft: HTMLImageElement = document.getElementById(
    "playerLeft"
  ) as HTMLImageElement;
  protected imgRight: HTMLImageElement = document.getElementById(
    "playerRight"
  ) as HTMLImageElement;
  protected img: HTMLImageElement = this.imgRight;
  //Animation Values

  public animation: Animation = Animation.idle;
  frameWidth: number = 909.16;
  frameHeight: number = 909.16;

  //Char stats
  hp: number = 10;
  speed: number = 10;
  public jumpForce: number = 20;

  //State, Handlers, Inputs, etc..
  private state: PlayerState = new IdleState(this);
  private inputHandler: InputHandler = new InputHandler();
  public direction: Direction = Direction.right;

  constructor(startingX: number, startingY: number, world: World) {
    super(startingX, startingY, world);
  }

  setState(state: PlayerState) {
    this.state = state;
    this.state.enter();
  }

  update(): void {
    this.state.handleInput(this.inputHandler);
    this.state.update();
    this.x = this.velocityX;
    this.y = this.velocityY;
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

  isOnGround(): boolean {
    return this.y > this.world.groundLevel;
  }

  setDirection(direction: Direction): void {
    this.direction = direction;
  }
}

export enum Animation {
  dying = 0,
  descending = 1,
  hurt = 2,
  idle = 3,
  ascending = 4,
  jumpstart = 5,
  walking = 6,
  slashing = 9,
  slahingAir = 10,
  sliding = 11,
}
