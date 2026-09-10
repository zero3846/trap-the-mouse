import { Game } from "./game.js";
import { RenderLayer } from "./render-queue.js";

export class Sprite {
    constructor(type) {
        this.type = type;
        this.state = type === "mousetrap" ? "triggered" : undefined;
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

    if (sprite.type === "mousetrap") {
        game.renderQueue.pushRender(
            (context) => renderSprite(
                context,
                game.loadedImages.get("mousetrap_base"),
                cellSize,
                sprite.x,
                sprite.y
            ),
            RenderLayer.SPRITE_LOW,
            `mousetrap_base (${sprite.x}, ${sprite.y})`
        );

        if (sprite.state === "set") {
            game.renderQueue.pushRender(
                (context) => renderSprite(
                    context,
                    game.loadedImages.get("mousetrap_set"),
                    cellSize,
                    sprite.x,
                    sprite.y
                ),
                RenderLayer.SPRITE_HIGH,
                `mousetrap_set (${sprite.x}, ${sprite.y})`
            );
        } else if (sprite.state === "triggered") {
            game.renderQueue.pushRender(
                (context) => renderSprite(
                    context,
                    game.loadedImages.get("mousetrap_whack"),
                    cellSize,
                    sprite.x,
                    sprite.y
                ),
                RenderLayer.SPRITE_HIGH,
                `mousetrap_whack (${sprite.x}, ${sprite.y})`
            );
            
            game.renderQueue.pushRender(
                (context) => renderSprite(
                    context,
                    game.loadedImages.get("mousetrap_swing"),
                    cellSize,
                    sprite.x,
                    sprite.y
                ),
                RenderLayer.SPRITE_HIGH,
                `mousetrap_swing (${sprite.x}, ${sprite.y})`
            );
        }
    } else {
        game.renderQueue.pushRender(
            (context) => renderSprite(
                context,
                game.loadedImages.get(sprite.type),
                cellSize,
                sprite.x,
                sprite.y
            ),
            RenderLayer.SPRITE,
            `${sprite.type} (${sprite.x}, ${sprite.y})`
        );
    }
}

/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {Image} image 
 * @param {number} cellSize 
 * @param {number} x 
 * @param {number} y 
 */
function renderSprite(context, image, cellSize, x, y) {
    if (image != null) {
        context.drawImage(image, x, y, cellSize, cellSize);
    }
}
