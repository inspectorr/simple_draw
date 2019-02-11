export default class ColorImage {
    constructor(side, color) {
        this.side = side;
        this.color = color;
    }

    draw() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = this.side;
        canvas.height = this.side;

        // относительные размеры элементов
        const S = this.side / 100;
        // декартова система координат
        ctx.translate(0, 100*S);
        ctx.scale(1, -1);

        ctx.save();

        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;

        const offset = 21*S;
        const lineWidth = 7*S;
        const arrowHeight = lineWidth*2.5;

        ctx.fillRect(offset, offset, 100*S-offset*2, lineWidth);

        ctx.beginPath();
        ctx.moveTo(50*S, offset+lineWidth);
        ctx.lineTo(offset*1.5, offset+lineWidth+arrowHeight);
        ctx.lineTo(100*S-offset*1.5, offset+lineWidth+arrowHeight);
        ctx.fill();

        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(50*S, offset+lineWidth+arrowHeight-S);
        ctx.lineTo(50*S, 100*S-offset);
        ctx.stroke();

        ctx.restore();

        return canvas;
    }
}
