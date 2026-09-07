import { Game } from "./game.js";

export class Mouse {
    constructor() {
        this.row = 1;
        this.col = 1;
        this.x = 0;
        this.y = 0;
    }
}

/**
 * 
 * @param {Mouse} mouse 
 * @param {Game} game
 */
export function updateMouse(mouse, game) {
    // The cell size is necessary here, as the game may either be
    // in a transition state (mouse is moving) or ready state (mouse
    // ready to make next move).
    const { cellSize } = game;
    mouse.x = mouse.col * cellSize + cellSize / 2;
    mouse.y = mouse.row * cellSize + cellSize / 2;
}

/**
 * 
 * @param {CanvasRenderingContext2D} context
 * @param {Mouse} mouse
 * @param {Game} game
 */
export function renderMouse(context, mouse, game) {
    context.save();

    const { cellSize } = game;
    const diameter = cellSize * 0.8;
    const radius = diameter / 2;

    context.translate(mouse.x, mouse.y);

    context.beginPath();
    context.ellipse(0, 0, radius, radius, 0, 0, 2 * Math.PI);

    context.fillStyle = "gray";
    context.fill();

    context.restore();
}