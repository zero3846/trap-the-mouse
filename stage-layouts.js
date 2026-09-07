import { Stage } from "./stage.js";

const layouts = [
    new Stage([
        "##########################",
        "#                        #",
        "#                        #",
        "#                        #",
        "#                        #",
        "#                        #",
        "#                        #",
        "#                        #",
        "#                        #",
        "#                        #",
        "#                        #",
        "#                        #",
        "#                        #",
        "#                        #",
        "#                        #",
        "#                        #",
        "##########################",
    ]),
];

export function getStage(stageNum) {
    return layouts[stageNum];
}