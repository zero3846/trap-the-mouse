import { Scene } from "./scene.js";
import { imagesReady, loadImages, MouseTrap } from "./sprite.js";
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

        this.inputBuffer = [];
        this.inputLimit = 1;
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

                this.onAnimationFrame();
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

            switch (e.key) {
                case 'ArrowUp':
                    this.onDirectionInput(Direction.UP);
                    break;

                case 'ArrowDown':
                    this.onDirectionInput(Direction.DOWN);
                    break;

                case 'ArrowLeft':
                    this.onDirectionInput(Direction.LEFT);
                    break;

                case 'ArrowRight':
                    this.onDirectionInput(Direction.RIGHT);
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
            this.scene.loadStage(0);

            setInterval(() => this.moveMice(), 1000);
        }
    }

    onAnimationFrame() {
        const { stage } = this.scene;
        if (stage == null) {
            return;
        }

        const { sprites } = stage;
        for (const sprite of sprites) {
            if (sprite.isAdvanceable()) {
                sprite.advanceFrame();
            }
        }

        const { inputBuffer } = this;
        const { farmer } = stage;
        if (!farmer.isAdvanceable() && inputBuffer.length > 0) {
            const direction = inputBuffer.pop();
            this.moveFarmer(direction);
        }
    }

    onDirectionInput(direction) {
        const { stage } = this.scene;
        if (stage == null) {
            return;
        }

        const { inputBuffer, inputLimit } = this;
        const { farmer, mousetraps } = stage;
        if (farmer.isAdvanceable() || inputBuffer.length > 0) {
            // Limit the queued inputs or it starts to feel very laggy.
            if (inputBuffer.length < inputLimit) {
                inputBuffer.push(direction);
            }
            return;
        }

        this.moveFarmer(direction);
    }

    moveFarmer(direction) {
        const { stage } = this.scene;
        const { farmer, mousetraps } = stage;

        if (stage.isMoveAllowed(farmer, direction)) {
            farmer.beginMove(direction);

            for (let i = 0; i < mousetraps.length; ++i) {
                const mousetrap = mousetraps[i];

                if (isSameCoord(farmer, mousetrap)) {
                    // Pick up mousetrap
                    mousetraps.splice(i, 1);
                    break;
                }
            }
        }
    }

    moveMice() {
        const { stage } = this.scene;
        const { farmer, mice, mousetraps } = stage;

        const directions = [
            Direction.UP,
            Direction.DOWN,
            Direction.LEFT,
            Direction.RIGHT
        ];

        const liveTraps = mousetraps.filter(trap => trap.isSet());
        const livingMice = mice.filter(mouse => mouse.isAlive() && !mouse.isAdvanceable());

        for (const mouse of livingMice) {
            const allowed = directions.filter(
                direction => stage.isMoveAllowed(mouse, direction)
            );

            if (allowed.length < 1) {
                continue;
            }

            const choice = Math.floor(Math.random() * (allowed.length + 1));
            mouse.beginMove(allowed[choice]);

            for (const mousetrap of liveTraps) {
                if (isSameCoord(mouse, mousetrap)) {
                    mousetrap.trigger();
                    mouse.kill();
                    break;
                }
            }
        }
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
