import { Direction } from "./character.class";
import { Animation, Player } from "./player.class";

export interface PlayerState {
  handleInput(input: InputHandler): void;
  enter(): void;
  update(): void;
}

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
    }
  }

  enter() {
    this.player.spritePosition = 0;
    this.player.animation = Animation.idle;
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
    }
  }

  enter() {
    this.player.spritePosition = 0;
    this.player.animation = Animation.walking;
  }

  update() {
    this.player.velocityX = -this.player.speed;
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

export class JumpingStateStart implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    if (input.keyManager["d"]) {
      this.player.direction = Direction.right;
      this.player.velocityX = this.player.speed;
    } else if (input.keyManager["a"]) {
      this.player.direction = Direction.left;
      this.player.velocityX = -this.player.speed;
    }
  }

  enter(): void {
    this.player.spritePosition = 0;
    this.player.animation = Animation.jumpstart;
  }

  update(): void {
    this.player.velocityY = this.player.jumpForce;
    if (this.player.spritePosition > SpriteFrameCount[Animation.jumpstart]) {
      this.player.setState(new AscendingState(this.player));
    }
  }
}

export class JumpingStateNeutral implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    if (input.lastInput === "d" || input.lastInput === "arrowright") {
      this.player.setState(new JumpingStateRight(this.player));
    } else if (input.lastInput === "a" || input.lastInput === "arrowleft") {
      this.player.setState(new JumpingStateLeft(this.player));
    } else if (input.lastInput === "f") {
      this.player.setState(new AttackingState(this.player));
    }
  }
}

export class JumpingStateRight implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    if (input.lastInput === "d" || input.lastInput === "arrowright") {
      this.player.setState(new RunningStateRight(this.player));
    }
  }

  enter() {
    this.player.spritePosition = 0;
    this.player.animation = Animation.walking;
  }

  update() {
    this.player.y -= this.player.speed;
  }
}

export class JumpingStateLeft implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    if (input.lastInput === "d" || input.lastInput === "arrowright") {
      this.player.setState(new JumpingStateRight(this.player));
    }
  }

  enter() {
    this.player.spritePosition = 0;
    this.player.animation = Animation.walking;
  }

  update() {
    this.player.y -= this.player.speed;
  }
}

export class AttackingStateGround implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    if (input.lastInput === "d" || input.lastInput === "arrowright") {
      this.player.setState(new JumpingStateRight(this.player));
    }
  }

  enter() {
    this.player.spritePosition = 0;
    this.player.animation = Animation.walking;
  }

  update() {
    this.player.y -= this.player.speed;
  }
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
  [Animation.slahingAir]: 11,
  [Animation.sliding]: 5,
};
