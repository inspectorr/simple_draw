import React, { Component } from 'react';

function muteColor(color, level) {
    color = color.slice(1);
    let r = parseInt(color.slice(0, 2), 16);
    let g = parseInt(color.slice(2, 4), 16);
    let b = parseInt(color.slice(4, 6), 16);
    return `rgb(${Math.floor(r*level)}, ${Math.floor(g*level)}, ${Math.floor(b*level)})`;
}

export default class Button extends Component {
    // state = {
    //     bgColor: this.props.pressed ? muteColor(this.props.bgColor, 0.8) : this.props.bgColor,
    // }

    draw(bgColor) {
        const side = this.props.side;
        const color = this.props.color;
        const thickness = this.props.thickness;
        const Image = this.props.image;
        const image = new Image(side, color, thickness).draw();

        const icon = this.refs.icon;
        const ctx = icon.getContext('2d');
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, side, side);
        ctx.drawImage(image, 0, 0);
    }

    componentDidMount() {
        const bgColor = this.props.pressed ? muteColor(this.props.bgColor, 0.8) : this.props.bgColor;

        this.draw(bgColor);

        if (!this.props.animatePress) return;

        // модификация кнопки: анимация нажатия
        const button = this.refs.button;

        button.addEventListener('mousedown', () => this.press());
        button.addEventListener('mouseup', () => this.depress());

        button.addEventListener('touchstart', () => this.press());
        button.addEventListener('touchend', () => this.depress());
    }

    press() {
        const bgColor = muteColor(this.props.bgColor, 0.8);
        this.draw(bgColor);
    }

    depress() {
        const bgColor = this.props.bgColor;
        this.draw(bgColor);
    }

    componentDidUpdate() {
        const bgColor = this.props.pressed ? muteColor(this.props.bgColor, 0.8) : this.props.bgColor;
        this.draw(bgColor);
    }

    render() {
        const side = this.props.side;

        let canvas = <canvas ref='icon' width={side} height={side}></canvas>;

        return (
            <button
                ref='button'
                onClick={() => this.props.onClick()}
                onMouseOver={() => {
                    if (!this.props.pressed) this.draw(muteColor(this.props.bgColor, 0.9));
                }}
                onMouseOut={() => {
                    this.draw(this.props.pressed ? muteColor(this.props.bgColor, 0.8) : this.props.bgColor);
                }}
                style={{width:`${side}px`, height:`${side}px`}}
            >
                {canvas}
            </button>
        );
    }
}
