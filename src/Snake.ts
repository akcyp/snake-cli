import Point from './Point';
import SnakeGame from './SnakeGame';

export default class Snake {
  public x: number;
  public y: number;
  public dx = 0;
  public dy = 0;
  public lastDx = 0;
  public lastDy = 0;
  public body: Point[] = [];
  constructor (public game: SnakeGame) {
    this.x = Math.round(this.game.width / 2);
    this.y = Math.round(this.game.height / 2);
    this.body.push(new Point(this.x, this.y));
  }
  move () {
    this.x += this.dx;
    this.y += this.dy;

    if (this.game.foodManager.foods.some((p) => p.x === this.x && p.y === this.y)) {
      this.game.foodManager.remove(this.x, this.y);
      this.game.foodManager.add();
      this.eat(this.x, this.y);
    }

    if (this.game.config.moveThroughWall) {
      if (this.x === -1) {
        this.x = this.game.width - 1;
      }
      if (this.x === this.game.width) {
        this.x = 0;
      }
      if (this.y === this.game.height) {
        this.y = 0;
      }
      if (this.y === -1) {
        this.y = this.game.height - 1;
      }
    }

    this.body.unshift(new Point(this.x, this.y));
    this.body.pop();

    this.lastDx = this.dx;
    this.lastDy = this.dy;
  }
  eat (x: number, y: number) {
    this.body.push(new Point(x, y));
  }
  collide (x: number, y: number) {
    return this.body.slice(1).find((p) => p.x === x && p.y === y);
  }
  isDead () {
    if (this.collide(this.x, this.y)) {
      return true;
    }
    if (this.game.config.moveThroughWall === false && (
      this.x < 0 || this.x >= this.game.width || this.y < 0 || this.y >= this.game.height
    )) {
      return true;
    }
    return false;
  }
}
