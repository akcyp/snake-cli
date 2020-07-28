import chalk from 'chalk';
import SnakeGame from './SnakeGame';

class Printer {
  constructor (public game: SnakeGame) {}
  print () {
    console.clear();
    const rows = [];
    rows.push('# '.repeat(this.game.width + 2));
    for (let y = this.game.height - 1; y >= 0; y--) {
      let row = '# ';
      for (let x = 0; x < this.game.width; x++) {
        if (this.game.foodManager.foods.some((p) => (p.x === x && p.y === y))) {
          row += '@ ';
        } else if (this.game.snake.body.some((p) => (p.x === x && p.y === y))) {
          row += 'x ';
        } else {
          row += '  ';
        }
      }
      row += '# '
      rows.push(row);
    }
    rows.push('# '.repeat(this.game.width + 2));
    process.stdout.write(rows.join('\n'));
    process.stdout.write('\u001B[?25l');
  }
}

export default Printer;
