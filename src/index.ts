import inputController from './InputController';
import SnakeGame from './SnakeGame';

const game = new SnakeGame({
  moveThroughWall: false,
  speed: 10
});
game.on('gameOver', () => {
  process.stdin.on('keypress', () => process.exit());
});

inputController.on('keypress', (name) => {
  game.setSnakeMoveDirection(name);
  // console.log(`You pressed the "${name}" key`);
});
inputController.once('keypress', () => game.start());
