export class InputHandler {
  lastInput: string = "";
  keyManager: KeyManager = {};
  isIdle: boolean = true;
  constructor() {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      this.lastInput = event.key.toLowerCase();
      this.keyManager[event.key.toLowerCase()] = true;
      return this.lastInput;
    });

    document.addEventListener("keyup", (event: KeyboardEvent) => {
      this.keyManager[event.key.toLowerCase()] = false;
      this.checkIfIdle();
    });
  }

  checkIfIdle() {
    if (Object.values(this.keyManager).every((value) => value === false)) {
      this.isIdle = true;
      return;
    }
    this.isIdle = false;
  }
}

type KeyManager = {
  [key: string]: boolean;
};
