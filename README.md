# snake-cli

CLI Snake Game written in NodeJS

## Install

```bash
npm i akcyp/snake-cli -g
```

## Usage

```bash
# Just type in console:
snake
```

![Example ss](snake-cli.gif)

## Use as module

```js
// CommonJS modules
const SnakeGame = require('snake-cli').default;
// ES6 modules with Babel or TypeScript
import SnakeGame from 'snake-cli';
const game = new SnakeGame({
  moveThroughWall: false,
  difficulty: 'easy',
}).on('gameOver', () => {
  console.clear();
  console.log(`Your score: ${game.snake.body.length} points`);
  process.exit();
}).init();
```
