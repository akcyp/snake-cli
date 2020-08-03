let cursorHidden = false;

export default {
  log(...args: string[]) {
    process.stdout.write('\n' + args.join('\n'));
  },
  clear() {
    console.clear();
  },
  hideCursor() {
    if (!cursorHidden) {
      process.stdout.write('\u001B[?25l');
      cursorHidden = true;
    }
  },
  showCursor() {
    if (cursorHidden) {
      process.stdout.write('\u001B[?25h');
      cursorHidden = false;
    }
  },
  reset() {
    this.clear();
    this.showCursor();
  },
};
