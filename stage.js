import { Sprite } from "./sprite.js";

export const Direction = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
}

const CellValue = {
    NOTHING:        0b00,
    HAS_TOP_WALL:   0b01,
    HAS_LEFT_WALL:  0b10,
};

const Mark = {
    WALL_ROW: ">",
    WALL_COL: "V",
    TOP_WALL: "-",
    LEFT_WALL: "|",
    FARMER: "F",
    MOUSE: "M",
    CHEESE: "C",
    MOUSETRAP: "T",
};

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
 * @property {Sprite[]} mice 
 * @property {Sprite[]} mousetraps 
 * @property {Sprite} farmer 
 * @property {Sprite} cheese 
 */
export class Stage {
    /**
     * 
     * @param {string[]} layout 
     */
    constructor(layout) {
        this.numCols = layout[0].replaceAll(Mark.WALL_COL, "").length - 1;
        this.numRows = layout.slice(1).filter(line => !line.startsWith(Mark.WALL_ROW)).length;

        this.grid = new Array(this.numCols * this.numRows).fill(CellValue.NOTHING);

        this.mice = [];
        this.mousetraps = [];
        this.farmer = new Sprite("farmer");
        this.cheese = new Sprite("cheese");

        this.nextFarmerMove = null;
        this.lastMouseMove = 0;

        let row = 0;
        for (let i = 1; i < layout.length; ++i) {
            const wallRow = layout[i].charAt(0) === Mark.WALL_ROW;
            
            let col = 0;
            for (let j = 1; j < layout[0].length; ++j) {
                const wallCol = layout[0].charAt(j) === Mark.WALL_COL;

                const mark = layout[i].charAt(j);
                if (wallRow || wallCol) {
                    let cell = this.cell(row, col);

                    if (wallRow && mark === Mark.TOP_WALL) {
                        cell |= CellValue.HAS_TOP_WALL;
                    }

                    if (wallCol && mark === Mark.LEFT_WALL) {
                        cell |= CellValue.HAS_LEFT_WALL;
                    }

                    this.setCell(row, col, cell);
                } else {
                    if (mark === Mark.FARMER) {
                        this.farmer.row = row;
                        this.farmer.col = col;
                    } else if (mark === Mark.MOUSE) {
                        const mouse = new Sprite("mouse");
                        mouse.row = row;
                        mouse.col = col;
                        this.mice.push(mouse);
                    } else if (mark === Mark.CHEESE) {
                        this.cheese.row = row;
                        this.cheese.col = col;
                    } else if (mark === Mark.MOUSETRAP) {
                        const mousetrap = new Sprite("mousetrap");
                        mousetrap.row = row;
                        mousetrap.col = col;
                        this.mousetraps.push(mousetrap);
                    }
                }

                if (!wallCol) {
                    col++;
                }
            }

            if (!wallRow) {
                row++;
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
        return this.grid[row * this.numCols + col];
    }

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     * @param {number} value 
     */
    setCell(row, col, value) {
        this.grid[row * this.numCols + col] = value;
    }

    /**
     * 
     * @param {StageCoord} c 
     * @returns 
     */
    isBoundary(c) {
        return c.row < 0 || c.row >= this.numRows ||
            c.col < 0 || c.col >= this.numCols;
    }

    /**
     * 
     * @param {StageCoord} c 
     * @returns 
     */
    hasTopWall(c) {
        return (this.cell(c.row, c.col) & CellValue.HAS_TOP_WALL) === CellValue.HAS_TOP_WALL;
    }

    /**
     * 
     * @param {StageCoord} c 
     * @returns 
     */
    hasLeftWall(c) {
        return (this.cell(c.row, c.col) & CellValue.HAS_LEFT_WALL) === CellValue.HAS_LEFT_WALL;
    }

    /**
     * 
     * @param {StageCoord} c 
     * @param {number} direction 
     */
    neighbor(c, direction) {
        switch (direction) {
            case Direction.UP: return {
                row: c.row - 1,
                col: c.col
            };

            case Direction.DOWN: return {
                row: c.row + 1,
                col: c.col
            };

            case Direction.LEFT: return {
                row: c.row,
                col: c.col - 1
            };

            case Direction.RIGHT: return {
                row: c.row,
                col: c.col + 1
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

    if (stage.isBoundary(neighbor)) {
        return false;
    }
    
    if (direction === Direction.UP && stage.hasTopWall(sprite)) {
        return false;
    }
    
    if (direction === Direction.DOWN && stage.hasTopWall(neighbor)) {
        return false;
    }
    
    if (direction === Direction.LEFT && stage.hasLeftWall(sprite)) {
        return false;
    }
    
    if (direction === Direction.RIGHT && stage.hasLeftWall(neighbor)) {
        return false;
    }

    for (const mouse of stage.mice) {
        if (isSameCoord(mouse, neighbor)) {
            return false;
        }
    }

    if (isSameCoord(stage.cheese, neighbor)) {
        return false;
    }

    return true;
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
            sprite.row -= 1;
            break;
        case Direction.DOWN:
            sprite.row += 1;
            break;
        case Direction.LEFT:
            sprite.col -= 1;
            break;
        case Direction.RIGHT:
            sprite.col += 1;
            break;
    }
}
