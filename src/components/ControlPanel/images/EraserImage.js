export default class EraserImage {
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

        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;

        // заданная сторона и смещение ластика от края
        const width = 29*S;
        const shift = 17*S;

        const inscribedWidth = width + shift*Math.sqrt(2);
        const inscribedHeight = Math.sqrt(2*Math.pow((this.side - inscribedWidth/Math.sqrt(2)), 2));
        const height = inscribedHeight - shift*Math.sqrt(2);

        ctx.translate(shift, inscribedWidth/Math.sqrt(2));
        ctx.rotate(-Math.PI/4);

        ctx.strokeRect(0, 0, width, height);
        ctx.fillRect(0, 0, width, height/4);

        return canvas;
    }
}
