import chalk from 'chalk';
import SnakeGame from './SnakeGame';
import cliConsole from '../helpers/Console';

class Printer {
  constructor(public game: SnakeGame) {}
  print() {
    cliConsole.clear();
    const wallChar = this.game.isGameOver() ? chalk.red('#') : '#';
    const rows = [];
    rows.push((wallChar + ' ').repeat(this.game.width + 2));
    for (let y = this.game.height - 1; y >= 0; y--) {
      let row = wallChar + ' ';
      for (let x = 0; x < this.game.width; x++) {
        if (this.game.foodManager.foods.some((p) => p.x === x && p.y === y)) {
          row += chalk.green('@ ');
        } else if (this.game.snake.body.some((p) => p.x === x && p.y === y)) {
          if (this.game.isGameOver()) {
            row += chalk.red('x ');
          } else {
            row += chalk.blue('x ');
          }
        } else {
          row += '  ';
        }
      }
      row += wallChar + ' ';
      rows.push(row);
    }
    rows.push((wallChar + ' ').repeat(this.game.width + 2));
    cliConsole.log(rows.join('\n'));
  }
}

export default Printer;
