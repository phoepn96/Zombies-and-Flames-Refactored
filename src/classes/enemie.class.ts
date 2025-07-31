import { Character } from "./character.class";
import { World } from "./world.class";

export abstract class Enemie extends Character {
  constructor(startingX: number, startingY: number, world: World) {
    super(startingX, startingY, world);
  }

  abstract move(): void;
}
