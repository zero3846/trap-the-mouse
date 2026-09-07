import { getActionPlan } from "./actions.js";
import { getStage } from "./stage-layouts.js";
import { Direction, renderStage, updateStage } from "./stage.js";

export class Game {
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.context = initContext(canvas);

        this.stage = getStage(0);
        this.cellSize = 48;
        this.stagePixelWidth = this.cellSize * this.stage.width;
        this.stagePixelHeight = this.cellSize * this.stage.height;

        this.imagesLoaded = new Set();
        this.mouseImage = new Image();
        this.mouseImage.onload = () => { this.imagesLoaded.add("mouse"); };
        this.mouseImage.src = "mouse.png";

        this.farmerImage = new Image();
        this.farmerImage.onload = () => { this.imagesLoaded.add("farmer"); };
        this.farmerImage.src = "farmer.png";
    }
}

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 */
function initContext(canvas) {
    const context = canvas.getContext("2d", {
        alpha: false
    });
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    context.scale(dpr, dpr);
    return context;
}

export function setupEventListeners(game) {
    window.addEventListener('keydown', (e) => {
        let direction;

        switch (e.key) {
            case 'ArrowUp':
                direction = Direction.UP;
                break;

            case 'ArrowDown':
                direction = Direction.DOWN;
                break;

            case 'ArrowLeft':
                direction = Direction.LEFT;
                break;

            case 'ArrowRight':
                direction = Direction.RIGHT;
                break;
        }

        const actions = getActionPlan(game, direction);
        for (const action of actions) {
            action.execute();
        }

        e.preventDefault();
    });
}

/**
 * 
 * @param {Game} game 
 */
export function updateGame(game) {
    updateStage(game.stage, game);
}

/**
 * 
 * @param {Game} game 
 */
export function renderGame(game) {
    const {
        canvas,
        context,
        stagePixelWidth: sw,
        stagePixelHeight: sh
    } = game;
    const {
        width: bw,
        height: bh
    } = canvas.getBoundingClientRect();

    // Clear the canvas
    context.clearRect(0, 0, bw, bh);

    context.save();
    context.translate(
        (bw - sw) / 2,
        (bh - sh) / 2
    );

    renderStage(context, game.stage, game);

    context.restore();
}