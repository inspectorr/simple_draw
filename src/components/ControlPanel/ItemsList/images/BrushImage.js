export default class BrushImage {
    draw(side, color) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, 15, 15);
        return canvas;
    }
}
