import { Game } from "./game.js";
import { Layer, Renderable } from "./renderable.js";
import { Direction } from "./stage.js";

const imageNames = [
    "mouse",
    "farmer",
    "cheese",
    "mousetrap_base",
    "mousetrap_set",
    "mousetrap_swing",
    "mousetrap_whack"
];

const loadedImages = new Map();

export function imagesReady() {
    return loadedImages.size === imageNames.length;
}

/**
 * 
 * @param {Game} game 
 */
export function loadImages(game) {
    for (const imageName of imageNames) {
        const image = new Image();
        image.onload = () => {
            loadedImages.set(imageName, image);
            game.onImageLoad();
        };
        image.src = imageName + ".png";
    }
}

export class Sprite extends Renderable {
    constructor(type, state, cellSize) {
        super();

        this.type = type;
        this.state = state;
        this.row = 0;
        this.col = 0;
        this.cellSize = cellSize;
    }

    /**
     * 
     * @param {number} direction 
     */
    move(direction) {
        switch (direction) {
            case Direction.UP:
                this.row -= 1;
                break;
            case Direction.DOWN:
                this.row += 1;
                break;
            case Direction.LEFT:
                this.col -= 1;
                break;
            case Direction.RIGHT:
                this.col += 1;
                break;
        }
    }

    /**
     * 
     * @param {Game} game 
     * @param {number} currentTime 
     */
    update(game, currentTime) {
        const { cellSize, row, col } = this;
        this.x = col * cellSize;
        this.y = row * cellSize;
    }

    /**
     * 
     * @param {Game} game 
     * @param {number} layer
     */
    renderObject(game, layer) {
        const { context } = game;
        const { type, cellSize } = this;

        if (layer === Layer.SPRITE) {
            const image = loadedImages.get(type);
            context.drawImage(image, 0, 0, cellSize, cellSize);
        }
    }
}

export class Mouse extends Sprite {
    constructor(cellSize) {
        super("mouse", "left", cellSize);
    }
}

export class MouseTrap extends Sprite {
    constructor(cellSize) {
        super("mousetrap", "triggered", cellSize);
    }

    /**
     * 
     * @param {Game} game 
     * @param {number} layer
     */
    renderObject(game, layer) {
        const { context } = game;
        const { state, cellSize } = this;

        if (layer === Layer.LOW_SPRITE) {
            const image = loadedImages.get("mousetrap_base");
            context.drawImage(image, 0, 0, cellSize, cellSize);
        } else if (layer === Layer.HIGH_SPRITE) {
            if (state === "set") {
                const image = loadedImages.get("mousetrap_base");
                context.drawImage(image, 0, 0, cellSize, cellSize);
            } else if (state === "triggered") {
                const images = [
                    loadedImages.get("mousetrap_whack"),
                    loadedImages.get("mousetrap_swing"),
                ];
                for (const image of images) {
                    context.drawImage(image, 0, 0, cellSize, cellSize);
                }
            }
        }
    }
}

export class Farmer extends Sprite {
    constructor(cellSize) {
        super("farmer", "left", cellSize);
    }
}

export class Cheese extends Sprite {
    constructor(cellSize) {
        super("cheese", undefined, cellSize);
    }
}