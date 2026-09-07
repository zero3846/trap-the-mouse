import { Direction } from "./directions.js";
import { Game } from "./game.js";

const FLOOR = 0;
const WALL = 1;

export class Stage {
    /**
     * 
     * @param {number} width 
     */
    constructor(width) {
        this.width = width;
        this.height = Math.floor(width / 4 * 3);
        this.grid = new Array(this.width * this.height).fill(FLOOR);
        this.floorColor = "#edd08c";
        this.wallColor = "#8cceed";

        for (let i = 0; i < this.height; ++i) {
            for (let j = 0; j < this.width; ++j) {
                if (i == 0 || i == this.height - 1
                    || j == 0 || j == this.width - 1
                ) {
                    this.setCell(i, j, WALL);
                }
            }
        }
    }

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     * @return {number}
     */
    cell(row, col) {
        return this.grid[row * this.width + col];
    }

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     * @param {number} value 
     */
    setCell(row, col, value) {
        this.grid[row * this.width + col] = value;
    }

    rowBefore(row) {
        return row - 1 >= 0 ? row - 1 : this.height - 1;
    }

    rowAfter(row) {
        return row + 1 < this.height ? row + 1 : 0;
    }

    colBefore(col) {
        return col - 1 >= 0 ? col - 1 : this.width - 1;
    }

    colAfter(col) {
        return col + 1 < this.width ? col + 1 : 0;
    }

    isWall(row, col) {
        return this.cell(row, col) === WALL;
    }
}

/**
 * 
 * @param {Stage} stage 
 * @param {number} row 
 * @param {number} col 
 * @param {number} direction 
 * @param {Game} game 
 */
export function isDirectionAllowed(stage, row, col, direction, game) {
    let neighbor;
    switch (direction) {
        case Direction.UP:
            neighbor = {
                row: stage.rowBefore(row),
                col
            };
            break;

        case Direction.DOWN:
            neighbor = {
                row: stage.rowAfter(row),
                col
            };
            break;

        case Direction.LEFT:
            neighbor = {
                row,
                col: stage.colBefore(col)
            };
            break;

        case Direction.RIGHT:
            neighbor = {
                row,
                col: stage.colAfter(col)
            };
            break;
    }

    const { mouse } = game;

    const obstacle =
        stage.isWall(neighbor.row, neighbor.col)
        || mouse.row === neighbor.row && mouse.col === neighbor.col;
    return !obstacle;
}

/**
 * 
 * @param {Stage} stage 
 * @param {Mouse|Farmer} sprite 
 * @param {number} direction 
 */
export function moveSprite(stage, sprite, direction) {
    switch (direction) {
        case Direction.UP:
            sprite.row -= 1;
            if (sprite.row < 0) {
                sprite.row += stage.height;
            }
            break;
        case Direction.DOWN:
            sprite.row += 1;
            if (sprite.row >= stage.height) {
                sprite.row = 0;
            }
            break;
        case Direction.LEFT:
            sprite.col -= 1;
            if (sprite.col < 0) {
                sprite.col += stage.width;
            }
            break;
        case Direction.RIGHT:
            sprite.col += 1;
            if (sprite.col >= stage.width) {
                sprite.col = 0;
            }
            break;
    }
}

/**
 * 
 * @param {Stage} stage 
 * @param {Game} game
 */
export function updateStage(stage, game) {

}

/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {Stage} stage 
 * @param {Game} game 
 */
export function renderStage(context, stage, game) {
    context.save();

    const { cellSize } = game;

    // Render the whole floor.
    context.fillStyle = stage.floorColor;
    context.fillRect(0, 0, cellSize * stage.width, cellSize * stage.height);

    // Selectively render the walls
    for (let row = 0; row < stage.height; ++row) {
        for (let col = 0; col < stage.width; ++col) {
            if (stage.cell(row, col) === WALL) {
                context.fillStyle = stage.wallColor;
                context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }

    context.restore();
}