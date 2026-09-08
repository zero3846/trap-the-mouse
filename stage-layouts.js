import { Stage } from "./stage.js";

const layouts = [
    new Stage([
        "#######V#######",
        "# M   M|M      ",
        ">     -+---    ",
        "#     M|M   F  ",
        "#              ",
        ">  ---         ",
        "#   M       T  ",
        ">  ---         ",
        "#             C",
    ]),
];

export function getStage(stageNum) {
    return layouts[stageNum];
}