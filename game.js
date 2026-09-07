import { Mouse, renderMouse, updateMouse } from "./mouse.js";
import { renderStage, Stage, updateStage } from "./stage.js";

export class Game {
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
    }
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
export function updateGame(game) {
    updateStage(game.mouse, game.cellSize);
    updateMouse(game.mouse, game.cellSize);
}

/**
 * 
 * @param {Game} game 
 */
export function renderGame(game) {
    const { canvas, context } = game;
    const {
        width: bw,
        height: bh
    } = canvas.getBoundingClientRect();

    // Clear the canvas
    context.clearRect(0, 0, bw, bh);

    context.save();
    renderStage(context, game.stage, game.cellSize);
    renderMouse(context, game.mouse, game.cellSize);
    context.restore();
}