import { Scene } from "./scene.js";
import { imagesReady, loadImages, MouseTrap } from "./sprite.js";
import { getStage } from "./stage-layouts.js";
import { Direction, isSameCoord } from "./stage.js";

export class Game {
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.fpsTarget = 15;    // The max frames-per-second
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

        this.framesBetweenMoves = 8;
        this.movingFrame = 0;
    }

    start() {
        const renderTimeout_msecs = 1.0 / this.fpsTarget * 1000;
        let lastTime = 0

        const animate = (currentTime) => {
            const elapsedTime = currentTime - lastTime;

            if (elapsedTime > renderTimeout_msecs) {
                lastTime = currentTime;
                this.fpsActual++;

                const {
                    scene,
                    movingFrame,
                    framesBetweenMoves
                } = this;

                if (movingFrame > 0) {
                    if (this.movingFrame === this.framesBetweenMoves) {
                        this.onFinalFrame();
                        this.movingFrame = 0;
                    } else {
                        this.movingFrame++;
                    }
                }

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
            e.preventDefault();

            if (this.movingFrame > 0) {
                return;
            }

            switch (e.key) {
                case 'ArrowUp':
                    this.moveFarmer(Direction.UP);
                    this.moveMice();
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

                case 'Control':
                    this.moveMice();
                    break;

                case 'f':
                    this.layTrap();
                    break;
            }

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
        }
    }

    onFinalFrame() {
        const { stage } = this.scene;
        const {
            sprites,
            farmer,
            mice,
            mousetraps
        } = stage;

        for (const sprite of stage.sprites) {
            sprite.finalizeMove();
        }

        for (let i = 0; i < mousetraps.length; ++i) {
            const mousetrap = mousetraps[i];

            if (isSameCoord(farmer, mousetrap)) {
                // Pick up mousetrap
                mousetraps.splice(i, 1);
                break;
            }

            let trapped = -1;
            for (let j = 0; j < mice.length; ++j) {
                const mouse = mice[j];

                if (isSameCoord(mouse, mousetrap)) {
                    trapped = j;
                    break;
                }
            }

            if (trapped >= 0) {
                const mouse = mice[trapped];
                mousetrap.trigger();
                mouse.kill();
            }
        }

    }

    startMovingFrames() {
        this.movingFrame = 1;
    }

    moveFarmer(direction) {
        const { stage } = this.scene;
        const { farmer } = stage;

        if (stage.isMoveAllowed(farmer, direction)) {
            const stepSize = farmer.cellSize / this.framesBetweenMoves;
            farmer.beginMove(direction, stepSize);
        }

        this.moveMice();
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

        const livingMice = mice.filter(mouse => mouse.isAlive());

        for (const mouse of livingMice) {
            const allowed = directions.filter(
                direction => stage.isMoveAllowed(mouse, direction)
            );

            if (allowed.length < 1) {
                continue;
            }

            const choice = Math.floor(Math.random() * (allowed.length + 1));
            const stepSize = mouse.cellSize / this.framesBetweenMoves;
            mouse.beginMove(allowed[choice], stepSize);
        }

        this.startMovingFrames();
    }

    layTrap() {
        const { stage } = this.scene;
        const { farmer, mousetraps } = stage;

        const mousetrap = new MouseTrap(stage.cellSize);
        mousetrap.row = farmer.row;
        mousetrap.col = farmer.col;
        mousetraps.push(mousetrap);
    }
}
