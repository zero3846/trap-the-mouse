import { Game } from "./game.js";
import { GameState } from "./states.js";

/**
 * 
 * @param {Game} game 
 */
export function render(game) {
    const {
        canvas,
        context,
        stage,
        cellSize
    } = game;

    const sw = cellSize * stage.numCols;
    const sh = cellSize * stage.numRows;

    const {
        width: bw,
        height: bh
    } = canvas.getBoundingClientRect();

    // Clear the canvas
    context.clearRect(0, 0, bw, bh);

    context.save();

    // Center the stage
    context.translate(
        (bw - sw) / 2,
        (bh - sh) / 2
    );

    renderBackgroundLayer(game);
    renderLowWallLayer(game);
    renderLowSpriteLayer(game);
    renderSpriteLayer(game);
    renderHighSpriteLayer(game);
    renderForegroundLayer(game);

    context.restore();
}

/**
 * 
 * @param {Game} game 
 */
function renderBackgroundLayer(game) {
    if (game.state === GameState.PLAY) {
        const { context, cellSize, stage } = game;
        const floorColor = "#edd08c";
        const wallColor = "#bb1826";

        // Render floor
        context.fillStyle = floorColor;
        context.fillRect(0, 0, cellSize * stage.numCols, cellSize * stage.numRows);
    }
}

/**
 * 
 * @param {Game} game 
 */
function renderLowWallLayer(game) {
    if (game.state === GameState.PLAY) {
        const { context, cellSize, stage } = game;
        const wallColor = "#bb1826";

        // Prepare for rendering walls
        context.strokeStyle = wallColor;
        context.lineWidth = 3;

        // Render the border walls
        context.strokeRect(0, 0, cellSize * stage.numCols, cellSize * stage.numRows);

        // Render the interior walls
        for (let row = 0; row < stage.numRows; ++row) {
            for (let col = 0; col < stage.numCols; ++col) {
                const coord = { row, col };
                const topWall = stage.hasTopWall(coord);
                const leftWall = stage.hasLeftWall(coord);

                if (topWall && leftWall) {
                    context.beginPath();
                    context.moveTo((col + 0) * cellSize, (row + 1) * cellSize);
                    context.lineTo((col + 0) * cellSize, (row + 0) * cellSize);
                    context.lineTo((col + 1) * cellSize, (row + 0) * cellSize);
                    context.stroke();
                } else if (topWall) {
                    context.beginPath();
                    context.moveTo((col + 0) * cellSize, (row + 0) * cellSize);
                    context.lineTo((col + 1) * cellSize, (row + 0) * cellSize);
                    context.stroke();
                } else if (leftWall) {
                    context.beginPath();
                    context.moveTo((col + 0) * cellSize, (row + 1) * cellSize);
                    context.lineTo((col + 0) * cellSize, (row + 0) * cellSize);
                    context.stroke();
                }
            }
        }
    }
}

/**
 * 
 * @param {Game} game 
 * @param {Sprite} sprite 
 * @param {Image[]} images
 */
function renderSprite(game, sprite, images) {
    const { context, cellSize } = game;
    const x = sprite.col * cellSize;
    const y = sprite.row * cellSize;

    for (const image of images) {
        context.drawImage(image, x, y, cellSize, cellSize);
    }
}

/**
 * 
 * @param {Game} game 
 */
function renderLowSpriteLayer(game) {
    if (game.state === GameState.PLAY) {
        const { context, cellSize, stage } = game;
        const { mousetraps } = stage;

        const mousetrap_images = [
            game.loadedImages.get("mousetrap_base")
        ];

        for (const mousetrap of mousetraps) {
            renderSprite(game, mousetrap, mousetrap_images);
        }
    }
}

/**
 * 
 * @param {Game} game 
 */
function renderSpriteLayer(game) {
    if (game.state === GameState.PLAY) {
        const { context, cellSize, stage } = game;
        const { mice, farmer, cheese } = stage;

        const mouse_images = [
            game.loadedImages.get("mouse")
        ];
        const cheese_images = [
            game.loadedImages.get("cheese")
        ];
        const farmer_images = [
            game.loadedImages.get("farmer")
        ];

        for (const mouse of mice) {
            renderSprite(game, mouse, mouse_images);
        }

        renderSprite(game, cheese, cheese_images);
        renderSprite(game, farmer, farmer_images);
    }
}

/**
 * 
 * @param {Game} game 
 */
function renderHighSpriteLayer(game) {
    if (game.state === GameState.PLAY) {
        const { context, cellSize, stage } = game;
        const { mousetraps } = stage;

        const mousetrap_set_images = [
            game.loadedImages.get("mousetrap_set")
        ];

        const mousetrap_triggered_images = [
            game.loadedImages.get("mousetrap_whack"),
            game.loadedImages.get("mousetrap_swing")
        ];

        for (const mousetrap of mousetraps) {
            if (mousetrap.state === "set") {
                renderSprite(game, mousetrap, mousetrap_set_images);
            } else if (mousetrap.state === "triggered") {
                renderSprite(game, mousetrap, mousetrap_triggered_images);
            }
        }
    }
}

/**
 * 
 * @param {Game} game 
 */
function renderForegroundLayer(game) {

}

