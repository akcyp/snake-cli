import CLIMenu from '.';

export interface IMenuOptions {
  name?: string;
  disabled?: boolean;
  value?: any;
  submenu?: IMenuOptions[];
  callback?: (this: MenuOption) => void;
  onInit?: (this: MenuOption) => void;
}

export default class MenuOption {
  public name: string;
  public disabled: boolean;
  public value: any;
  public submenu?: CLIMenu;
  public _callback?: (this: MenuOption) => void;
  public onInit?: (this: MenuOption) => void;
  constructor(settings: IMenuOptions, public menu: CLIMenu) {
    this.name = settings.name || '';
    this.disabled = settings.disabled || false;
    this.value = settings.value;
    if (settings.submenu) {
      this.submenu = new CLIMenu({
        title: this.menu.title,
        options: settings.submenu,
        parent: this.menu,
      });
    }
    this._callback = settings.callback;
    this.onInit = settings.onInit;
  }
  callback() {
    this._callback?.call(this);
    if (this.submenu) {
      this.menu.destroy();
      this.submenu.init();
    }
  }
  back() {
    if (this.menu.parent) {
      this.menu.destroy();
      this.menu.parent.init();
    }
  }
}
