export class Sprite {
    constructor(type) {
        this.type = type;
        this.state = type === "mousetrap" ? "triggered" : undefined;
        this.row = 0;
        this.col = 0;
    }
}
