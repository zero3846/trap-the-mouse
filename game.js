import { Scene } from "./scene.js";
import { imagesReady, loadImages } from "./sprite.js";
import { getStage } from "./stage-layouts.js";
import { Direction } from "./stage.js";

export class Game {
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.fpsTarget = 5;     // The max frames-per-second
        this.fpsActual = 0;     // The measured frames-per-second
        this.logFPS = false;    // Set to true to log frames-per-second

        this.scene = new Scene();

        this.canvas = canvas;
        this.context = canvas.getContext("2d", {
            alpha: false
        });

        // Adjust for high-density displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        this.context.scale(dpr, dpr);
    }

    start() {
        const renderTimeout_msecs = 1.0 / this.fpsTarget * 1000;
        let lastTime = 0

        const animate = (currentTime) => {
            const elapsedTime = currentTime - lastTime;

            if (elapsedTime > renderTimeout_msecs) {
                lastTime = currentTime;
                this.fpsActual++;

                const { scene } = this;

                scene.update(this, currentTime);
                scene.renderLayers(this);
            }

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {

            switch (e.key) {
                case 'ArrowUp':
                    this.moveFarmer(Direction.UP);
                    break;

                case 'ArrowDown':
                    this.moveFarmer(Direction.DOWN);
                    break;

                case 'ArrowLeft':
                    this.moveFarmer(Direction.LEFT);
                    break;

                case 'ArrowRight':
                    this.moveFarmer(Direction.RIGHT);
                    break;
            }

            e.preventDefault();
        });
        
        loadImages(this);

        if (this.logFPS) {
            setInterval(() => this.trackFPS(), 1000);
        }
    }

    trackFPS() {
        console.log(this.fpsActual + " FPS");
        this.fpsActual = 0;
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

        if (stage.isMoveAllowed(farmer, direction)) {
            farmer.move(direction);
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
                direction => stage.isMoveAllowed(mouse, direction)
            );

            if (allowed.length < 1) {
                continue;
            }

            const choice = Math.floor(Math.random() * (allowed.length + 1));
            mouse.move(allowed[choice]);
        }
    }
}
