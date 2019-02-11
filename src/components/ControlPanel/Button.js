import React, { Component } from 'react';

// почитай сука про импорт нормальный а то это не смещно даже
import { muteColor } from 'C:/Users/User/Desktop/dev/simple_draw/src/colorFunctions.js';

export default class Button extends Component {

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
        const bgColor = this.props.pressed ? muteColor(this.props.bgColor) : this.props.bgColor;
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
        const bgColor = muteColor(this.props.bgColor);
        this.draw(bgColor);
    }

    depress() {
        const bgColor = this.props.bgColor;
        this.draw(bgColor);
    }

    componentDidUpdate() {
        const bgColor = this.props.pressed ? muteColor(this.props.bgColor) : this.props.bgColor;
        this.draw(bgColor);
    }

    render() {
        const side = this.props.side;

        let canvas = <canvas ref='icon' width={side} height={side}></canvas>;

        // // модификация кнопки для скачивания по ссылке
        // if (this.props.href) {
        //     canvas = <a href={this.props.href} download>{canvas}</a>;
        // }

        return (
            <button
                ref='button'
                onClick={() => this.props.onClick()}
                style={{width:`${side}px`, height:`${side}px`}}
            >
                {canvas}
            </button>
        );
    }
}
