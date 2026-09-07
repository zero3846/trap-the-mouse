import { isDirectionAllowed, moveSprite } from "./stage.js";

export class Action {
    constructor(method, args) {
        this.method = method;
        this.args = args;
    }

    execute() {
        this.method.apply(undefined, this.args);
    }
}

export function getActionPlan(game, direction) {
    const { stage, farmer } = game;
    const actions = [];

    if (isDirectionAllowed(stage, farmer.row, farmer.col, direction, game)) {
        actions.push(new Action(moveSprite, [ stage, farmer, direction ]));
    }

    return actions;
}