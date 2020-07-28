import inputController from './src/InputController';
import SnakeGame from './src/SnakeGame';

const game = new SnakeGame({
  moveThroughWall: false
});
game.on('gameOver', () => {
  process.stdin.on('keypress', () => process.exit());
});

inputController.on('keypress', (name) => {
  game.setSnakeMoveDirection(name);
  // console.log(`You pressed the "${name}" key`);
});
inputController.once('keypress', () => game.start());
