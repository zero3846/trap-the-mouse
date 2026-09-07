import { Stage } from "./stage.js";

const layouts = [
    new Stage([
        "                          ",
        "                          ",
        "    M                     ",
        "                          ",
        "                          ",
        "                          ",
        "          M               ",
        "                          ",
        "                          ",
        "     ##############       ",
        "                          ",
        "                          ",
        "                          ",
        "                     F    ",
        "                          ",
        "                          ",
        "                          ",
    ]),
];

export function getStage(stageNum) {
    return layouts[stageNum];
}