import chalk from 'chalk';
import inputController from './InputController';
import { EventEmitter } from 'events';

interface IMenuOption {
  name: string,
  callback?: (this: CLIMenu) => void
}

export default class CLIMenu extends EventEmitter {
  public width = process.stdout.columns;
  public height = process.stdout.rows;
  public title: string;
  public options: IMenuOption[];
  public maxTextWidth: number;
  public selectedOption: number = 0;
  constructor (settings: {title?: string, options?: IMenuOption[]} = {}) {
    super();
    this.title = this.center(settings.title || '', chalk.green);
    this.options = (settings.options || []);
    this.maxTextWidth = Math.max(...(settings.options || []).map(option => option.name).concat(settings.title || '').map((str => this.calculateTextSize(str).width)));
  }
  init () {
    const self = this;
    function onKeyPress (name: string) {
      if (name === 'down' || name === 'up') {
        const newIndex = self.selectedOption + (name === 'up' ? -1 : 1);
        if (self.options[newIndex]) {
          self.selectedOption = newIndex;
          self.print();
        }
      } else if (name === 'return') {
        const selected = self.options[self.selectedOption];
        if (selected.callback) {
          selected.callback.call(self);
        }
      }
    }
    inputController.on('keypress', onKeyPress);
    this.on('destroy', () => {
      inputController.off('keypress', onKeyPress);
    });
    this.print();
  }
  destroy () {
    console.clear();
    this.emit('destroy');
  }
  calculateTextSize (text: string) {
    const rows = text.split('\n');
    return {
      width: Math.max(...rows.map(s => s.length)),
      height: rows.length
    }
  }
  center (text: string, modifyText: (text: string) => string = (val: string) => val, modifyMargin: number = 0) {
    const maxWidth = this.calculateTextSize(text).width;
    const padding = ' '.repeat(Math.floor((this.width - maxWidth) / 2));
    return text.split('\n').map(s => {
      const marginedStartPadding = padding.slice(0, padding.length - modifyMargin);
      const str = ' '.repeat(modifyMargin) + s + ' '.repeat(modifyMargin);
      return `${marginedStartPadding}${modifyText(str)}`
    }).join('\n');
  }
  print () {
    console.clear();
    console.log(this.title);
    console.log('\n\n');
    for (let index = 0; index < this.options.length; index++) {
      const option = this.options[index];
      let title: string;
      const margin = Math.floor((this.maxTextWidth - option.name.length) / 2);
      if (index === this.selectedOption) {
        title = this.center(option.name, txt => chalk.bgGreen(chalk.black(txt)), margin);
      } else {
        title = this.center(option.name, txt => chalk.green(txt), margin);
      }
      console.log(title);
    }
  }
  hide () {
    console.clear();
  }
}
