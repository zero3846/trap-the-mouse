import { Game } from "./game.js";

export const Layer = {
    BACKGROUND: 0,
    LOW_WALL: 1,
    LOW_SPRITE: 2,
    SPRITE: 3,
    HIGH_SPRITE: 4,
    FOREGROUND: 5
}

export class Renderable {
    constructor() {
        /** @type {number} */
        this.x = 0;

        /** @type {number} */
        this.y = 0;
    }

    /** @type {Renderable[]} children */
    get children() {
        return [];
    }

    /**
     * 
     * @param {Game} game 
     * @param {number} currentTime
     */
    update(game, currentTime) {
        this.updateObject(game, currentTime);
        this.updateChildren(game, currentTime);
    }

    /**
     * 
     * @param {Game} game 
     * @param {number} currentTime
     */
    updateObject(game, currentTime) {}

    /**
     * 
     * @param {Game} game 
     * @param {number} currentTime
     */
    updateChildren(game, currentTime) {
        for (const child of this.children) {
            child.update(game, currentTime);
        }
    }

    /**
     * 
     * @param {Game} game 
     * @param {number} layer 
     */
    render(game, layer) {
        this.renderObject(game, layer);
        this.renderChildren(game, layer);
    }

    /**
     * 
     * @param {Game} game 
     * @param {number} layer 
     */
    renderObject(game, layer) {}

    /**
     * 
     * @param {Game} game 
     * @param {number} layer 
     */
    renderChildren(game, layer) {
        const { context } = game;

        for (const child of this.children) {
            context.save();
            context.translate(child.x, child.y);
            child.render(game, layer);
            context.restore();
        }
    }
}