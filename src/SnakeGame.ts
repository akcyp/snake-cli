import inputController from './InputController';
import Snake from './Snake';
import Printer from './Printer';
import FoodManager from './FoodManager';
import { EventEmitter } from 'events';

export enum Vector {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export enum Direction {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

const keyBindings: { [id: string]: [number, number] } = {
  right: [1, 0],
  left: [-1, 0],
  up: [0, 1],
  down: [0, -1],
};

interface IGameConfig {
  moveThroughWall?: boolean;
  speed?: number;
}

export default class SnakeGame extends EventEmitter {
  private gameOvered = false;
  public config: IGameConfig;
  public snake: Snake;
  public foodManager: FoodManager;
  public interval: NodeJS.Timeout | null = null;
  public printer = new Printer(this);
  public width = Math.floor(process.stdout.columns / 2) - 2;
  public height = Math.floor(process.stdout.rows / 1) - 2;
  public isGameOver() {
    return this.gameOvered;
  }
  public isNotStarted() {
    return this.snake.dx === 0 && this.snake.dy === 0;
  }
  public getVector(dx: number, dy: number) {
    return Object.keys(keyBindings).find((key) => {
      const [x, y] = keyBindings[key];
      return x === dx && y === dy;
    }) as Vector;
  }
  public getDir(vector: Vector) {
    if (vector === Vector.Down || vector === Vector.Up) {
      return Direction.Vertical;
    } else {
      return Direction.Horizontal;
    }
  }
  constructor(config: IGameConfig = {}) {
    super();
    this.config = Object.assign(
      {
        moveThroughWall: true,
        speed: 1000,
      },
      config,
    );
    this.snake = new Snake(this);
    this.foodManager = new FoodManager(this);
    this.printer.print();
  }
  init () {
    const self = this;
    function onEveryKeypress (name: Vector) {
      if (Object.values(Vector).includes(name)) {
        self.setSnakeMoveDirection(name);
      }
    }
    function onFirstKeypress () {
      self.start();
    }
    inputController.on('keypress', onEveryKeypress);
    inputController.once('keypress', onFirstKeypress);
    this.on('destroy', () => {
      inputController.off('keypress', onEveryKeypress);
      inputController.off('keypress', onFirstKeypress);
    })
  }
  start() {
    this.interval = setInterval(() => this.tick(), 1000 / this.config.speed!);
  }
  setSnakeMoveDirection(key: Vector) {
    const [dx, dy] = keyBindings[key];
    const dir = this.getDir(this.getVector(dx, dy));
    const lastDir = this.getDir(this.getVector(this.snake.lastDx, this.snake.lastDy));
    if (this.isNotStarted() || dir !== lastDir) {
      this.snake.dx = dx;
      this.snake.dy = dy;
    }
  }
  tick() {
    this.snake.move();
    if (this.snake.isDead()) {
      this.gameOver();
      return;
    }
    this.printer.print();
  }
  gameOver() {
    this.gameOvered = true;
    this.emit('gameOver', true);
    this.printer.print();
    this.destroy();
  }
  destroy() {
    if (this.interval !== null) {
      clearInterval(this.interval);
    }
    this.interval = null;
    this.emit('destroy');
  }
}
