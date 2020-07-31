#!/usr/bin/env node

import SnakeGame from './SnakeGame';

if (require.main === module) {
  new SnakeGame({
    moveThroughWall: false,
    speed: 10,
  }).on('gameOver', () => {
    process.stdin.on('keypress', () => process.exit());
  }).init();
}

export default SnakeGame;
