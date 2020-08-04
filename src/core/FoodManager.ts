import chalk from 'chalk';
import SnakeGame from './SnakeGame';
import Point from '../helpers/Point';
import Food from './Food';

const getRandomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

export default class FoodManager {
  public foods: Food[] = [];
  constructor(public game: SnakeGame) {}
  find(x: number, y: number) {
    return this.foods.find(({ point }) => point.x === x && point.y === y);
  }
  findIndex(x: number, y: number) {
    return this.foods.findIndex(({ point }) => point.x === x && point.y === y);
  }
  remove(x: number, y: number) {
    const index = this.findIndex(x, y);
    return this.foods.splice(index, 1)[0];
  }
  add() {
    const point = this.getRandomPoint(this.game.snake.body);
    if (!point) {
      return;
    }
    const food = new Food(
      {
        point,
        symbol: chalk.green('@'),
      },
      this,
    );
    this.foods.push(food);
  }
  getRandomPoint(exceptions: Point[] = []) {
    const lottery: Point[] = [];
    for (let y = 0; y < this.game.height; y++) {
      for (let x = 0; x < this.game.width; x++) {
        if (exceptions.some((e) => e.x === x && e.y === y)) {
          continue;
        }
        lottery.push(new Point(x, y));
      }
    }
    return lottery[getRandomInt(0, lottery.length - 1)];
  }
  reset() {
    this.foods.length = 0;
    this.add();
  }
}
