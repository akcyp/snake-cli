#!/usr/bin/env node

import SnakeGame from './SnakeGame';
import CLIMenu from './CLIMenu';

if (require.main === module) {
  const menu = new CLIMenu({
    title:
`
     _____             __           ________    ____     
    / ___/____  ____ _/ /_____     / ____/ /   /  _/     
    \\__ \\/ __ \\/ __ \`/ //_/ _ \\   / /   / /    / /  
   ___/ / / / / /_/ / ,< /  __/  / /___/ /____/ /        
  /____/_/ /_/\\__,_/_/|_|\\___/   \\____/_____/___/     
`,
    options: [
      {
        name: 'Start game',
        callback() {
          this.destroy();
          game.init();
        }
      },
      {
        name: 'Exit',
        callback() {
          console.clear();
          process.exit();
        }
      }
    ]
  });
  const game = new SnakeGame({
    moveThroughWall: false,
    speed: 10,
  }).on('gameOver', () => {
    process.stdin.on('keypress', () => {
      console.clear();
      process.exit();
    });
  });
  menu.init();
}

export default SnakeGame;
