import Point from '../helpers/Point';
import FoodManager from './FoodManager';

interface EatEvent {
  preventDefault: () => void;
}
interface IFoodSettings {
  point: Point;
  symbol: string;
  onEat?: (this: Food, e: EatEvent) => void | boolean;
}

export default class Food {
  public point: Point;
  public symbol: string;
  public onEat?: (this: Food, e: EatEvent) => void | boolean;
  constructor(foodSettings: IFoodSettings, public foodManager: FoodManager) {
    this.point = foodSettings.point;
    this.symbol = foodSettings.symbol;
    this.onEat = foodSettings.onEat;
  }
  use() {
    let useDefault = true;
    this.onEat?.call(this, {
      preventDefault() {
        useDefault = false;
      },
    });
    if (useDefault) {
      this.foodManager.remove(this.point.x, this.point.y);
      this.foodManager.add();
      this.foodManager.game.snake.eat(this.point.x, this.point.y);
    }
  }
}
