import { Direction } from "./directions.js";
import { Game } from "./game.js";
import { Sprite, renderSprite, updateSprite } from "./sprite.js";

const FLOOR = 0;
const WALL = 1;

/**
 * @typedef StageCoord
 * @property {number} row
 * @property {number} col
 */

/**
 * Checks if two coordinates are the same.
 * @param {StageCoord} c1 
 * @param {StageCoord} c2 
 */
export function isSameCoord(c1, c2) {
    return c1.row === c2.row && c1.col === c2.col;
}

/**
 * @typedef Stage
 * @property {number} width 
 * @property {number} height 
 * @property {number[]} grid 
 * @property {string} floorColor 
 * @property {string} wallColor 
 * @property {Sprite[]} mice 
 * @property {Sprite} farmer 
 */
export class Stage {
    /**
     * 
     * @param {string[]} layout 
     */
    constructor(layout) {
        this.width = layout[0].length;
        this.height = layout.length;
        this.grid = new Array(this.width * this.height);
        this.floorColor = "#edd08c";
        this.wallColor = "#8cceed";

        this.mice = [];
        this.farmer = new Sprite("farmer");

        for (let i = 0; i < this.height; ++i) {
            for (let j = 0; j < this.width; ++j) {
                const cell = layout[i].charAt(j);

                if (cell === "F") {
                    this.farmer.row = i;
                    this.farmer.col = j;
                } else if (cell === "M") {
                    const mouse = new Sprite("mouse");
                    mouse.row = i;
                    mouse.col = j;
                    this.mice.push(mouse);
                } else if (cell === "#") {
                    this.setCell(i, j, WALL);
                } else {
                    this.setCell(i, j, FLOOR);
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

    /**
     * 
     * @param {StageCoord} c
     * @returns 
     */
    isWall(c) {
        return this.cell(c.row, c.col) === WALL;
    }

    /**
     * 
     * @param {StageCoord} c 
     * @param {number} direction 
     */
    neighbor(c, direction) {
        switch (direction) {
            case Direction.UP: return {
                row: indexBefore(c.row, this.height),
                col: c.col
            };

            case Direction.DOWN: return {
                row: indexAfter(c.row, this.height),
                col: c.col
            };

            case Direction.LEFT: return {
                row: c.row,
                col: indexBefore(c.col, this.width)
            };

            case Direction.RIGHT: return {
                row: c.row,
                col: indexAfter(c.col, this.width)
            };
        }
        throw new Error("Invalid direction: " + direction);
    }
}

/**
 * 
 * @param {Stage} stage 
 * @param {Sprite} sprite
 * @param {number} direction 
 */
export function isMoveAllowed(stage, sprite, direction) {
    const neighbor = stage.neighbor(sprite, direction);

    if (stage.isWall(neighbor)) {
        return false;
    }

    for (const mouse of stage.mice) {
        if (isSameCoord(mouse, neighbor)) {
            return false;
        }
    }

    return true;
}

/**
 * Gets the index before the given index. Loops around to the end
 * if the given index is zero.
 * @param {number} index 
 * @param {number} length 
 * @returns 
 */
function indexBefore(index, length) {
    index -= 1;
    if (index < 0) {
        index += length;
    }
    return index;
}

/**
 * Gets the index after the given index. Loops around to the beginning
 * if the given index is greater than or equal to length.
 * @param {number} index 
 * @param {number} length 
 * @returns 
 */
function indexAfter(index, length) {
    index += 1;
    if (index >= length) {
        index = 0;
    }
    return index;
}

/**
 * 
 * @param {Stage} stage 
 * @param {Sprite} sprite 
 * @param {number} direction 
 */
export function moveSprite(stage, sprite, direction) {
    switch (direction) {
        case Direction.UP:
            sprite.row = indexBefore(sprite.row, stage.height);
            break;
        case Direction.DOWN:
            sprite.row = indexAfter(sprite.row, stage.height);
            break;
        case Direction.LEFT:
            sprite.col = indexBefore(sprite.col, stage.width);
            break;
        case Direction.RIGHT:
            sprite.col = indexAfter(sprite.col, stage.width);
            break;
    }
}

/**
 * 
 * @param {Stage} stage 
 * @param {Game} game
 */
export function updateStage(stage, game) {
    updateSprite(stage.farmer, game);
    for (const mouse of stage.mice) {
        updateSprite(mouse, game);
    }
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
    
    for (const mouse of stage.mice) {
        renderSprite(context, mouse, game);
    }
    renderSprite(context, stage.farmer, game);
}