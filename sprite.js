import { Game } from "./game.js";

const spriteColors = new Map();
spriteColors.set("mouse", "gray");
spriteColors.set("farmer", "blue");
spriteColors.set("cheese", "yellow");
spriteColors.set("mousetrap", "red");

export class Sprite {
    constructor(type) {
        this.type = type;
        this.state = type === "mousetrap" ? "set" : undefined;
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

    do {
        if (sprite.type === "mousetrap") {
            let image = game.loadedImages.get("mousetrap_base");
            if (image == null) {
                break;
            }
            context.drawImage(image, 0, 0, cellSize, cellSize);

            if (sprite.state === "set") {
                image = game.loadedImages.get("mousetrap_set");
                if (image == null) {
                    break;
                }
                context.drawImage(image, 0, 0, cellSize, cellSize);
            } else if (sprite.state === "triggered") {
                image = game.loadedImages.get("mousetrap_whack");
                if (image == null) {
                    break;
                }
                context.drawImage(image, 0, 0, cellSize, cellSize);

                image = game.loadedImages.get("mousetrap_swing");
                if (image == null) {
                    break;
                }
                context.drawImage(image, 0, 0, cellSize, cellSize);
            }
        } else if (game.loadedImages.has(sprite.type)) {
            const image = game.loadedImages.get(sprite.type);
            context.drawImage(image, 0, 0, cellSize, cellSize);
        }
    } while (false);

    context.restore();
}