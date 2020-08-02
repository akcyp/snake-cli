import CLIMenu from '.';

export interface IMenuOptions {
  name: string,
  value?: any,
  submenu?: IMenuOptions[],
  callback?: (this: MenuOption) => void
}

export default class MenuOption {
  public name: string;
  public value: any;
  public submenu?: CLIMenu;
  public _callback?: (this: MenuOption) => void;
  constructor (settings: IMenuOptions, public menu: CLIMenu) {
    this.name = settings.name || '';
    this.value = settings.value;
    if (settings.submenu) {
      this.submenu = new CLIMenu({
        title: this.menu.title,
        options: settings.submenu,
        parent: this.menu
      });
    }
    this._callback = settings.callback;
  }
  callback () {
    if (this._callback) {
      this._callback.call(this);
    }
    if (this.submenu) {
      this.menu.destroy();
      this.submenu.init();
    }
  }
  back () {
    if (this.menu.parent) {
      this.menu.destroy();
      this.menu.parent.init();
    }
  }
}
