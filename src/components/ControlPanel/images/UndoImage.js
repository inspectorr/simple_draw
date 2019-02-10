export default class ColorImage {
    constructor(side, color) {
        this.side = side;
        this.color = color;
    }

    draw() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const sqrt2 = Math.sqrt(2);

        canvas.width = this.side;
        canvas.height = this.side;

        // относительные размеры элементов
        const S = this.side / 100;
        // декартова система координат
        ctx.translate(0, 100*S);
        ctx.scale(1, -1);

        const lineWidth = 8*S;
        const R = 23*S;

        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;

        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.arc(50*S, 50*S, R, -3*Math.PI/5, 3*Math.PI/4 + 0.1);
        ctx.stroke();

        const arrowSide = lineWidth*2.5;

        let x = (sqrt2*50*S - R - sqrt2*arrowSide/2) / sqrt2;
        let y = this.side - x - arrowSide;

        ctx.translate(x, y);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(arrowSide, 0);
        ctx.lineTo(0, arrowSide);

        ctx.fill();

        return canvas;
    }
}
