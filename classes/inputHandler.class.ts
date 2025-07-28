class InputHandler {
  lastInput: string = "";
  keyManager: KeyManager = {};
  constructor() {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      this.lastInput = event.key.toLowerCase();
      this.keyManager[event.key.toLowerCase()] = true;
      return this.lastInput;
    });

    document.addEventListener("keyup", (event: KeyboardEvent) => {
      this.keyManager[event.key.toLowerCase()] = false;
    });
  }
}

type KeyManager = {
  [key: string]: boolean;
};
