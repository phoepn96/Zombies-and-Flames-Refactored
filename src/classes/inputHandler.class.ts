/**
 * input handler do monitor inputs, which is used in the playerState classes
 */
export class InputHandler {
  lastInput: string = '';
  keyManager: KeyManager = {};
  isIdle: boolean = true;

  private relevantKeys = [
    'w',
    'a',
    's',
    'd',
    'arrowup',
    'arrowdown',
    'arrowleft',
    'arrowright',
    ' ',
    'f',
    'control',
  ];

  /**
   * adds a eventlistener to all keydown events and stores the keys in a keyManager
   */
  constructor() {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!this.relevantKeys.includes(key)) return;
      this.lastInput = key;
      this.keyManager[key] = true;
      this.updateIdleState();
    });

    /**
     * adds a listener to all keyup events and removes the keys out of the keymanager
     */
    document.addEventListener('keyup', (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!this.relevantKeys.includes(key)) return;
      this.keyManager[key] = false;
      this.updateIdleState();
    });

    this.setupTouchButtons();
  }

  /**
   * defines all mobile control buttons and gives them a event listener by their data-key attribute, storing the key given to them in the keymanager
   */
  private setupTouchButtons() {
    const buttons = document.querySelectorAll('[data-key]');
    buttons.forEach((btn) => {
      const key = btn.getAttribute('data-key')?.toLowerCase();
      if (!key || !this.relevantKeys.includes(key)) return;
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.keyManager[key] = true;
        this.lastInput = key;
        this.updateIdleState();
      });
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.keyManager[key] = false;
        this.updateIdleState();
      });
    });
  }

  /**
   * checks if there are relevant keys pressed, if not sets the idle state in the manager which sets the player to the idle state in the state classes
   */
  private updateIdleState() {
    this.isIdle = !this.relevantKeys.some((key) => this.keyManager[key]);
  }
}

type KeyManager = {
  [key: string]: boolean;
};
