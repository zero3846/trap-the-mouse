import { Game, renderGame, updateGame } from "./game.js";

main();

function main() {
    const canvas = document.querySelector("#main");
    const game = new Game(canvas);

    function drawFrame() {
        updateGame(game);
        renderGame(game);
        requestAnimationFrame(drawFrame);
    }

    requestAnimationFrame(drawFrame);
}