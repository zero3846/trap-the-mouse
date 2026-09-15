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
    "mousetrap_whack",
];

const loadedImages = new Map();

export function imagesReady() {
    return loadedImages.size === imageNames.length;
}

export function getImageProgress() {
    return loadedImages.size / imageNames.length;
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
        this.maxIndex = 8;
        this.index = this.maxIndex;
        this.prevRow = undefined;
        this.prevCol = undefined;
    }

    /**
     * 
     * @param {number} direction 
     */
    beginMove(direction) {
        this.index = 0;
        this.prevRow = this.row;
        this.prevCol = this.col;

        // Setting the row and col at the beginning
        // of a move helps avoid colliding sprites
        // that shouldn't occupy the same cell.
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

    isAdvanceable() {
        const { index, maxIndex } = this;
        return index < maxIndex;
    }

    advanceFrame() {
        const { index, maxIndex } = this;
        this.index = Math.min(index + 1, maxIndex);
    }

    /**
     * 
     * @param {Game} game 
     * @param {number} currentTime 
     */
    updateObject(game, currentTime) {
        const {
            cellSize,
            row, col,
            prevRow, prevCol,
            index, maxIndex
        } = this;
        
        if (prevCol != null) {
            this.x = ((col - prevCol) * index / maxIndex + prevCol) * cellSize;
        } else {
            this.x = col * cellSize;
        }

        if (prevRow != null) {
            this.y = ((row - prevRow) * index / maxIndex + prevRow) * cellSize;
        } else {
            this.y = row * cellSize;
        }
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
        super("mouse", "alive", cellSize);
    }

    isAlive() {
        return this.state === "alive";
    }

    kill() {
        this.state = "dead";
    }
}

export class MouseTrap extends Sprite {
    constructor(cellSize) {
        super("mousetrap", "set", cellSize);
    }

    isSet() {
        return this.state === "set";
    }

    trigger() {
        this.state = "triggered";
        this.index = 0;
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
            if (state === "set" || this.isAdvanceable()) {
                const image = loadedImages.get("mousetrap_set");
                context.drawImage(image, 0, 0, cellSize, cellSize);
            }
        } else if (layer === Layer.HIGH_SPRITE) {
            if (state === "triggered" && !this.isAdvanceable()) {
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
        super("farmer", undefined, cellSize);
    }
}

export class Cheese extends Sprite {
    constructor(cellSize) {
        super("cheese", undefined, cellSize);
    }

    /**
     * 
     * @param {Game} game 
     * @param {number} layer
     */
    renderObject(game, layer) {
        const { context } = game;
        const { type, cellSize } = this;

        if (layer === Layer.LOW_SPRITE) {
            const image = loadedImages.get(type);
            context.drawImage(image, 0, 0, cellSize, cellSize);
        }
    }
}