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