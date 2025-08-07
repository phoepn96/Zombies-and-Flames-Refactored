import { ctx } from "../main";

export const imageCache: Record<string, HTMLImageElement> = {};
function preloadImage(key: string, src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      imageCache[key] = img;
      resolve();
    };
  });
}

export async function loadImages() {
  await Promise.all([
    preloadImage("playerLeft", "assets/spritesheets/player/player1.png"),
    preloadImage("playerRight", "assets/spritesheets/player/playerLeft1.png"),
    preloadImage("zombie1Right", "assets/spritesheets/zombie1/zombie11.png"),
    preloadImage(
      "zombie1Left",
      "assets/spritesheets/zombie1/zombie1Mirrored1.png"
    ),
    preloadImage("zombie2Right", "assets/spritesheets/zombie2/zombie21.png"),
    preloadImage(
      "zombie2Left",
      "assets/spritesheets/zombie2/zombie2Mirrored1.png"
    ),
    preloadImage("bossRight", "assets/spritesheets/reaper/reaper1.png"),
    preloadImage("bossLeft", "assets/spritesheets/reaper/reaperMirrored1.png"),
    preloadImage("first", "assets/spritesheets/bg/first.png"),
    preloadImage("second", "assets/spritesheets/bg/second.png"),
    preloadImage("third", "assets/spritesheets/bg/third.png"),
    preloadImage("forth", "assets/spritesheets/bg/forth.png"),
    preloadImage("bg", "assets/spritesheets/bg/bg.png"),
    preloadImage("crystals", "assets/spritesheets/bg/crystals.png"),
    preloadImage(
      "playerProjLeft",
      "assets/spritesheets/projectiles/Player_Proj_spritesheetMirrord1.png"
    ),
    preloadImage(
      "bossProj",
      "assets/spritesheets/projectiles/Boss_Proj_spritesheet1.png"
    ),
    preloadImage(
      "playerProjRight",
      "assets/spritesheets/projectiles/Player_Proj_spritesheet1.png"
    ),
    preloadImage("lifebar", "assets/spritesheets/bg/lifebar.png"),
  ]);

  ctx.drawImage(imageCache["playerLeft"], 0, 0);
  ctx.drawImage(imageCache["playerRight"], 0, 0);

  ctx.drawImage(imageCache["zombie1Right"], 0, 0);
  ctx.drawImage(imageCache["zombie1Left"], 0, 0);

  ctx.drawImage(imageCache["zombie2Right"], 0, 0);
  ctx.drawImage(imageCache["zombie2Left"], 0, 0);

  ctx.drawImage(imageCache["bossRight"], 0, 0);
  ctx.drawImage(imageCache["bossLeft"], 0, 0);

  ctx.drawImage(imageCache["first"], 0, 0);
  ctx.drawImage(imageCache["second"], 0, 0);
  ctx.drawImage(imageCache["third"], 0, 0);
  ctx.drawImage(imageCache["forth"], 0, 0);
  ctx.drawImage(imageCache["bg"], 0, 0);

  ctx.drawImage(imageCache["crystals"], 0, 0);

  ctx.drawImage(imageCache["playerProjLeft"], 0, 0);
  ctx.drawImage(imageCache["bossProj"], 0, 0);
}
