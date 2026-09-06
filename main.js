class Mouse {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 1;
        this.vy = 1;
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
    const context = canvas.getContext("2d");
    const {
        width: bw,
        height: bh
    } = canvas.getBoundingClientRect();
    const {
        width: cw,
        height: ch
    } = context.canvas;
    context.scale(cw / bw, ch / bh);
    return context;
}

/**
 * 
 * @param {Game} game 
 */
function updateGame(game) {
    updateMouse(game.mouse);
}

/**
 * 
 * @param {Mouse} mouse 
 */
function updateMouse(mouse) {
    mouse.x += mouse.vx;
    mouse.y += mouse.vy;
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
    renderMouse(context, game.mouse);
    context.restore();
}

/**
 * 
 * @param {CanvasRenderingContext2D} context
 * @param {Mouse} mouse
 */
function renderMouse(context, mouse) {
    context.save();
    context.translate(mouse.x, mouse.y);

    context.beginPath();
    context.ellipse(0, 0, 10, 10, 0, 0, 2 * Math.PI);

    context.fillStyle = "gray";
    context.fill();

    context.restore();
}