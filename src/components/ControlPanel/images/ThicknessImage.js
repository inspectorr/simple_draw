export default class ThicknessImage {
    constructor(side, color, thickness) {
        this.side = side;
        this.color = color;
        this.thickness = thickness;
    }

    draw() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = this.side;
        canvas.height = this.side;

        // относительные размеры элементов
        const S = this.side / 100;
        const T = this.thickness;
        // декартова система координат
        ctx.translate(0, 100*S);
        ctx.scale(1, -1);

        ctx.save();
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.moveTo(20*S, 20*S);
        ctx.lineTo(20*S + T, 20*S);
        ctx.lineTo(80*S, 80*S);
        ctx.lineTo(80*S - T, 80*S);
        ctx.closePath();        

        ctx.fill();

        ctx.restore();

        return canvas;
    }
}
