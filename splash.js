import { Layer, Renderable } from "./renderable.js";
import { getImageProgress } from "./sprite.js";

export class Splash extends Renderable {
    constructor() {
        super();
        this.progress = 0;
    }

    updateObject(game, currentTime) {
        this.progress = getImageProgress();
    }

    /**
     * 
     * @param {Game} game 
     * @param {number} layer 
     */
    renderObject(game, layer) {
        const { context } = game;
        const { width, height } = context.canvas;

        const backgroundColor = "#edd08c";
        const progressBarBorder = "#657cee";
        const progressBarColor = "#bb1826";

        if (layer === Layer.BACKGROUND) {
            context.fillStyle = backgroundColor;
            context.fillRect(0, 0, width, height);
        } else if (layer === Layer.FOREGROUND) {
            const progressBarWidth = 600;
            const progressBarHeight = 80;
            const progressBarX = (width - progressBarWidth) / 2;
            const progressBarY = (height - progressBarHeight) / 2;
            const progressWidth = this.progress * progressBarWidth;

            context.save();
            context.translate(progressBarX, progressBarY);

            context.fillStyle = progressBarColor;
            context.fillRect(0, 0, progressWidth, progressBarHeight);

            context.strokeStyle = progressBarBorder;
            context.lineWidth = 3;
            context.strokeRect(0, 0, progressBarWidth, progressBarHeight);

            context.restore();
        }
    }
}