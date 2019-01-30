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
        ctx.beginPath();
        ctx.arc(50*S, 50*S, 30*S, 0, Math.PI*2);
        ctx.fill();

        ctx.restore();

        return canvas;
    }
}
