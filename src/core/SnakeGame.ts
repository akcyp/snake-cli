import inputController from '../helpers/InputController';
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

export interface IGameConfig {
  moveThroughWall?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default class SnakeGame extends EventEmitter {
  private gameOvered = false;
  public config: IGameConfig;
  public snake: Snake;
  public foodManager: FoodManager;
  public interval: NodeJS.Timeout | null = null;
  public printer = new Printer(this);
  public get width () {
    return Math.floor(process.stdout.columns / 2) - 2;
  }
  public get height () {
    return Math.floor(process.stdout.rows / 1) - 2;
  }
  public set<K extends keyof IGameConfig>(key: K, value: IGameConfig[K]) {
    return (this.config[key] = value);
  }
  public get<K extends keyof IGameConfig>(key: K): IGameConfig[K] {
    return this.config[key];
  }
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
        difficulty: 'easy',
      },
      config,
    );
    this.snake = new Snake(this);
    this.foodManager = new FoodManager(this);
  }
  init() {
    const self = this;
    function onEveryKeypress(name: Vector) {
      if (Object.values(Vector).includes(name)) {
        self.setSnakeMoveDirection(name);
      }
    }
    function onFirstKeypress() {
      self.start();
    }
    inputController.on('keypress', onEveryKeypress);
    inputController.once('keypress', onFirstKeypress);
    this.on('destroy', () => {
      inputController.off('keypress', onEveryKeypress);
      inputController.off('keypress', onFirstKeypress);
    });
    this.reset();
    this.printer.print();
    return this;
  }
  reset() {
    this.gameOvered = false;
    this.snake.reset();
    this.foodManager.reset();
  }
  start() {
    this.printer.print();
    this.interval = setInterval(() => this.tick(), 1000 / this.snake.speed!);
    return this;
  }
  setSnakeMoveDirection(key: Vector) {
    const [dx, dy] = keyBindings[key];
    const dir = this.getDir(this.getVector(dx, dy));
    const lastDir = this.getDir(this.getVector(this.snake.lastDx, this.snake.lastDy));
    if (this.isNotStarted() || dir !== lastDir) {
      this.snake.dx = dx;
      this.snake.dy = dy;
      return true;
    }
    return false;
  }
  tick() {
    this.snake.move();
    if (this.snake.isDead()) {
      this.gameOver();
      return;
    }
    this.printer.print();
    return this;
  }
  gameOver() {
    this.gameOvered = true;
    this.emit('gameOver', true);
    this.snake.body = [...this.snake.lastBody];
    this.printer.print();
    this.destroy();
    return this;
  }
  destroy() {
    if (this.interval !== null) {
      clearInterval(this.interval);
    }
    this.interval = null;
    this.emit('destroy');
    return this;
  }
}
