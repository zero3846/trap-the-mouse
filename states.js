import { Game } from "./game.js";
import { Direction, isMoveAllowed, moveSprite } from "./stage.js";

export const GameState = {
    LOAD: 0,
    PLAY: 1,
    WIN: 3,
    LOSE: 4
}

export function setNextFarmerMove(direction) {
    states.nextFarmerMove = direction;
    states.state = GameState.PLAY;
}

/**
 * 
 * @param {Game} game 
 * @param {number} currentTime 
 */
export function update(game, currentTime) {
    const { state } = game;

    switch (state) {
        case GameState.LOAD:
            game.state = onLoadState(game, currentTime);
            break;

        case GameState.PLAY:
            game.state = onPlayState(game, currentTime);
            break;

        case GameState.WIN:
            game.state = onWinState(game, currentTime);
            break;

        case GameState.LOSE:
            game.state = onLoseState(game, currentTime);
            break;
    }
}

/**
 * 
 * @param {Game} game 
 * @param {number} currentTime 
 * @returns {number}
 */
function onLoadState(game, currentTime) {
    const { stage, imageNames } = game;

    for (const imageName of imageNames) {
        if (!game.loadedImages.has(imageName)) {
            return GameState.LOAD;
        }
    }

    stage.lastMouseMove = currentTime;
    return GameState.PLAY;
}

/**
 * 
 * @param {Game} game 
 * @param {number} currentTime 
 * @returns {number}
 */
function onPlayState(game, currentTime) {
    const { stage } = game;
    const { nextFarmerMove, lastMouseMove } = stage;

    stage.nextFarmerMove = null;

    if (nextFarmerMove != null) {
        const { farmer } = stage;

        if (isMoveAllowed(stage, farmer, nextFarmerMove)) {
            moveSprite(stage, farmer, nextFarmerMove);
        }
    }

    const mouseMoveInterval = 1000;
    if (currentTime - lastMouseMove > mouseMoveInterval) {
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
        stage.lastMouseMove = currentTime;
    }

    return GameState.PLAY;
}

/**
 * 
 * @param {Game} game 
 * @param {number} currentTime 
 * @returns {number}
 */
function onWinState(game, currentTime) {

}

/**
 * 
 * @param {Game} game 
 * @param {number} currentTime 
 * @returns {number}
 */
function onLoseState(game, currentTime) {

}