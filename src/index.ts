#!/usr/bin/env node

import SnakeGame, { IGameConfig } from './SnakeGame';
import CLIMenu from './CLIMenu';

if (require.main === module) {
  const game = new SnakeGame({
    moveThroughWall: false,
    difficulty: 'easy',
  }).on('gameOver', () => {
    process.stdin.on('keypress', () => {
      console.clear();
      process.exit();
    });
  });
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
          this.menu.destroy();
          game.init();
        }
      },
      {
        name: 'Options',
        submenu: [
          {
            name: `${game.get('moveThroughWall')! ? '[*]' : '[ ]'} Let the snake walk through the walls`,
            value: game.get('moveThroughWall')!,
            callback() {
              this.value = !this.value;
              this.name = `${this.value ? '[*]' : '[ ]'} Let the snake walk through the walls`;
              game.set('moveThroughWall', this.value);
              this.menu.print();
            }
          },
          {
            name: `Difficulty: ${game.get('difficulty')!}`,
            value: {
              levels: ['easy', 'medium', 'hard'],
              selected: game.get('difficulty')!
            },
            callback() {
              const currentIndex = this.value.levels.indexOf(game.get('difficulty')!);
              this.value.selected = this.value.levels[currentIndex + 1] || this.value.levels[0];
              this.name = `Difficulty: ${this.value.selected}`;
              game.set('difficulty', this.value.selected);
              this.menu.print();
            }
          },
          {
            name: 'Back',
            callback() {
              this.back();
            }
          }
        ],
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
  menu.init();
}

export default SnakeGame;
