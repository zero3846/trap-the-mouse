class Mouse {
    constructor() {
        this.x = 10;
        this.y = 10;
        this.vx = 0;
        this.vy = 0;
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