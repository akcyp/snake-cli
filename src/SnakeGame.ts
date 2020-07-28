import Snake from './Snake';
import Printer from './Printer';
import FoodManager from './FoodManager';
import { EventEmitter } from 'events';

export enum Vector {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right'
}

export enum Direction {
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}

interface IGameConfig {
  moveThroughWall?: boolean;
}

export default class SnakeGame extends EventEmitter {
  public config: IGameConfig;
  public snake: Snake;
  public foodManager: FoodManager;
  public interval: NodeJS.Timeout;
  public printer = new Printer(this);
  public width = Math.floor(process.stdout.columns / 2) - 2;
  public height = Math.floor(process.stdout.rows / 1) - 2;
  public keyBindings = {
    right: [1, 0],
    left: [-1, 0],
    up: [0, 1],
    down: [0, -1]
  }
  public isNotStarted () {
    return this.snake.dx === 0 && this.snake.dy === 0;
  }
  public getVector (dx: number, dy: number) {
    return Object.keys(this.keyBindings).find(key => {
      const [x, y] = this.keyBindings[key];
      return x === dx && y === dy;
    }) as Vector;
  }
  public getDir (vector: Vector) {
    if (vector === Vector.Down || vector === Vector.Up) {
      return Direction.Vertical;
    } else {
      return Direction.Horizontal;
    }
  }
  constructor (config: IGameConfig = {}) {
    super();
    this.config = Object.assign({
      moveThroughWall: true
    }, config);
    this.snake = new Snake(this);
    this.foodManager = new FoodManager(this);
    this.printer.print();
  }
  start () {
    this.interval = setInterval(() => this.tick(), 200);
  }
  setSnakeMoveDirection (key: Direction) {
    const [dx, dy] = this.keyBindings[key];
    const dir = this.getDir(this.getVector(dx, dy));
    const lastDir = this.getDir(this.getVector(this.snake.lastDx, this.snake.lastDy));
    if (this.isNotStarted() || dir !== lastDir) {
      this.snake.dx = dx;
      this.snake.dy = dy;
    }
  }
  tick () {
    this.snake.move();
    if (this.snake.isDead()) {
      this.gameOver();
      return;
    }
    this.printer.print();
  }
  gameOver () {
    this.emit('gameOver', true);
    this.destroy();
  }
  destroy() {
    clearInterval(this.interval);
  }
}
