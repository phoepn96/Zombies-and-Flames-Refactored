import { Direction } from './character.class';
import { Player } from './player.class';
import { InputHandler } from './inputHandler.class';
import { EnemyIdleState } from './enemieStates.class';
import { soundManager } from '../main';

/**
 * interface for all the playerstates, enter always sets the correct animation of the player, handle input always checks for the current inputs of the input handler and sets the states of the player
 */
export interface PlayerState {
  handleInput(input: InputHandler): void;
  enter(): void;
  update(): void;
}

/**
 * animations of the player as enum for the spritesheet
 */
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

/**
 * Record thats holds the frames of the corrosponding animation
 */
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

/**
 * idle state of the player
 */
export class IdleState implements PlayerState {
  constructor(private player: Player) {}

  /**
   * handles the current inputs and sets new states based on these inputs
   *
   * @param input the inputhandler of the player
   */
  handleInput(input: InputHandler): void {
    if (input.keyManager['d'] || input.keyManager['arrowright']) {
      this.player.setState(new RunningStateRight(this.player));
      this.player.setDirection(Direction.right);
    } else if (input.keyManager['a'] || input.keyManager['arrowleft']) {
      this.player.setState(new RunningStateLeft(this.player));
      this.player.setDirection(Direction.left);
    } else if (input.keyManager[' ']) {
      this.player.setState(new JumpingStateStart(this.player));
    } else if (input.keyManager['f']) {
      this.player.setState(new AttackingStateGround(this.player));
    } else if (input.keyManager['control'] && !this.player.slideOnCooldown) {
      if (this.player.direction === Direction.right) {
        this.player.setState(new SlidingStateRight(this.player));
      } else if (this.player.direction === Direction.left) {
        this.player.setState(new SlidingStateLeft(this.player));
      }
    }
  }

  /**
   * sets the animation to idle
   */
  enter() {
    this.player.isRunning = false;
    this.player.animation = AnimationPlayer.idle;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = this.player.maxFrameCount;
    }
  }

  /**
   * sets the velocity x and y to 0 so the player doesnt move
   */
  update() {
    this.player.velocityX = 0;
    this.player.velocityY = 0;
  }
}

/**
 * The running state of the player to the right
 */
export class RunningStateRight implements PlayerState {
  constructor(private player: Player) {}

  /**
   * handles the current inputs and sets new states based on these inputs
   *
   * @param input the inputhandler of the player
   */
  handleInput(input: InputHandler): void {
    if (input.isIdle && this.player.isOnGround()) {
      this.player.setState(new IdleState(this.player));
    } else if (input.keyManager['a'] || input.keyManager['arrowleft']) {
      this.player.setState(new RunningStateLeft(this.player));
      this.player.setDirection(Direction.left);
    } else if (input.keyManager[' ']) {
      this.player.setState(new JumpingStateStart(this.player));
    } else if (input.keyManager['f']) {
      this.player.setState(new AttackingStateGround(this.player));
    } else if (input.keyManager['control'] && !this.player.slideOnCooldown) {
      this.player.setState(new SlidingStateRight(this.player));
    }
  }

  /**
   * sets the animation to walking and the direction of the player
   */
  enter() {
    this.player.isRunning = true;
    this.player.spritePosition = 0;
    this.player.animation = AnimationPlayer.walking;
    this.player.setDirection(Direction.right);
  }

  /**
   * changes the velocity x of the player
   */
  update() {
    this.player.velocityX = this.player.speed;
  }
}

/**
 * the running state of the player left
 */
export class RunningStateLeft implements PlayerState {
  constructor(private player: Player) {}

  /**
   * handles the current inputs and sets new states based on these inputs
   *
   * @param input the inputhandler of the player
   */
  handleInput(input: InputHandler): void {
    if (input.keyManager['d'] || input.keyManager['arrowright']) {
      this.player.setState(new RunningStateRight(this.player));
      this.player.setDirection(Direction.right);
    } else if (input.keyManager[' ']) {
      this.player.setState(new JumpingStateStart(this.player));
    } else if (input.keyManager['f']) {
      this.player.setState(new AttackingStateGround(this.player));
    } else if (input.keyManager['control'] && !this.player.slideOnCooldown) {
      this.player.setState(new SlidingStateLeft(this.player));
    } else if (input.isIdle && this.player.isOnGround()) {
      this.player.setState(new IdleState(this.player));
    }
  }

  /**
   * sets the animation to walking and the direction of the player
   */
  enter() {
    this.player.isRunning = true;
    this.player.spritePosition = this.player.maxFrameCount;
    this.player.animation = AnimationPlayer.walking;
    this.player.setDirection(Direction.left);
  }

  /**
   * changes the velocity x of the player
   */
  update() {
    this.player.velocityX = -this.player.speed;
  }
}

/**
 * the jumping start state of the player
 */
export class JumpingStateStart implements PlayerState {
  constructor(private player: Player) {}

  /**
   * handles the current inputs and sets new states based on these inputs
   *
   * @param input the inputhandler of the player
   */
  handleInput(input: InputHandler): void {
    if (input.keyManager['d'] || input.keyManager['arrowright']) {
      this.player.direction = Direction.right;
      this.player.velocityX = this.player.speed;
    } else if (input.keyManager['a'] || input.keyManager['arrowleft']) {
      this.player.direction = Direction.left;
      this.player.velocityX = -this.player.speed;
    } else if (input.keyManager['control'] && !this.player.slideOnCooldown) {
      if (this.player.direction === Direction.right) {
        this.player.setState(new SlidingStateRight(this.player));
      } else if (this.player.direction === Direction.left) {
        this.player.setState(new SlidingStateLeft(this.player));
      }
    } else if (input.keyManager['f']) {
      if (this.player.direction === Direction.right)
        this.player.setState(new AttackingStateAir(this.player));
    } else if (input.isIdle && this.player.isOnGround()) {
      this.player.setState(new IdleState(this.player));
    }
  }

  /**
   * sets the animation to ascending and plays the jump sound
   */
  enter(): void {
    this.player.isRunning = false;
    soundManager.playSound('jump');
    this.player.animation = AnimationPlayer.jumpstart;
    this.player.velocityY = this.player.jumpForce;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = this.player.maxFrameCount;
    }
  }

  /**
   * if sprite is over sets the player in the ascending state
   */
  update(): void {
    if (this.player.direction === Direction.right) {
      if (this.player.spritePosition > SpriteFrameCount[AnimationPlayer.jumpstart] - 1) {
        this.player.setState(new JumpingStateAscending(this.player));
      }
    } else {
      if (
        this.player.spritePosition <
        this.player.maxFrameCount - SpriteFrameCount[AnimationPlayer.jumpstart] + 1
      ) {
        this.player.setState(new JumpingStateAscending(this.player));
      }
    }
  }
}

/**
 * the jumping state ascening of the player
 */
export class JumpingStateAscending implements PlayerState {
  constructor(private player: Player) {}

  /**
   * handles the current inputs and sets new states based on these inputs
   *
   * @param input the inputhandler of the player
   */
  handleInput(input: InputHandler): void {
    if (input.keyManager['d'] || input.keyManager['arrowright']) {
      this.player.direction = Direction.right;
      this.player.velocityX = this.player.speed;
    } else if (input.keyManager['a'] || input.keyManager['arrowleft']) {
      this.player.direction = Direction.left;
      this.player.velocityX = -this.player.speed;
    }

    if (input.keyManager['f']) {
      this.player.setState(new AttackingStateAir(this.player));
    }
    if (input.keyManager['control'] && !this.player.slideOnCooldown) {
      if (this.player.direction === Direction.right) {
        this.player.setState(new SlidingStateRight(this.player));
      } else if (this.player.direction === Direction.left) {
        this.player.setState(new SlidingStateLeft(this.player));
      }
    } else if (input.isIdle && this.player.isOnGround()) {
      this.player.setState(new IdleState(this.player));
    }
  }

  /**
   * sets the animation to ascending
   */
  enter() {
    this.player.isRunning = false;
    this.player.animation = AnimationPlayer.ascending;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = SpriteFrameCount[AnimationPlayer.ascending];
    }
  }

  /**
   * sets the descending state when player is falling back to ground
   */
  update() {
    if (this.player.velocityY > 0) {
      this.player.setState(new JumpingStateDescending(this.player));
    }
  }
}

/**
 * Jumping descending class
 */
export class JumpingStateDescending implements PlayerState {
  constructor(private player: Player) {}

  /**
   *
   * @param input handles the input from the inputhandler
   */
  handleInput(input: InputHandler): void {
    if (input.keyManager['d'] || input.keyManager['arrowright']) {
      this.player.direction = Direction.right;
      this.player.velocityX = this.player.speed;
    } else if (input.keyManager['a'] || input.keyManager['arrowleft']) {
      this.player.direction = Direction.left;
      this.player.velocityX = -this.player.speed;
    }
    if (input.keyManager['f']) {
      this.player.setState(new AttackingStateAir(this.player));
    }
    if (input.keyManager['control'] && !this.player.slideOnCooldown) {
      if (this.player.direction === Direction.right) {
        this.player.setState(new SlidingStateRight(this.player));
      } else if (this.player.direction === Direction.left) {
        this.player.setState(new SlidingStateLeft(this.player));
      }
    } else if (input.isIdle && this.player.isOnGround()) {
      this.player.setState(new IdleState(this.player));
    }
  }

  /**
   * sets the animation to descending
   */
  enter() {
    this.player.isRunning = false;
    this.player.isRunning = false;
    this.player.animation = AnimationPlayer.descending;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = this.player.maxFrameCount;
    }
  }

  /**
   * resets the velocity y when player is on ground and gives it the idle state
   */
  update() {
    if (this.player.isOnGround()) {
      this.player.velocityY = 0;
      this.player.y = this.player.world.groundLevel;
      this.player.setState(new IdleState(this.player));
    }
  }
}

/**
 * Attacking while grounded state of the player
 */
export class AttackingStateGround implements PlayerState {
  constructor(private player: Player) {}

  handleInput(_input: InputHandler): void {
    return;
  }

  /**
   * sets the animation of the player to the slashing on ground position
   */
  enter() {
    this.player.isRunning = false;
    this.player.animation = AnimationPlayer.slashing;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = this.player.maxFrameCount;
    }
  }

  /**
   * if srpite end reached fire a projectile and sets a new state based on the player position
   */
  update() {
    if (this.player.direction === Direction.right) {
      this.player.velocityX = -this.player.speed / 2;
      if (this.player.spritePosition > SpriteFrameCount[AnimationPlayer.slashing] - 1) {
        this.player.fireProj();
        this.player.setState(new IdleState(this.player));
      }
    } else {
      this.player.velocityX = this.player.speed / 2;
      if (
        this.player.spritePosition <
        this.player.maxFrameCount - SpriteFrameCount[AnimationPlayer.slashing] + 1
      ) {
        this.player.fireProj();
        this.player.setState(new IdleState(this.player));
      }
    }
  }
}

/**
 * Class of the player while attacking in the air
 */
export class AttackingStateAir implements PlayerState {
  constructor(private player: Player) {}

  /**
   * handles the current inputs and sets new states based on these inputs
   *
   * @param input the inputhandler of the player
   */
  handleInput(_input: InputHandler): void {}

  /**
   * sets the animation of the player to the slashing in air position, and
   */
  enter() {
    this.player.isRunning = false;
    this.player.animation = AnimationPlayer.slashingAir;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = this.player.maxFrameCount;
    }
  }

  /**
   * if srpite end reached fire a projectile and sets a new state based on the player position
   */
  update() {
    if (this.player.direction === Direction.right) {
      this.player.velocityX = -this.player.speed / 2;
      if (this.player.spritePosition > SpriteFrameCount[AnimationPlayer.slashingAir] - 1) {
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
        this.player.maxFrameCount - SpriteFrameCount[AnimationPlayer.slashingAir] + 1
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

/**
 * sliding staterigth of the player
 */
export class SlidingStateRight implements PlayerState {
  constructor(private player: Player) {}

  handleInput(_input: InputHandler): void {}

  enter() {
    this.player.isRunning = false;
    this.player.spritePosition = 0;
    this.player.animation = AnimationPlayer.sliding;
  }

  /**
   * changes the velocity x of the player for a short duration, returning if there are no crystals on the player
   *
   * @returns nothing
   */
  update() {
    if (this.player.crystals <= 0) {
      this.player.setState(new IdleState(this.player));
      return;
    }
    this.player.velocityX = this.player.dashSpeed;
    if (this.player.spritePosition > SpriteFrameCount[AnimationPlayer.sliding] - 1) {
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

  /**
   * sets the slide on cooldown
   */
  setSlideOnCooldown() {
    this.player.slideOnCooldown = true;
    setTimeout(() => {
      this.player.slideOnCooldown = false;
    }, this.player.slideCooldownTime * 1000);
  }
}

/**
 * sliding stateleft of the player
 */
export class SlidingStateLeft implements PlayerState {
  constructor(private player: Player) {}

  handleInput(_input: InputHandler): void {}

  /**
   * sets the starting position and animation
   */
  enter() {
    this.player.isRunning = false;
    this.player.spritePosition = this.player.maxFrameCount;
    this.player.animation = AnimationPlayer.sliding;
  }

  /**
   * changes the velocity x of the player for a short duration, returning if there are no crystals on the player
   *
   * @returns nothing
   */
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

  /**
   * sets the slide on cooldown
   */
  setSlideOnCooldown() {
    this.player.slideOnCooldown = true;
    setTimeout(() => {
      this.player.slideOnCooldown = false;
    }, this.player.slideCooldownTime * 1000);
  }
}

/**
 * hurt state of the player
 */
export class HurtState implements PlayerState {
  constructor(private player: Player) {}

  handleInput(_input: InputHandler): void {}

  /**
   * sets the animation of the hurt state and the frameX to the first one and triggers hp loss and cooldown on player getting hurt
   */
  enter() {
    this.player.isRunning = false;
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

  /**
   * sets the velocityX to 0 and goes to a new state when finished
   */
  update() {
    this.player.velocityX = 0;
    if (this.player.direction === Direction.right) {
      if (this.player.spritePosition > SpriteFrameCount[AnimationPlayer.hurt] - 1) {
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

/**
 * the dying state of the player
 */
export class DyingState implements PlayerState {
  constructor(private player: Player) {}

  /**
   * handles the current inputs and sets new states based on these inputs
   *
   * @param input the inputhandler of the player
   */
  handleInput(_input: InputHandler): void {}

  /**
   * sets the animation of the idle state and the frameX to the first one
   */
  enter() {
    this.player.isRunning = false;
    this.player.animation = AnimationPlayer.dying;
    if (this.player.direction === Direction.right) {
      this.player.spritePosition = 0;
    } else {
      this.player.spritePosition = this.player.maxFrameCount;
    }
    this.player.world.enemies.forEach((enemie) => {
      enemie.setState(new EnemyIdleState(this.player, enemie));
    });
  }

  /**
   * updates the dying state, if animation end reached plays gameover
   */
  update() {
    this.player.velocityX = 0;
    if (this.player.direction === Direction.right) {
      if (this.player.spritePosition > SpriteFrameCount[AnimationPlayer.dying] - 1) {
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
