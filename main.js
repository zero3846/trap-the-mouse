import { Game, renderGame, setupEventListeners, updateGame } from "./game.js";

main();

function main() {
    const canvas = document.querySelector("#main");
    const game = new Game(canvas);

    let numFrames = 0;
    let lastTime = 0
    const fpsTarget = 5;
    const renderTimeout_msecs = 1.0 / fpsTarget * 1000;
    const logFPS = false;

    function animate(currentTime) {
        const elapsedTime = currentTime - lastTime;

        if (elapsedTime > renderTimeout_msecs) {
            lastTime = currentTime;
            numFrames++;
            updateGame(game);
            renderGame(game);
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    setupEventListeners(game);

    if (logFPS) {
        setInterval(() => {
            const fps = numFrames;
            console.log(fps + " FPS");
            numFrames = 0;
        }, 1000)
    }
}