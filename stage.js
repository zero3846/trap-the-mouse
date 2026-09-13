import { Layer, Renderable } from "./renderable.js";
import { Cheese, Farmer, Mouse, MouseTrap, Sprite } from "./sprite.js";

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
export class Stage extends Renderable {
    /**
     * 
     * @param {string[]} layout 
     */
    constructor(layout) {
        super();

        this.cellSize = 48;
        this.numCols = layout[0].replaceAll(Mark.WALL_COL, "").length - 1;
        this.numRows = layout.slice(1).filter(line => !line.startsWith(Mark.WALL_ROW)).length;

        this.grid = new Array(this.numCols * this.numRows).fill(CellValue.NOTHING);

        this.mice = [];
        this.mousetraps = [];
        this.farmer = new Farmer(this.cellSize);
        this.cheese = new Cheese(this.cellSize);

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
                        const mouse = new Mouse(this.cellSize);
                        mouse.row = row;
                        mouse.col = col;
                        this.mice.push(mouse);
                    } else if (mark === Mark.CHEESE) {
                        this.cheese.row = row;
                        this.cheese.col = col;
                    } else if (mark === Mark.MOUSETRAP) {
                        const mousetrap = new MouseTrap(this.cellSize);
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

    get width() {
        return this.cellSize * this.numCols;
    }

    get height() {
        return this.cellSize * this.numRows;
    }

    get sprites() {
        return [
            ...this.mice,
            ...this.mousetraps,
            this.cheese,
            this.farmer
        ];
    }

    get children() {
        return this.sprites;
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

    /**
     * 
     * @param {StageCoord} start
     * @param {number} direction 
     */
    isMoveAllowed(start, direction) {
        const stage = this;
        const neighbor = stage.neighbor(start, direction);

        if (stage.isBoundary(neighbor)) {
            return false;
        }
        
        if (direction === Direction.UP && stage.hasTopWall(start)) {
            return false;
        }
        
        if (direction === Direction.DOWN && stage.hasTopWall(neighbor)) {
            return false;
        }
        
        if (direction === Direction.LEFT && stage.hasLeftWall(start)) {
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
     * @param {Game} game 
     * @param {number} layer 
     */
    renderObject(game, layer) {
        const { context } = game;
        const { cellSize, width, height } = this;

        if (layer === Layer.BACKGROUND) {
            const floorColor = "#edd08c";
            const wallColor = "#bb1826";

            // Render floor
            context.fillStyle = floorColor;
            context.fillRect(0, 0, width, height);
        } else if (layer === Layer.LOW_WALL) {
            const wallColor = "#bb1826";
    
            // Prepare for rendering walls
            context.strokeStyle = wallColor;
            context.lineWidth = 3;
    
            // Render the border walls
            context.strokeRect(0, 0, width, height);
    
            // Render the interior walls
            for (let row = 0; row < this.numRows; ++row) {
                for (let col = 0; col < this.numCols; ++col) {
                    const coord = { row, col };
                    const topWall = this.hasTopWall(coord);
                    const leftWall = this.hasLeftWall(coord);
    
                    if (topWall && leftWall) {
                        context.beginPath();
                        context.moveTo((col + 0) * cellSize, (row + 1) * cellSize);
                        context.lineTo((col + 0) * cellSize, (row + 0) * cellSize);
                        context.lineTo((col + 1) * cellSize, (row + 0) * cellSize);
                        context.stroke();
                    } else if (topWall) {
                        context.beginPath();
                        context.moveTo((col + 0) * cellSize, (row + 0) * cellSize);
                        context.lineTo((col + 1) * cellSize, (row + 0) * cellSize);
                        context.stroke();
                    } else if (leftWall) {
                        context.beginPath();
                        context.moveTo((col + 0) * cellSize, (row + 1) * cellSize);
                        context.lineTo((col + 0) * cellSize, (row + 0) * cellSize);
                        context.stroke();
                    }
                }
            }
        }
    }
}
