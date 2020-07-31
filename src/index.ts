#!/usr/bin/env node

import SnakeGame from './SnakeGame';

const game = new SnakeGame({
  moveThroughWall: false,
  speed: 10,
}).on('gameOver', () => {
  process.stdin.on('keypress', () => process.exit());
}).init();


