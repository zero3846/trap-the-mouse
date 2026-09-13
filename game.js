import { Scene } from "./scene.js";
import { imagesReady, loadImages } from "./sprite.js";
import { getStage } from "./stage-layouts.js";
import { Direction, isMoveAllowed, moveSprite } from "./stage.js";

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

        this.scene = new Scene();
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

                const { scene } = this;

                scene.update(this, currentTime);
                scene.renderLayers(this);
            }

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
        setupEventListeners(this);
        loadImages(this);

        setInterval(() => {
            this.fpsActual = numFrames;
            numFrames = 0;

            if (logFPS) {
                console.log(this.fpsActual + " FPS");
            }
        }, 1000);
    }

    onImageLoad() {
        if (imagesReady()) {
            this.scene.stage = getStage(0);

            setInterval(() => {
                this.moveMice();
            }, 1000);
        }
    }

    moveFarmer(direction) {
        if (direction == null) {
            return;
        }

        const { stage } = this.scene;
        const { farmer } = stage;

        if (isMoveAllowed(stage, farmer, direction)) {
            moveSprite(stage, farmer, direction);
        }
    }

    moveMice() {
        const { stage } = this.scene;
        const { mice } = stage;
        const directions = [
            Direction.UP,
            Direction.DOWN,
            Direction.LEFT,
            Direction.RIGHT
        ];

        for (const mouse of mice) {
            const allowed = directions.filter(
                direction => isMoveAllowed(stage, mouse, direction)
            );

            if (allowed.length < 1) {
                continue;
            }

            const choice = Math.floor(Math.random() * (allowed.length + 1));
            moveSprite(stage, mouse, allowed[choice]);
        }
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
                game.moveFarmer(Direction.UP);
                break;

            case 'ArrowDown':
                game.moveFarmer(Direction.DOWN);
                break;

            case 'ArrowLeft':
                game.moveFarmer(Direction.LEFT);
                break;

            case 'ArrowRight':
                game.moveFarmer(Direction.RIGHT);
                break;
        }

        e.preventDefault();
    });
}
