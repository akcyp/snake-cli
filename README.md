# snake-cli-ts

CLI Snake Game written in NodeJS and TypeScript

## Install

```bash
npm i snake-cli-ts -g
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
const SnakeGame = require('snake-cli-ts').default;
// ES6 modules with Babel or TypeScript
import SnakeGame from 'snake-cli-ts';
const game = new SnakeGame({
  moveThroughWall: false,
  difficulty: 'easy',
}).on('gameOver', () => {
  console.clear();
  console.log(`Your score: ${game.snake.body.length} points`);
  process.exit();
}).init();
```
