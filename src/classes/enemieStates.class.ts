import { soundManager, youWon } from '../main';
import { Direction } from './character.class';
import { AnimationEnemie, Boss, Enemie, SpriteFrameCountEnemy } from './enemie.class';
import { Player } from './player.class';
import { HurtState } from './states.class';

/**
 * interface for EnemyState, the enter method always sets the animation from the corrosponding state and resets the x position of the sprite
 */
export interface EnemyState {
  checkForAction(): void;
  enter(): void;
  update(): void;
}

/**
 * regulates the idle state of an enemy
 */
export class EnemyIdleState implements EnemyState {
  constructor(
    _player: Player,
    private enemy: Enemie
  ) {}
  checkForAction(): void {}
  enter(): void {
    this.enemy.animation = AnimationEnemie.idle;
    if (this.enemy.direction === Direction.right) {
      this.enemy.spritePosition = 0;
    } else {
      this.enemy.spritePosition = this.enemy.maxFrameCount;
    }
  }
  update() {}
}

/**
 * walking class of the enemy
 */
export class EnemyWalkingState implements EnemyState {
  constructor(
    private player: Player,
    private enemy: Enemie
  ) {}

  /**
   * checks if the player is in a specific radius around the enemie and if yes, than its sets the state of that enemy to the attacking state
   *
   * @returns nothing
   */
  checkForAction(): void {
    if (
      this.player.hitbox.x + this.player.hitbox.width >= this.enemy.hitbox.x &&
      this.player.hitbox.x <= this.enemy.hitbox.x + this.enemy.hitbox.width
    ) {
      if (this.enemy.attackOnCooldown) return;
      this.enemy.setState(new EnemyAttackingState(this.enemy.world.player, this.enemy));
    }
  }

  /**
   * sest the animation to animation walking
   */
  enter(): void {
    this.enemy.animation = AnimationEnemie.walking;
    if (this.enemy.direction === Direction.right) {
      this.enemy.spritePosition = 0;
    } else {
      this.enemy.spritePosition = this.enemy.maxFrameCount;
    }
  }

  /**
   * checks where the player is and moves the enemy in the direction of the player, furthermor changes the direction if the player jumps over the enemy
   */
  update() {
    if (this.player.x < this.enemy.x) {
      this.enemy.x -= this.enemy.speed;
    } else {
      this.enemy.x += this.enemy.speed;
    }
    if (this.player.x > this.enemy.x) {
      this.enemy.setDirection(Direction.right);
    } else {
      this.enemy.setDirection(Direction.left);
    }
  }
}

/**
 * Attacking State of the Enemy
 */
export class EnemyAttackingState implements EnemyState {
  constructor(
    private player: Player,
    private enemy: Enemie
  ) {}
  checkForAction(): void {
    return;
  }

  /**
   * sest the animation to animation slashing
   */
  enter(): void {
    this.enemy.animation = AnimationEnemie.slashing;
    if (this.enemy.direction === Direction.right) {
      this.enemy.spritePosition = 0;
    } else {
      this.enemy.spritePosition = this.enemy.maxFrameCount;
    }
  }

  /**
   * changed hte direciton of the enemie based on where the player is, than checks if the spritesheet reached the last xFrame and triggers an attack, afterwards sets the attack on cooldown
   */
  update() {
    if (this.player.x > this.enemy.x) {
      this.enemy.setDirection(Direction.right);
    } else {
      this.enemy.setDirection(Direction.left);
    }
    if (this.animationFinish()) {
      this.enemy.attackOnCooldown = true;
      if (this.enemy instanceof Boss) {
        this.enemy.fireProj();
      }
      setTimeout(() => {
        this.enemy.attackOnCooldown = false;
      }, this.enemy.attackCooldownTime * 1000);
      this.hitDetection();
      this.enemy.setState(new EnemyWalkingState(this.player, this.enemy));
    }
  }

  /**
   * checks if the spritesheet reached the last xFrame
   *
   * @returns a boolean,
   */
  animationFinish() {
    return (
      (this.enemy.direction === Direction.right &&
        this.enemy.spritePosition > SpriteFrameCountEnemy[AnimationEnemie.slashing] - 1) ||
      (this.enemy.direction === Direction.left &&
        this.enemy.spritePosition <
          this.enemy.maxFrameCount - SpriteFrameCountEnemy[AnimationEnemie.slashing] + 1)
    );
  }

  /**
   * checks if the player hitbox is in range of the hitbox of the instance + the attack range, on the x coordinates
   *
   * @returns a boolean
   */
  horizontalHit() {
    return (
      this.player.hitbox.x + this.player.hitbox.width >= this.enemy.hitbox.x &&
      this.player.hitbox.x <= this.enemy.hitbox.x + this.enemy.hitbox.width
    );
  }

  /**
   * checks if the player hitbox is in range of the hitbox of the instance , on the y coordinates
   *
   * @returns a boolean
   */
  verticalHit() {
    return (
      this.player.hitbox.y < this.enemy.hitbox.y + this.enemy.hitbox.height &&
      this.player.hitbox.y + this.player.hitbox.height > this.enemy.hitbox.y
    );
  }

  /**
   * checks if player is within x and y coordinates of the player and if so, reduces the hp of the player and sets the player in hurtState + applys cooldown for the player getting hit
   *
   * @returns nothing
   */
  hitDetection() {
    if (this.horizontalHit() && this.verticalHit()) {
      if (this.player.hitOnCooldown) return;
      this.player.hp--;
      this.player.setState(new HurtState(this.player));
      this.player.hitOnCooldown = true;
      setTimeout(() => {
        this.player.hitOnCooldown = false;
      }, this.player.hitCooldown * 1000);
    }
  }
}

/**
 * Hurt State for the Enemy
 */
export class EnemyHurtState implements EnemyState {
  constructor(
    private player: Player,
    private enemy: Enemie
  ) {}

  checkForAction(): void {}

  /**
   * reduces the hp of the instance, and sets the cooldown of not getting hit
   *
   * @returns nothing
   */
  enter(): void {
    soundManager.playSound('zombieAttack');
    if (this.enemy.hurtOnCooldown) return;
    this.enemy.hp--;
    this.enemy.hurtOnCooldown = true;
    setTimeout(() => {
      this.enemy.hurtOnCooldown = false;
    }, 1000 * this.enemy.hurtCooldown);
    this.enemy.animation = AnimationEnemie.hurt;
    if (this.enemy.direction === Direction.right) {
      this.enemy.spritePosition = 0;
    } else {
      this.enemy.spritePosition = this.enemy.maxFrameCount;
    }
  }

  /**
   * checks if the animation has reached the max x frame and than buts the enemie into a new walking state
   */
  update(): void {
    if (this.enemy.direction === Direction.right) {
      if (this.enemy.spritePosition > SpriteFrameCountEnemy[AnimationEnemie.hurt] - 1) {
        this.enemy.setState(new EnemyWalkingState(this.player, this.enemy));
      }
    } else {
      if (
        this.enemy.spritePosition <
        this.enemy.maxFrameCount - SpriteFrameCountEnemy[AnimationEnemie.hurt] + 1
      ) {
        this.enemy.setState(new EnemyWalkingState(this.player, this.enemy));
      }
    }
  }
}

/**
 * dying state of the enemy
 */
export class EnemyDyingState implements EnemyState {
  constructor(private enemy: Enemie) {}
  checkForAction(): void {}
  enter(): void {
    this.enemy.animation = AnimationEnemie.dying;
    if (this.enemy.direction === Direction.right) {
      this.enemy.spritePosition = 0;
    } else {
      this.enemy.spritePosition = this.enemy.maxFrameCount;
    }
  }

  /**
   * checks if animation ended, than marks the enemy with isDead so it can get deleted by the world, if enemy was the boss, inits the you won screen
   */
  update(): void {
    if (this.enemy.direction === Direction.right) {
      if (this.enemy.spritePosition > SpriteFrameCountEnemy[AnimationEnemie.dying] - 1) {
        if (this.enemy instanceof Boss) {
          youWon();
        }
        this.enemy.isDead = true;
      }
    } else {
      if (
        this.enemy.spritePosition <
        this.enemy.maxFrameCount - SpriteFrameCountEnemy[AnimationEnemie.dying] + 1
      ) {
        if (this.enemy instanceof Boss) {
          youWon();
        }
        this.enemy.isDead = true;
      }
    }
  }
}
