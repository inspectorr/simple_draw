import React, { Component } from 'react';

function muteColor(color) {
    color = color.slice(1);
    let r = parseInt(color.slice(0, 2), 16);
    let g = parseInt(color.slice(2, 4), 16);
    let b = parseInt(color.slice(4, 6), 16);
    return `rgb(${r*0.8}, ${g*0.8}, ${b*0.8})`;
}

export default class Icon extends Component {
    draw() {
        const ctx = this.refs.canvas.getContext('2d');
        const side = this.props.side;

        // бэкграунд иконки
        const bgColor = this.props.pressed ? muteColor(this.props.bgColor) : this.props.bgColor;
        ctx.fillStyle = bgColor;
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
