import chalk from 'chalk';
import SnakeGame from './SnakeGame';

class Printer {
  constructor (public game: SnakeGame) {}
  print () {
    console.clear();
    const wallChar = this.game.isGameOver() ? chalk.red('#') : '#';
    const rows = [];
    rows.push((wallChar + ' ').repeat(this.game.width + 2));
    for (let y = this.game.height - 1; y >= 0; y--) {
      let row = wallChar + ' ';
      for (let x = 0; x < this.game.width; x++) {
        if (this.game.foodManager.foods.some((p) => (p.x === x && p.y === y))) {
          row += chalk.green('@ ');
        } else if (this.game.snake.body.some((p) => (p.x === x && p.y === y))) {
          if (this.game.isGameOver()) {
            row += chalk.red('x ');
          } else {
            row += chalk.blue('x ');
          }
        } else {
          row += '  ';
        }
      }
      row += (wallChar + ' ')
      rows.push(row);
    }
    rows.push((wallChar + ' ').repeat(this.game.width + 2));
    process.stdout.write(rows.join('\n'));
    process.stdout.write('\u001B[?25l');
  }
}

export default Printer;
