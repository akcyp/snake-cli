let cursorHidden = false;
let cleared = false;

export default {
  log(...args: string[]) {
    if (!cleared) {
      process.stdout.write('\n');
    }
    cleared = false;
    process.stdout.write(args.join('\n'));
  },
  clear() {
    cleared = true;
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
