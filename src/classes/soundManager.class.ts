/**
 * the soundmanager class that has a map and methods to change, load or play sounds
 */
export class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  muted: boolean = false;

  constructor() {
    const storedMute = localStorage.getItem('muted');
    this.muted = storedMute === 'true';
  }

  /**
   * function creates a new audio and sets the name of that audio the the key in the soundsMap, so the sound can get accessed easy
   *
   * @param name string -name of the sound, later the key of the map
   * @param src string - of the path to the audio
   * @param loop boolean - should the sound loop or not
   * @param volume number between 0 and 1, how load should the sound be
   */
  loadSound(name: string, src: string, loop: boolean, volume: number) {
    const sound = new Audio(src);
    sound.muted = this.muted;
    sound.volume = volume;
    sound.loop = loop;
    this.sounds.set(name, sound);
  }

  /**
   * plays a specific sound
   *
   * @param name string - key of the sound in the map
   * @returns nothing
   */
  playSound(name: string) {
    const sound = this.sounds.get(name);
    if (sound) {
      if (this.muted) return;
      sound.currentTime = 0;
      sound.play();
    }
  }

  /**
   * pauses a sound
   *
   * @param name string- key of the sound in the map
   */
  stopSound(name: string) {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.pause();
    }
  }

  /**
   * stops all sounds in the map
   */
  stopAllSounds() {
    this.sounds.forEach((sound) => sound.pause());
  }

  /**
   * toggles the mute for all sounds in the map
   */
  toggleMute() {
    this.muted = !this.muted;
    this.sounds.forEach((sound) => {
      sound.muted = this.muted;
    });
    localStorage.setItem('muted', this.muted.toString());
  }
}
