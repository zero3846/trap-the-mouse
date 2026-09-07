const FLOOR = 0;
const WALL = 1;

class Stage {
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

class Mouse {
    constructor() {
        this.row = 0;
        this.col = 0;
        this.x = 0;
        this.y = 0;
    }
}

class Game {
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.context = initContext(canvas);

        this.mouse = new Mouse();
        this.stage = new Stage(48);
        this.cellSize = Math.floor(canvas.width / this.stage.width);

        canvas.width = this.cellSize * this.stage.width;
        canvas.height = this.cellSize * this.stage.height;

        this.mouse.row = 1;
        this.mouse.col = 1;

        for (let i = 0; i < this.stage.height; ++i) {
            for (let j = 0; j < this.stage.width; ++j) {
                if (i == 0 || i == this.stage.height - 1
                    || j == 0 || j == this.stage.width - 1
                ) {
                    this.stage.setCell(i, j, WALL);
                }
            }
        }
    }
}

main();

function main() {
    const canvas = document.querySelector("#main");
    const game = new Game(canvas);

    function drawFrame() {
        renderGame(game);
        requestAnimationFrame(drawFrame);
    }

    requestAnimationFrame(drawFrame);
}

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 */
function initContext(canvas) {
    const context = canvas.getContext("2d", {
        alpha: false
    });
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    context.scale(dpr, dpr);
    return context;
}

/**
 * 
 * @param {Game} game 
 */
function updateGame(game) {
    updateMouse(game.mouse, game.cellSize);
}

/**
 * 
 * @param {Mouse} mouse 
 * @param {number} cellSize
 */
function updateMouse(mouse, cellSize) {
    // The cell size is necessary here, as the game may either be
    // in a transition state (mouse is moving) or ready state (mouse
    // ready to make next move).
    mouse.x = mouse.col * cellSize + cellSize / 2;
    mouse.y = mouse.row * cellSize + cellSize / 2;
}

/**
 * 
 * @param {Game} game 
 */
function renderGame(game) {
    const { canvas, context } = game;
    const {
        width: bw,
        height: bh
    } = canvas.getBoundingClientRect();

    updateGame(game);

    // Clear the canvas
    context.clearRect(0, 0, bw, bh);

    context.save();
    renderStage(context, game.stage, game.cellSize);
    renderMouse(context, game.mouse, game.cellSize);
    context.restore();
}

/**
 * 
 * @param {CanvasRenderingContext2D} context
 * @param {Mouse} mouse
 * @param {number} cellSize
 */
function renderMouse(context, mouse, cellSize) {
    context.save();

    const diameter = cellSize * 0.8;
    const radius = diameter / 2;

    context.translate(mouse.x, mouse.y);

    context.beginPath();
    context.ellipse(0, 0, radius, radius, 0, 0, 2 * Math.PI);

    context.fillStyle = "gray";
    context.fill();

    context.restore();
}

/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {Stage} stage 
 * @param {number} cellSize 
 */
function renderStage(context, stage, cellSize) {
    context.save();

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