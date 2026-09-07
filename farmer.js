import { Game } from "./game.js";

export class Farmer {
    constructor() {
        this.row = 0;
        this.col = 0;
        this.x = 0;
        this.y = 0;
        this.color = "blue";
    }
}

/**
 * 
 * @param {Farmer} farmer 
 * @param {Game} game
 */
export function updateFarmer(farmer, game) {
    // The cell size is necessary here, as the game may either be
    // in a transition state (mouse is moving) or ready state (mouse
    // ready to make next move).
    const { cellSize } = game;
    farmer.x = farmer.col * cellSize + cellSize / 2;
    farmer.y = farmer.row * cellSize + cellSize / 2;
}

/**
 * 
 * @param {CanvasRenderingContext2D} context
 * @param {Farmer} farmer
 * @param {Game} game
 */
export function renderFarmer(context, farmer, game) {
    context.save();

    const { cellSize } = game;
    const diameter = cellSize * 0.8;
    const radius = diameter / 2;

    context.translate(farmer.x, farmer.y);

    context.beginPath();
    context.ellipse(0, 0, radius, radius, 0, 0, 2 * Math.PI);

    context.fillStyle = farmer.color;
    context.fill();

    context.restore();
}