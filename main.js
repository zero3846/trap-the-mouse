import { Game } from "./game.js";

const canvas = document.querySelector("#main");
const game = new Game(canvas);

game.start();
