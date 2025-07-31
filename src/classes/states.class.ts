import { Direction } from "./character.class";
import { Player } from "./player.class";
import { InputHandler } from "./inputHandler.class";

export interface PlayerState {
  handleInput(input: InputHandler): void;
  enter(): void;
  update(): void;
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

export class IdleState implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    if (input.lastInput === "d" || input.lastInput === "arrowRight") {
      this.player.setState(new RunningStateRight(this.player));
      this.player.setDirection(Direction.right);
    } else if (input.lastInput === "a" || input.lastInput === "arrowLeft") {
      this.player.setState(new RunningStateLeft(this.player));
      this.player.setDirection(Direction.left);
    } else if (input.lastInput === " ") {
      this.player.setState(new JumpingStateStart(this.player));
    } else if (input.lastInput === "f") {
      this.player.setState(new AttackingStateGround(this.player));
    } else if (input.lastInput === "control") {
      if (this.player.direction === Direction.right) {
        this.player.setState(new SlidingStateRight(this.player));
      } else if (this.player.direction === Direction.left) {
        this.player.setState(new SlidingStateLeft(this.player));
      }
    }
  }

  enter() {
    this.player.animation = Animation.idle;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = SpriteFrameCount[Animation.idle];
    }
  }

  update() {
    this.player.velocityX = 0;
    this.player.velocityY = 0;
  }
}

export class RunningStateRight implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    if (input.lastInput === "a" || input.lastInput === "arrowleft") {
      this.player.setState(new RunningStateLeft(this.player));
      this.player.setDirection(Direction.left);
    } else if (input.lastInput === " ") {
      this.player.setState(new JumpingStateStart(this.player));
    } else if (input.lastInput === "f") {
      this.player.setState(new AttackingStateGround(this.player));
    } else if (input.lastInput === "control") {
      this.player.setState(new SlidingStateRight(this.player));
    } else if (input.isIdle && this.player.isOnGround()) {
      this.player.setState(new IdleState(this.player));
    }
  }

  enter() {
    this.player.spritePosition = 0;
    this.player.animation = Animation.walking;
  }

  update() {
    this.player.velocityX = this.player.speed;
  }
}

export class RunningStateLeft implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    if (input.lastInput === "d" || input.lastInput === "arrowright") {
      this.player.setState(new RunningStateRight(this.player));
      this.player.setDirection(Direction.right);
    } else if (input.lastInput === " ") {
      this.player.setState(new JumpingStateStart(this.player));
    } else if (input.lastInput === "f") {
      this.player.setState(new AttackingStateGround(this.player));
    } else if (input.lastInput === "control") {
      this.player.setState(new SlidingStateLeft(this.player));
    } else if (input.isIdle && this.player.isOnGround()) {
      this.player.setState(new IdleState(this.player));
    }
  }

  enter() {
    this.player.spritePosition = SpriteFrameCount[Animation.walking];
    this.player.animation = Animation.walking;
  }

  update() {
    this.player.velocityX = -this.player.speed;
  }
}

export class JumpingStateStart implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    if (input.keyManager["d"]) {
      this.player.direction = Direction.right;
      this.player.velocityX = this.player.speed;
    } else if (input.keyManager["a"]) {
      this.player.direction = Direction.left;
      this.player.velocityX = -this.player.speed;
    } else if (input.lastInput === "control") {
      if (this.player.direction === Direction.right) {
        this.player.setState(new SlidingStateRight(this.player));
      } else if (this.player.direction === Direction.left) {
        this.player.setState(new SlidingStateLeft(this.player));
      }
    } else if (input.lastInput === "f") {
      if (this.player.direction === Direction.right)
        this.player.setState(new AttackingStateAir(this.player));
    } else if (input.isIdle && this.player.isOnGround()) {
      this.player.setState(new IdleState(this.player));
    }
  }

  enter(): void {
    this.player.animation = Animation.jumpstart;
    this.player.velocityY = this.player.jumpForce;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = SpriteFrameCount[Animation.jumpstart];
    }
  }

  update(): void {
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = SpriteFrameCount[Animation.jumpstart];
    }
  }
}

export class JumpingStateAscending implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    if (input.keyManager["d"]) {
      this.player.direction = Direction.right;
      this.player.velocityX = this.player.speed;
    } else if (input.keyManager["a"]) {
      this.player.direction = Direction.left;
      this.player.velocityX = -this.player.speed;
    }

    if (input.lastInput === "f") {
      this.player.setState(new AttackingStateAir(this.player));
    }
    if (input.lastInput === "control") {
      if (this.player.direction === Direction.right) {
        this.player.setState(new SlidingStateRight(this.player));
      } else if (this.player.direction === Direction.left) {
        this.player.setState(new SlidingStateLeft(this.player));
      }
    } else if (input.isIdle && this.player.isOnGround()) {
      this.player.setState(new IdleState(this.player));
    }
  }

  enter() {
    this.player.animation = Animation.ascending;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = SpriteFrameCount[Animation.ascending];
    }
  }

  update() {
    if (this.player.velocityY < 0) {
      this.player.setState(new JumpingStateDescending(this.player));
    }
  }
}

export class JumpingStateDescending implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    if (input.keyManager["d"]) {
      this.player.direction = Direction.right;
      this.player.velocityX = this.player.speed;
    } else if (input.keyManager["a"]) {
      this.player.direction = Direction.left;
      this.player.velocityX = -this.player.speed;
    }

    if (input.lastInput === "f") {
      this.player.setState(new AttackingStateAir(this.player));
    }
    if (input.lastInput === "control") {
      if (this.player.direction === Direction.right) {
        this.player.setState(new SlidingStateRight(this.player));
      } else if (this.player.direction === Direction.left) {
        this.player.setState(new SlidingStateLeft(this.player));
      }
    } else if (input.isIdle && this.player.isOnGround()) {
      this.player.setState(new IdleState(this.player));
    }
  }

  enter() {
    this.player.spritePosition = 0;
    this.player.animation = Animation.descending;
  }

  update() {
    if (this.player.isOnGround()) {
      this.player.velocityY = 0;
      this.player.y = this.player.world.groundLevel;
    }
  }
}

export class AttackingStateGround implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    return;
  }

  enter() {
    this.player.spritePosition = 0;
    this.player.animation = Animation.slashing;
  }

  update() {
    if (this.player.spritePosition > SpriteFrameCount[Animation.slashing]) {
      this.player.setState(new JumpingStateAscending(this.player));
    }
  }
}

export class AttackingStateAir implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {}

  enter() {
    this.player.spritePosition = 0;
    this.player.animation = Animation.walking;
  }

  update() {
    this.player.y -= this.player.speed;
  }
}

export class SlidingStateRight implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {}

  enter() {
    this.player.spritePosition = 0;
    this.player.animation = Animation.walking;
  }

  update() {
    this.player.velocityX += this.player.dashSpeed;
  }
}

export class SlidingStateLeft implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {}

  enter() {
    this.player.spritePosition = 0;
    this.player.animation = Animation.walking;
  }

  update() {
    this.player.velocityX = this.player.dashSpeed;
  }
}
