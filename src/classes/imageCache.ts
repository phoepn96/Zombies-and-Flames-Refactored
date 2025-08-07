export const imageCache: Record<string, HTMLImageElement> = {};

/**
 *
 * @param key key of the imageCache string, so hwo you can acess the image
 * @param src the src string to the path where the img is
 * @returns a Promise
 */
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

/**
 * preloads all imgs into the cache
 */
export async function loadImages() {
  await Promise.all([
    preloadImage('playerLeft', 'assets/spritesheets/player/player1.png'),
    preloadImage('playerRight', 'assets/spritesheets/player/playerLeft1.png'),
    preloadImage('zombie1Right', 'assets/spritesheets/zombie1/zombie11.png'),
    preloadImage('zombie1Left', 'assets/spritesheets/zombie1/zombie1Mirrored1.png'),
    preloadImage('zombie2Right', 'assets/spritesheets/zombie2/zombie21.png'),
    preloadImage('zombie2Left', 'assets/spritesheets/zombie2/zombie2Mirrored1.png'),
    preloadImage('bossRight', 'assets/spritesheets/reaper/reaper1.png'),
    preloadImage('bossLeft', 'assets/spritesheets/reaper/reaperMirrored1.png'),
    preloadImage('first', 'assets/spritesheets/bg/first.png'),
    preloadImage('second', 'assets/spritesheets/bg/second.png'),
    preloadImage('third', 'assets/spritesheets/bg/third.png'),
    preloadImage('forth', 'assets/spritesheets/bg/forth.png'),
    preloadImage('bg', 'assets/spritesheets/bg/bg.png'),
    preloadImage('crystals', 'assets/spritesheets/bg/crystals.png'),
    preloadImage(
      'playerProjLeft',
      'assets/spritesheets/projectiles/Player_Proj_spritesheetMirrord1.png'
    ),
    preloadImage('bossProj', 'assets/spritesheets/projectiles/Boss_Proj_spritesheet1.png'),
    preloadImage('playerProjRight', 'assets/spritesheets/projectiles/Player_Proj_spritesheet1.png'),
    preloadImage('lifebar', 'assets/spritesheets/bg/lifebar.png'),
  ]);
}
