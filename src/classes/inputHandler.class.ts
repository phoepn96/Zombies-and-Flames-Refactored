export class InputHandler {
  lastInput: string = "";
  keyManager: KeyManager = {};
  isIdle: boolean = true;

  private relevantKeys = [
    "w",
    "a",
    "s",
    "d",
    "arrowup",
    "arrowdown",
    "arrowleft",
    "arrowright",
    " ",
    "f",
    "control",
  ];

  constructor() {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!this.relevantKeys.includes(key)) return;

      this.lastInput = key;
      this.keyManager[key] = true;
      this.updateIdleState();
    });

    document.addEventListener("keyup", (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!this.relevantKeys.includes(key)) return;

      this.keyManager[key] = false;
      this.updateIdleState();
    });
  }

  private updateIdleState() {
    this.isIdle = !this.relevantKeys.some((key) => this.keyManager[key]);
  }
}

type KeyManager = {
  [key: string]: boolean;
};
