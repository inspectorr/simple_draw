export default class BrushImage {
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


        // кисточка
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = S * 3;
        ctx.lineJoin = 'miter';
        ctx.beginPath();
        ctx.moveTo(15*S, 20*S);
        ctx.bezierCurveTo(
            30*S, 20*S,
            70*S, 35*S,
            50*S, 50*S
        );
        ctx.bezierCurveTo(
            30*S, 65*S,
            35*S, 30*S,
            15*S, 20*S
        );
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();

        // кольцо
        ctx.save();
        ctx.translate(50*S, 50*S);
        ctx.rotate(- Math.PI / 4);

        ctx.strokeStyle = this.color;
        // ctx.fillStyle = this.color;
        ctx.lineWidth = S * 2;
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(-6*S, -1*S);
        ctx.bezierCurveTo(
            -9*S, 8*S,
            9*S, 10*S,
            6*S, -1*S
        );
        ctx.stroke();
        ctx.restore();

        // рукоять
        ctx.save();
        ctx.translate(50*S, 50*S);
        ctx.rotate(- Math.PI / 4);

        ctx.strokeStyle = this.color;
        // ctx.fillStyle = this.color;
        ctx.lineWidth = S * 2;
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(-6*S, -1*S);
        ctx.lineTo(-6*S, 35*S);
        ctx.bezierCurveTo(
            -6*S, 40*S,
            6*S, 40*S,
            6*S, 35*S
        );
        ctx.lineTo(6*S, -1*S);

        ctx.stroke();
        ctx.restore();

        return canvas;
    }
}
