import SnakeGame from './SnakeGame';
import Point from './Point';

const getRandomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

export default class FoodManager {
  public foods: Point[] = [];
  constructor (public game: SnakeGame) {
    this.add();
  }
  remove (x: number, y: number) {
    const index = this.foods.findIndex((p) => p.x === x && p.y === y);
    return this.foods.splice(index, 1)[0];
  }
  add () {
    this.foods.push(this.getRandomPoint(this.game.snake.body));
  }
  getRandomPoint (exceptions: Point[] = []) {
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
}
