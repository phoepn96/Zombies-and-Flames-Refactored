import { Direction } from "./character.class";
import {
  AnimationEnemie,
  Boss,
  Enemie,
  SpriteFrameCountEnemy,
} from "./enemie.class";
import { Player } from "./player.class";
import { HurtState } from "./states.class";

export interface EnemyState {
  checkForAction(): void;
  enter(): void;
  update(): void;
}

export class EnemyWalkingState implements EnemyState {
  constructor(private player: Player, private enemy: Enemie) {}
  checkForAction(): void {
    if (
      this.player.hitbox.x + this.player.hitbox.width >=
        this.enemy.hitbox.x - 50 &&
      this.player.hitbox.x <= this.enemy.hitbox.x + this.enemy.hitbox.width + 20
    ) {
      if (this.enemy.attackOnCooldown) return;
      this.enemy.setState(
        new EnemyAttackingState(this.enemy.world.player, this.enemy)
      );
    }
  }

  enter(): void {
    this.enemy.animation = AnimationEnemie.walking;
    if (this.enemy.direction === Direction.right) {
      this.enemy.spritePosition = 0;
    } else {
      this.enemy.spritePosition = this.enemy.maxFrameCount;
    }
  }

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

export class EnemyAttackingState implements EnemyState {
  constructor(private player: Player, private enemy: Enemie) {}
  checkForAction(): void {
    return;
  }

  enter(): void {
    this.enemy.animation = AnimationEnemie.slashing;
    if (this.enemy.direction === Direction.right) {
      this.enemy.spritePosition = 0;
    } else {
      this.enemy.spritePosition = this.enemy.maxFrameCount;
    }
  }

  update() {
    if (this.player.x > this.enemy.x) {
      this.enemy.setDirection(Direction.right);
    } else {
      this.enemy.setDirection(Direction.left);
    }

    const animationFinished =
      (this.enemy.direction === Direction.right &&
        this.enemy.spritePosition >
          SpriteFrameCountEnemy[AnimationEnemie.slashing] - 1) ||
      (this.enemy.direction === Direction.left &&
        this.enemy.spritePosition <
          this.enemy.maxFrameCount -
            SpriteFrameCountEnemy[AnimationEnemie.slashing] +
            1);

    if (animationFinished) {
      this.enemy.attackOnCooldown = true;
      if (this.enemy instanceof Boss) {
        this.enemy.fireProj();
      }
      setTimeout(() => {
        this.enemy.attackOnCooldown = false;
      }, this.enemy.attackCooldownTime * 1000);
      const horizontalHit =
        this.player.hitbox.x + this.player.hitbox.width >=
          this.enemy.hitbox.x - 50 &&
        this.player.hitbox.x <=
          this.enemy.hitbox.x + this.enemy.hitbox.width + 20;

      const verticalHit =
        this.player.hitbox.y < this.enemy.hitbox.y + this.enemy.hitbox.height &&
        this.player.hitbox.y + this.player.hitbox.height > this.enemy.hitbox.y;

      if (horizontalHit && verticalHit) {
        if (this.player.hitOnCooldown) return;
        this.player.hp--;
        this.player.setState(new HurtState(this.player));
        this.player.hitOnCooldown = true;
        setTimeout(() => {
          this.player.hitOnCooldown = false;
        }, this.player.hitCooldown * 1000);
      }

      this.enemy.setState(new EnemyWalkingState(this.player, this.enemy));
    }
  }
}

export class EnemyHurtState implements EnemyState {
  constructor(private player: Player, private enemy: Enemie) {}
  checkForAction(): void {}
  enter(): void {
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

  update(): void {
    if (this.enemy.direction === Direction.right) {
      if (
        this.enemy.spritePosition >
        SpriteFrameCountEnemy[AnimationEnemie.hurt] - 1
      ) {
        this.enemy.setState(new EnemyWalkingState(this.player, this.enemy));
      }
    } else {
      if (
        this.enemy.spritePosition <
        this.enemy.maxFrameCount -
          SpriteFrameCountEnemy[AnimationEnemie.hurt] +
          1
      ) {
        this.enemy.setState(new EnemyWalkingState(this.player, this.enemy));
      }
    }
  }
}

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

  update(): void {
    if (this.enemy.direction === Direction.right) {
      if (
        this.enemy.spritePosition >
        SpriteFrameCountEnemy[AnimationEnemie.dying] - 2
      ) {
        if (this.enemy instanceof Boss) {
          this.enemy.world.won();
        }
        this.enemy.isDead = true;
      }
    } else {
      if (
        this.enemy.spritePosition <
        this.enemy.maxFrameCount -
          SpriteFrameCountEnemy[AnimationEnemie.dying] +
          2
      ) {
        if (this.enemy instanceof Boss) {
          this.enemy.world.won();
        }
        this.enemy.isDead = true;
        console.log("dead");
      }
    }
  }
}
