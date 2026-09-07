import { isMoveAllowed, moveSprite } from "./stage.js";

export class Action {
    constructor(method, args) {
        this.method = method;
        this.args = args;
    }

    execute() {
        this.method.apply(undefined, this.args);
    }
}

/**
 * 
 * @param {Game} game 
 * @param {number} direction 
 * @returns 
 */
export function getActionPlan(game, direction) {
    const { stage } = game;
    const { farmer } = stage;
    const actions = [];

    if (isMoveAllowed(stage, farmer, direction)) {
        actions.push(new Action(moveSprite, [ stage, farmer, direction ]));
    }

    return actions;
}