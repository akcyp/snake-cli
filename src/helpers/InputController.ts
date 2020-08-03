import * as readline from 'readline';
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (_, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    emitter.emit('keypress', key.name);
  }
});

export default emitter;
