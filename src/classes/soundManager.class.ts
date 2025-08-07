export class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  muted: boolean = false;

  constructor() {
    const storedMute = localStorage.getItem("muted");
    this.muted = storedMute === "true";
  }

  loadSound(name: string, src: string, loop: boolean, volume: number) {
    const sound = new Audio(src);
    sound.muted = this.muted;
    sound.volume = volume;
    sound.loop = loop;
    this.sounds.set(name, sound);
  }

  playSound(name: string) {
    const sound = this.sounds.get(name);
    if (sound) {
      if (this.muted) return;
      sound.currentTime = 0;
      sound.play();
    }
  }

  stopSound(name: string) {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.pause();
    }
  }

  stopAllSounds() {
    this.sounds.forEach((sound) => sound.pause());
  }

  toggleMute() {
    this.muted = !this.muted;
    this.sounds.forEach((sound) => {
      sound.muted = this.muted;
    });
    localStorage.setItem("muted", this.muted.toString());
  }
}
