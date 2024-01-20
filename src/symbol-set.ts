export default class SymbolSet {
    display: string;
    file: string;
    stroke: boolean;
    fill: boolean;

    constructor(display: string, file: string, stroke: boolean, fill: boolean) {
        this.display = display
        this.file = file
        this.stroke = stroke
        this.fill = fill
    }
}
