import { Player } from "./player.class";

export class World {
  width: number;
  height: number;
  groundLevel: number = 280;
  playerStartingX: number = 50;
  player: Player;

  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D
  ) {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.player = new Player(this.playerStartingX, this.groundLevel, this);
  }

  update() {}

  draw() {}
}
