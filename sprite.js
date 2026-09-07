import { Game } from "./game.js";

const spriteColors = new Map();
spriteColors.set("mouse", "gray");
spriteColors.set("farmer", "blue");
spriteColors.set("cheese", "yellow");

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
    sprite.x = sprite.col * cellSize;
    sprite.y = sprite.row * cellSize;
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
    const diameter = cellSize * 0.9;
    const radius = diameter / 2;

    context.translate(sprite.x, sprite.y);

    if (sprite.type === "mouse" && game.imagesLoaded.has("mouse")) {
        context.drawImage(game.mouseImage, 0, 0, cellSize, cellSize);
    } else if (sprite.type === "farmer" && game.imagesLoaded.has("farmer")) {
        context.drawImage(game.farmerImage, 0, 0, cellSize, cellSize);
    } else if (sprite.type === "cheese" && game.imagesLoaded.has("cheese")) {
        context.drawImage(game.cheeseImage, 0, 0, cellSize, cellSize);
    } else {
        context.translate(cellSize / 2, cellSize / 2);

        context.beginPath();
        context.ellipse(0, 0, radius, radius, 0, 0, 2 * Math.PI);

        context.fillStyle = spriteColors.get(sprite.type);
        context.fill();
    }

    context.restore();
}