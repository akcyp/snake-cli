import chalk from 'chalk';
import inputController from '../helpers/InputController';
import cliConsole from '../helpers/Console';
import { EventEmitter } from 'events';

import MenuOption, { IMenuOptions } from './MenuOptions';

interface ICLIMenuOptions {
  title?: string;
  options?: IMenuOptions[];
  parent?: CLIMenu;
}

export default class CLIMenu extends EventEmitter {
  public get width () {
    return process.stdout.columns;
  }
  public get height () {
    return process.stdout.rows;
  }
  public title: string;
  public options: MenuOption[];
  public parent?: CLIMenu;
  public maxTextWidth: number = 0;
  public selectedOption?: MenuOption;
  public inited = false;
  constructor(settings: ICLIMenuOptions = {}) {
    super();
    this.title = settings.title || '';
    this.parent = settings.parent;
    this.options = (settings.options || []).map((opt) => new MenuOption(opt, this));
    this.selectedOption = this.options.filter((option) => !option.disabled)[0];

    this.onResize();
    process.stdout.on('resize', () => this.onResize());
  }
  onResize () {
    this.maxTextWidth = Math.max(
      ...(this.options || [])
        .map((option) => option.name)
        .concat(this.title)
        .map((str) => this.calculateTextSize(str).width),
    );
    if (this.inited) {
      this.print();
    }
  }
  init() {
    const self = this;
    self.inited = true;
    function onKeyPress(name: string) {
      if (name === 'down' || name === 'up') {
        const arr = name === 'down' ? [...self.options] : [...self.options].reverse();
        const index = arr.indexOf(self.selectedOption!);
        self.selectedOption = [...arr.slice(index + 1), ...arr.slice(0, index + 1)].filter(
          (option) => !option.disabled,
        )[0];
        self.print();
      } else if (name === 'return' || name === 'space') {
        self.selectedOption?.callback?.call(self.selectedOption);
      }
    }
    inputController.on('keypress', onKeyPress);
    this.on('destroy', () => {
      inputController.off('keypress', onKeyPress);
    });
    this.options.forEach((option) => {
      option.onInit?.call(option);
    });
    this.print();
  }
  destroy() {
    this.inited = false;
    cliConsole.clear();
    this.emit('destroy');
  }
  calculateTextSize(text: string) {
    const rows = text.split('\n');
    return {
      width: Math.max(...rows.map((s) => s.length)),
      height: rows.length,
    };
  }
  center(text: string, modifyText: (text: string) => string = (val: string) => val, modifyMargin: number = 0) {
    const maxWidth = this.calculateTextSize(text).width;
    const padding = ' '.repeat(Math.floor((this.width - maxWidth) / 2));
    return text
      .split('\n')
      .map((s) => {
        const marginedStartPadding = padding.slice(0, padding.length - modifyMargin);
        const str = ' '.repeat(modifyMargin) + s + ' '.repeat(modifyMargin);
        return `${marginedStartPadding}${modifyText(str)}`;
      })
      .join('\n');
  }
  print() {
    const height =
      this.title.split('\n').length + this.options.reduce((prev, now) => prev + now.name.split('\n').length, 0);
    cliConsole.clear();
    cliConsole.log('\n'.repeat(Math.floor(this.height - height) / 4));
    cliConsole.log(this.center(this.title, chalk.green));
    for (const option of this.options) {
      let title: string;
      const margin = Math.floor((this.maxTextWidth - option.name.length) / 2);
      if (option === this.selectedOption) {
        title = this.center(option.name, (txt) => chalk.bgGreen(chalk.black(txt)), margin);
      } else {
        title = this.center(option.name, (txt) => chalk.green(txt), margin);
      }
      cliConsole.log(title);
    }
  }
}
