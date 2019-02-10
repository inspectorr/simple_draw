import React, { Component } from 'react';

// почитай сука про импорт нормальный а то это не смещно даже
import { muteColor } from 'C:/Users/User/Desktop/dev/simple_draw/src/colorFunctions.js';

export default class Button extends Component {
    draw() {
        const side = this.props.side;
        const color = this.props.color;
        const thickness = this.props.thickness;
        const bgColor = this.props.pressed ? muteColor(this.props.bgColor) : this.props.bgColor;

        const Image = this.props.image;
        const image = new Image(side, color, thickness).draw();

        const icon = this.refs.icon;
        const ctx = icon.getContext('2d');
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, side, side);
        ctx.drawImage(image, 0, 0);
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
            <button
                onClick={() => this.props.onClick()}
                style={{width:`${side}px`, height:`${side}px`}}
            >
                <canvas ref='icon' width={side} height={side}></canvas>
            </button>
        );
    }
}
