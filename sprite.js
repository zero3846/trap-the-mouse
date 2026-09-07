import { Direction } from "./directions.js";
import { Game } from "./game.js";

const spriteColors = new Map();
spriteColors.set("mouse", "gray");
spriteColors.set("farmer", "blue");

export class Sprite {
    constructor(type) {
        this.type = type;
        this.row = 0;
        this.col = 0;
        this.x = 0;
        this.y = 0;
    }
}

/**
 * 
 * @param {Sprite} sprite 
 * @param {Game} game
 */
export function updateSprite(sprite, game) {
    // The cell size is necessary here, as the game may either be
    // in a transition state (mouse is moving) or ready state (mouse
    // ready to make next move).
    const { cellSize } = game;
    sprite.x = sprite.col * cellSize + cellSize / 2;
    sprite.y = sprite.row * cellSize + cellSize / 2;
}

/**
 * 
 * @param {CanvasRenderingContext2D} context
 * @param {Sprite} sprite
 * @param {Game} game
 */
export function renderSprite(context, sprite, game) {
    context.save();

    const { cellSize } = game;
    const diameter = cellSize * 0.8;
    const radius = diameter / 2;

    context.translate(sprite.x, sprite.y);

    context.beginPath();
    context.ellipse(0, 0, radius, radius, 0, 0, 2 * Math.PI);

    context.fillStyle = spriteColors.get(sprite.type);
    context.fill();

    context.restore();
}