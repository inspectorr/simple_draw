import React, { PureComponent } from 'react';

export default class Icon extends PureComponent {
    draw() {
        const ctx = this.refs.canvas.getContext('2d');
        const side = this.props.side;

        // бэкграунд иконки
        ctx.fillStyle = this.props.color;
        ctx.fillRect(0, 0, side, side);
        
        // изображение на иконке
        ctx.drawImage(this.props.image, 0, 0);
    }

    componentDidMount() {
        this.draw();
    }

    componentDidUpdate() {
        this.draw();
    }

    render() {
        const side = this.props.side;
        return (
            <canvas
                ref={'canvas'}
                width={side}
                height={side}
            >
            </canvas>
        );
    }
}
