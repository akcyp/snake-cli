import Point from './Point';
import SnakeGame from './SnakeGame';

export default class Snake {
  public x: number = 0;
  public y: number = 0;
  public dx = 0;
  public dy = 0;
  public lastDx = 0;
  public lastDy = 0;
  public body: Point[] = [];
  public lastBody: Point[] = [];
  public get speed() {
    return (
      {
        easy: 5,
        medium: 10,
        hard: 15,
      }[this.game.get('difficulty')!] || 5
    );
  }
  constructor(public game: SnakeGame) {
    this.reset();
  }
  reset() {
    this.dx = 0;
    this.dy = 0;
    this.lastDx = 0;
    this.lastDy = 0;
    this.body = [];
    this.lastBody = [];
    this.x = Math.round(this.game.width / 2);
    this.y = Math.round(this.game.height / 2);
    this.body.push(new Point(this.x, this.y));
  }
  move() {
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

    this.lastBody = [...this.body];

    this.body.unshift(new Point(this.x, this.y));
    this.body.pop();

    this.lastDx = this.dx;
    this.lastDy = this.dy;
    return this;
  }
  eat(x: number, y: number) {
    this.body.push(new Point(x, y));
    return this;
  }
  collide(x: number, y: number) {
    return this.body.slice(1).find((p) => p.x === x && p.y === y);
  }
  isOutOfBox(x: number, y: number) {
    return x < 0 || x >= this.game.width || y < 0 || y >= this.game.height;
  }
  isDead() {
    if (this.collide(this.x, this.y)) {
      return true;
    }
    if (this.game.config.moveThroughWall === false && this.isOutOfBox(this.x, this.y)) {
      return true;
    }
    return false;
  }
}
