import { Banner } from "./banner.js";
import { Layer, Renderable } from "./renderable.js";
import { Splash } from "./splash.js";
import { getStage } from "./stage-layouts.js";

export class Scene extends Renderable {
    constructor() {
        super();
        this.splash = new Splash();
        this.stage = undefined;
        this.banner = new Banner();
    }

    get children() {
        if (this.stage != null) {
            return [ this.stage, this.banner ];
        }
        return [ this.splash ];
    }

    loadStage(stageNum) {
        this.stage = getStage(stageNum);
    }

    /**
     * 
     * @param {Game} game 
     * @param {number} currentTime 
     */
    updateObject(game, currentTime) {
        const { stage } = this;

        if (stage != null) {
            const {
                canvas,
                context
            } = game;

            const {
                width: bw,
                height: bh
            } = canvas.getBoundingClientRect();

            const {
                width: sw,
                height: sh
            } = stage;

            stage.x = (bw - sw) / 2;
            stage.y = (bh - sh) / 2;
        }
    }

    /**
     * 
     * @param {Game} game 
     * @param {number} layer 
     */
    renderObject(game, layer) {
        const {
            canvas,
            context
        } = game;

        const {
            width: bw,
            height: bh
        } = canvas.getBoundingClientRect();

        if (layer === Layer.BACKGROUND) {
            // Clear the canvas
            context.clearRect(0, 0, bw, bh);
        }
    }

    /**
     * 
     * @param {Game} game 
     */
    renderLayers(game) {
        this.render(game, Layer.BACKGROUND);
        this.render(game, Layer.LOW_WALL);
        this.render(game, Layer.LOW_SPRITE);
        this.render(game, Layer.SPRITE);
        this.render(game, Layer.HIGH_SPRITE);
        this.render(game, Layer.FOREGROUND);
    }
}