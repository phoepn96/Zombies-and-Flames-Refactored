import { Direction } from "./character.class";
import { Player } from "./player.class";
import { InputHandler } from "./inputHandler.class";

export interface PlayerState {
  handleInput(input: InputHandler): void;
  enter(): void;
  update(): void;
}

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

export class IdleState implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    if (input.keyManager["d"] || input.keyManager["arrowright"]) {
      this.player.setState(new RunningStateRight(this.player));
      this.player.setDirection(Direction.right);
    } else if (input.keyManager["a"] || input.keyManager["arrowleft"]) {
      this.player.setState(new RunningStateLeft(this.player));
      this.player.setDirection(Direction.left);
    } else if (input.keyManager[" "]) {
      this.player.setState(new JumpingStateStart(this.player));
    } else if (input.keyManager["f"]) {
      this.player.setState(new AttackingStateGround(this.player));
    } else if (input.keyManager["control"] && !this.player.slideOnCooldown) {
      if (this.player.direction === Direction.right) {
        this.player.setState(new SlidingStateRight(this.player));
      } else if (this.player.direction === Direction.left) {
        this.player.setState(new SlidingStateLeft(this.player));
      }
    }
  }

  enter() {
    this.player.animation = AnimationPlayer.idle;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = this.player.maxFrameCount;
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
    if (input.isIdle && this.player.isOnGround()) {
      this.player.setState(new IdleState(this.player));
    } else if (input.keyManager["a"] || input.keyManager["arrowleft"]) {
      this.player.setState(new RunningStateLeft(this.player));
      this.player.setDirection(Direction.left);
    } else if (input.keyManager[" "]) {
      this.player.setState(new JumpingStateStart(this.player));
    } else if (input.keyManager["f"]) {
      this.player.setState(new AttackingStateGround(this.player));
    } else if (input.keyManager["control"] && !this.player.slideOnCooldown) {
      this.player.setState(new SlidingStateRight(this.player));
    }
  }

  enter() {
    this.player.spritePosition = 0;
    this.player.animation = AnimationPlayer.walking;
    this.player.setDirection(Direction.right);
  }

  update() {
    this.player.velocityX = this.player.speed;
  }
}

export class RunningStateLeft implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    if (input.keyManager["d"] || input.keyManager["arrowright"]) {
      this.player.setState(new RunningStateRight(this.player));
      this.player.setDirection(Direction.right);
    } else if (input.keyManager[" "]) {
      this.player.setState(new JumpingStateStart(this.player));
    } else if (input.keyManager["f"]) {
      this.player.setState(new AttackingStateGround(this.player));
    } else if (input.keyManager["control"] && !this.player.slideOnCooldown) {
      this.player.setState(new SlidingStateLeft(this.player));
    } else if (input.isIdle && this.player.isOnGround()) {
      this.player.setState(new IdleState(this.player));
    }
  }

  enter() {
    this.player.spritePosition = this.player.maxFrameCount;
    this.player.animation = AnimationPlayer.walking;
    this.player.setDirection(Direction.left);
  }

  update() {
    this.player.velocityX = -this.player.speed;
  }
}

export class JumpingStateStart implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    if (input.keyManager["d"] || input.keyManager["arrowright"]) {
      this.player.direction = Direction.right;
      this.player.velocityX = this.player.speed;
    } else if (input.keyManager["a"] || input.keyManager["arrowleft"]) {
      this.player.direction = Direction.left;
      this.player.velocityX = -this.player.speed;
    } else if (input.keyManager["control"] && !this.player.slideOnCooldown) {
      if (this.player.direction === Direction.right) {
        this.player.setState(new SlidingStateRight(this.player));
      } else if (this.player.direction === Direction.left) {
        this.player.setState(new SlidingStateLeft(this.player));
      }
    } else if (input.keyManager["f"]) {
      if (this.player.direction === Direction.right)
        this.player.setState(new AttackingStateAir(this.player));
    } else if (input.isIdle && this.player.isOnGround()) {
      this.player.setState(new IdleState(this.player));
    }
  }

  enter(): void {
    this.player.animation = AnimationPlayer.jumpstart;
    this.player.velocityY = this.player.jumpForce;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = this.player.maxFrameCount;
    }
  }

  update(): void {
    if (this.player.direction === Direction.right) {
      if (
        this.player.spritePosition >
        SpriteFrameCount[AnimationPlayer.jumpstart] - 1
      ) {
        this.player.setState(new JumpingStateAscending(this.player));
      }
    } else {
      if (
        this.player.spritePosition <
        this.player.maxFrameCount -
          SpriteFrameCount[AnimationPlayer.jumpstart] +
          1
      ) {
        this.player.setState(new JumpingStateAscending(this.player));
      }
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

    if (input.keyManager["f"]) {
      this.player.setState(new AttackingStateAir(this.player));
    }
    if (input.keyManager["control"] && !this.player.slideOnCooldown) {
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
    this.player.animation = AnimationPlayer.ascending;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = SpriteFrameCount[AnimationPlayer.ascending];
    }
  }

  update() {
    if (this.player.velocityY > 0) {
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

    if (input.keyManager["f"]) {
      this.player.setState(new AttackingStateAir(this.player));
    }
    if (input.keyManager["control"] && !this.player.slideOnCooldown) {
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
    this.player.animation = AnimationPlayer.descending;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = this.player.maxFrameCount;
    }
  }

  update() {
    if (this.player.isOnGround()) {
      this.player.velocityY = 0;
      this.player.y = this.player.world.groundLevel;
      this.player.setState(new IdleState(this.player));
    }
  }
}

export class AttackingStateGround implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    return;
  }

  enter() {
    this.player.animation = AnimationPlayer.slashing;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = this.player.maxFrameCount;
    }
  }

  update() {
    if (this.player.direction === Direction.right) {
      this.player.velocityX = -this.player.speed / 2;
      if (
        this.player.spritePosition >
        SpriteFrameCount[AnimationPlayer.slashing] - 1
      ) {
        this.player.fireProj();
        this.player.setState(new IdleState(this.player));
      }
    } else {
      this.player.velocityX = this.player.speed / 2;
      if (
        this.player.spritePosition <
        this.player.maxFrameCount -
          SpriteFrameCount[AnimationPlayer.slashing] +
          1
      ) {
        this.player.fireProj();
        this.player.setState(new IdleState(this.player));
      }
    }
  }
}

export class AttackingStateAir implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {
    return;
  }

  enter() {
    this.player.animation = AnimationPlayer.slashingAir;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = this.player.maxFrameCount;
    }
  }

  update() {
    if (this.player.direction === Direction.right) {
      this.player.velocityX = -this.player.speed / 2;
      if (
        this.player.spritePosition >
        SpriteFrameCount[AnimationPlayer.slashingAir] - 1
      ) {
        this.player.fireProj();
        if (this.player.isOnGround()) {
          this.player.setState(new IdleState(this.player));
        } else {
          this.player.setState(new JumpingStateDescending(this.player));
        }
      }
    } else {
      this.player.velocityX = this.player.speed / 2;
      if (
        this.player.spritePosition <
        this.player.maxFrameCount -
          SpriteFrameCount[AnimationPlayer.slashingAir] +
          1
      ) {
        this.player.fireProj();
        if (this.player.isOnGround()) {
          this.player.setState(new IdleState(this.player));
        } else {
          this.player.setState(new JumpingStateDescending(this.player));
        }
      }
    }
  }
}

export class SlidingStateRight implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {}

  enter() {
    this.player.spritePosition = 0;
    this.player.animation = AnimationPlayer.sliding;
  }

  update() {
    if (this.player.crystals <= 0) {
      this.player.setState(new IdleState(this.player));
      return;
    }
    this.player.velocityX = this.player.dashSpeed;
    if (
      this.player.spritePosition >
      SpriteFrameCount[AnimationPlayer.sliding] - 1
    ) {
      this.player.crystals--;
      this.setSlideOnCooldown();
      if (this.player.isOnGround()) {
        this.player.setState(new IdleState(this.player));
        return;
      } else {
        this.player.setState(new JumpingStateDescending(this.player));
      }
    }
  }
  setSlideOnCooldown() {
    this.player.slideOnCooldown = true;
    setTimeout(() => {
      this.player.slideOnCooldown = false;
    }, this.player.slideCooldownTime * 1000);
  }
}

export class SlidingStateLeft implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {}

  enter() {
    this.player.spritePosition = this.player.maxFrameCount;
    this.player.animation = AnimationPlayer.sliding;
  }

  update() {
    if (this.player.crystals <= 0) {
      this.player.setState(new IdleState(this.player));
      return;
    }

    this.player.velocityX = -this.player.dashSpeed;

    if (
      this.player.spritePosition <
      this.player.maxFrameCount - SpriteFrameCount[AnimationPlayer.sliding] + 1
    ) {
      this.player.crystals--;
      this.setSlideOnCooldown();
      if (this.player.isOnGround()) {
        this.player.setState(new IdleState(this.player));
        return;
      } else {
        this.player.setState(new JumpingStateDescending(this.player));
      }
    }
  }

  setSlideOnCooldown() {
    this.player.slideOnCooldown = true;
    setTimeout(() => {
      this.player.slideOnCooldown = false;
    }, this.player.slideCooldownTime * 1000);
  }
}

export class HurtState implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {}

  enter() {
    if (this.player.hitOnCooldown) return;
    this.player.hitOnCooldown = true;
    setTimeout(() => {
      this.player.hitOnCooldown = false;
    }, 1000 * this.player.hitCooldown);
    this.player.hp -= 1;
    this.player.animation = AnimationPlayer.hurt;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = this.player.maxFrameCount;
    }
  }

  update() {
    this.player.velocityX = 0;
    if (this.player.direction === Direction.right) {
      if (
        this.player.spritePosition >
        SpriteFrameCount[AnimationPlayer.hurt] - 1
      ) {
        this.player.setState(new IdleState(this.player));
      }
    } else {
      if (
        this.player.spritePosition <
        this.player.maxFrameCount - SpriteFrameCount[AnimationPlayer.hurt] + 1
      ) {
        this.player.setState(new IdleState(this.player));
      }
    }
  }
}

export class DyingState implements PlayerState {
  constructor(private player: Player) {}

  handleInput(input: InputHandler): void {}

  enter() {
    this.player.animation = AnimationPlayer.dying;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = this.player.maxFrameCount;
    }
  }

  update() {
    this.player.velocityX = 0;
    if (this.player.direction === Direction.right) {
      if (
        this.player.spritePosition >
        SpriteFrameCount[AnimationPlayer.dying] - 1
      ) {
        this.player.world.gameOver();
      }
    } else {
      if (
        this.player.spritePosition <
        this.player.maxFrameCount - SpriteFrameCount[AnimationPlayer.dying] + 1
      ) {
        this.player.world.gameOver();
      }
    }
  }
}
