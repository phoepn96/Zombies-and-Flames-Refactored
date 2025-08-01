import {
  Background,
  BackgroundLayer,
  FirstLayer,
  ForthLayer,
  SecondLayer,
  ThirdLayer,
} from "./background.class";
import { Player } from "./player.class";

export class World {
  width: number;
  height: number;
  groundLevel: number = 350;
  centerScreen: number;
  playerStartingX: number = 50;
  player: Player = new Player(500, this.groundLevel, this);
  gravity: number = 1;
  backgrounds: Background[][] = [];

  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D
  ) {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.player = new Player(this.playerStartingX, this.groundLevel, this);
    this.player.initImgs();
    this.backgrounds = [
      [
        new BackgroundLayer(this, 0),
        new BackgroundLayer(this, 1),
        new BackgroundLayer(this, 2),
      ],
      [
        new FirstLayer(this, 0),
        new FirstLayer(this, 1),
        new FirstLayer(this, 2),
      ],
      [
        new SecondLayer(this, 0),
        new SecondLayer(this, 1),
        new SecondLayer(this, 2),
      ],
      [
        new ThirdLayer(this, 0),
        new ThirdLayer(this, 1),
        new ThirdLayer(this, 2),
      ],
      [
        new ForthLayer(this, 0),
        new ForthLayer(this, 1),
        new ForthLayer(this, 2),
      ],
    ];
    this.centerScreen = this.width / 2;
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.update();
    this.updateBackgrounds();
  }

  draw() {
    this.drawBackgrounds();
    this.player.draw();
  }

  drawBackgrounds() {
    this.backgrounds.forEach((backgroundLayerArr) => {
      backgroundLayerArr.forEach((backgroundLayer) => {
        backgroundLayer.draw();
      });
    });
  }

  updateBackgrounds() {
    this.backgrounds.forEach((backgroundLayerArr) => {
      this.checkPlatformsRight(backgroundLayerArr);
      this.checkPlatformLeft(backgroundLayerArr);
    });
  }

  checkPlatformsRight(backgroundArr: Background[]) {
    if (backgroundArr[1].x + backgroundArr[1].width < 0) {
      const movedPlatform = backgroundArr.shift();
      if (movedPlatform) {
        const lastPlatform = backgroundArr[backgroundArr.length - 1];
        movedPlatform.x = lastPlatform.x + lastPlatform.width;
        backgroundArr.push(movedPlatform);
      }
    }
  }

  checkPlatformLeft(backgroundArr: Background[]) {
    if (backgroundArr[1].x > this.width) {
      const movedPlatform = backgroundArr.pop();
      if (movedPlatform) {
        const firstPlatform = backgroundArr[0];
        movedPlatform.x = firstPlatform.x - firstPlatform.width;
        backgroundArr.unshift(movedPlatform);
      }
    }
  }
}
