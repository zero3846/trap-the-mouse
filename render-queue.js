/**
 * @typedef {(context: CanvasRenderingContext2D) => void} RenderCallback
 */

export const RenderLayer = {
    BACKGROUND: 0,
    WALLS: 1,
    SPRITE_LOW: 2,
    SPRITE: 3,
    SPRITE_HIGH: 4,
    FOREGROUND: 5
};

const NUM_LAYERS = 6;

export class RenderQueue {
    /**
     * @constructor
     */
    constructor() {
        /** @type {RenderCallback[][]} */
        this.layers = new Array(NUM_LAYERS);

        /** @type {number[]} */
        this.layerSizes = new Array(NUM_LAYERS).fill(0);

        /** @type {string[][]} */
        this.notes = new Array(NUM_LAYERS);

        // Use this note filter to limit what is actually rendered
        // based on the note value. Useful for debugging.
        /** @type {(string) => boolean} */
        this.noteFilter = (note) => true;

        // Make sure these each element is a different array.
        for (let i = 0; i < NUM_LAYERS; ++i) {
            this.layers[i] = [];
            this.notes[i] = [];
        }
    }

    /**
     * Pushes a render callback onto a specific layer.
     * @param {RenderCallback} callback 
     * @param {number} layer 
     * @param {string} note
     */
    pushRender(callback, layer, note) {
        const capacity = this.layers[layer].length;
        const layerSize = this.layerSizes[layer];

        if (layerSize < capacity) {
            this.layers[layer][layerSize] = callback;
            this.notes[layer][layerSize] = note;
        } else {
            this.layers[layer].push(callback);
            this.notes[layer].push(note);
        }
        this.layerSizes[layer]++;
    }

    /**
     * Calls every render callback on the given context in the order
     * of insertion per layer, and in the layer order from smallest
     * to greatest.
     * 
     * The context is saved prior rendering each layer, and is restored
     * after rendering each layer.
     * @param {CanvasRenderingContext2D} context 
     */
    renderAll(context) {
        for (let i = 0; i < NUM_LAYERS; ++i) {
            const layer = this.layers[i];
            const layerSize = this.layerSizes[i];
            const notes = this.notes[i];

            context.save();
            for (let j = 0; j < layerSize; ++j) {
                const renderCallback = layer[j];
                const note = notes[j];
                
                if (this.noteFilter(note)) {
                    renderCallback(context);
                }
            }
            context.restore();
        }
    }

    /**
     * Clears every layer of callbacks. Note that this does NOT mean
     * the context will clear its buffer. It just means all the previously
     * added callbacks won't be called.
     */
    clear() {
        // Instead of reallocating a new array, just reset the size to zero.
        // Chances are that there are going to be a similar number of callbacks as
        // before per layer. If we can reuse an array, that would be more efficient.
        this.layerSizes.fill(0);
    }

    /**
     * Outputs the notes for the given layer.
     * @param {number} layer 
     */
    logLayer(layer) {
        const layerSize = this.layerSizes[layer];
        const notes = this.notes[layer].slice(0, layerSize);
        console.log(notes);
    }

    /**
     * Logs all the notes for all the layers.
     */
    logAllLayers() {
        for (let i = 0; i < NUM_LAYERS; ++i) {
            this.logLayer(i);
        }
    }
}