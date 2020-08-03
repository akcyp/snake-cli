#!/usr/bin/env node

import SnakeGame from './core/SnakeGame';
import CLIMenu from './CLIMenu';

if (require.main === module) {
  const Sleep = (ts: number) => new Promise((res) => setTimeout(res, ts));
  const blink = async () => {
    console.clear();
    await Sleep(400);
    game.printer.print();
    await Sleep(400);
  };
  const game = new SnakeGame({
    moveThroughWall: false,
    difficulty: 'easy',
  }).on('gameOver', async () => {
    for (let i = 0; i < 4; i++) {
      await blink();
    }
    await Sleep(1000);
    game.destroy();
    gameOverMenu.init();
  });
  const gameOverMenu = new CLIMenu({
    title: `
   ______                        ____                         
  / ____/___ _____ ___  ___     / __ \\_   _____  _____      
 / / __/ __ \`/ __ \`__ \\/ _ \\   / / / / | / / _ \\/ ___/ 
/ /_/ / /_/ / / / / / /  __/  / /_/ /| |/ /  __/ /         
\\____/\\__,_/_/ /_/ /_/\\___/   \\____/ |___/\\___/_/     
`,
    options: [
      {
        onInit() {
          this.name = `Your score is ${game.snake.body.length * 10 - 10} points!\n`;
        },
        disabled: true,
      },
      {
        name: 'Play again',
        callback() {
          this.menu.destroy();
          game.init();
        },
      },
      {
        name: 'Back to main menu',
        callback() {
          this.menu.destroy();
          mainMenu.init();
        },
      },
      {
        name: 'Exit',
        callback() {
          console.clear();
          process.exit();
        },
      },
    ],
  });
  const mainMenu = new CLIMenu({
    title: `
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
        },
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
            },
          },
          {
            name: `Difficulty: ${game.get('difficulty')!}`,
            value: {
              levels: ['easy', 'medium', 'hard'],
              selected: game.get('difficulty')!,
            },
            callback() {
              const currentIndex = this.value.levels.indexOf(game.get('difficulty')!);
              this.value.selected = this.value.levels[currentIndex + 1] || this.value.levels[0];
              this.name = `Difficulty: ${this.value.selected}`;
              game.set('difficulty', this.value.selected);
              this.menu.print();
            },
          },
          {
            disabled: true,
          },
          {
            name: 'Back',
            callback() {
              this.back();
            },
          },
        ],
      },
      {
        name: 'Exit',
        callback() {
          console.clear();
          process.exit();
        },
      },
    ],
  });
  mainMenu.init();
}

export default SnakeGame;
