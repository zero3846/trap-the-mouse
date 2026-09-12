import { render } from "./rendering.js";
import { getStage } from "./stage-layouts.js";
import { Direction } from "./stage.js";
import { GameState, setNextFarmerMove, update } from "./states.js";

export class Game {
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.fpsTarget = 5;     // The max frames-per-second
        this.fpsActual = 0;     // The measured frames-per-second
        this.elapsedTime = 0;   // Time since last frame

        this.canvas = canvas;
        this.context = initContext(canvas);

        this.state = GameState.LOAD;

        this.stage = getStage(0);
        this.cellSize = 48;

        this.loadedImages = new Map();

        this.imageNames = [
            "mouse",
            "farmer",
            "cheese",
            "mousetrap_base",
            "mousetrap_set",
            "mousetrap_swing",
            "mousetrap_whack"
        ];

        for (const imageName of this.imageNames) {
            const image = new Image();
            image.onload = () => { this.loadedImages.set(imageName, image); };
            image.src = imageName + ".png";
        }
    }

    start() {
        const renderTimeout_msecs = 1.0 / this.fpsTarget * 1000;
        const logFPS = false;

        let numFrames = 0;
        let lastTime = 0

        const animate = (currentTime) => {
            const elapsedTime = currentTime - lastTime;

            if (elapsedTime > renderTimeout_msecs) {
                lastTime = currentTime;
                numFrames++;
                this.elapsedTime = elapsedTime;

                update(this, currentTime);
                render(this);
            }

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);

        setupEventListeners(this);

        setInterval(() => {
            this.fpsActual = numFrames;
            numFrames = 0;

            if (logFPS) {
                console.log(this.fpsActual + " FPS");
            }

            update(this);
        }, 1000);
    }
}

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @returns {CanvasRenderingContext2D}
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

function setupEventListeners(game) {
    window.addEventListener('keydown', (e) => {

        switch (e.key) {
            case 'ArrowUp':
                game.stage.nextFarmerMove = Direction.UP;
                break;

            case 'ArrowDown':
                game.stage.nextFarmerMove = Direction.DOWN;
                break;

            case 'ArrowLeft':
                game.stage.nextFarmerMove = Direction.LEFT;
                break;

            case 'ArrowRight':
                game.stage.nextFarmerMove = Direction.RIGHT;
                break;
            
            default:
                game.stage.nextFarmerMove = null;
        }
        
        update(game);

        e.preventDefault();
    });
}