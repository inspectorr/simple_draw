import React, { Component } from 'react';

import ColorImage from '../images/ColorImage';
import Icon from '../Icon';

export default class Color extends Component {
    render() {
        const side = this.props.side;
        const color = this.props.color;

        return (
            <button
                onClick={() => {
                    this.props.onClick();
                }}
                style={{width:`${side}px`, height:`${side}px`}}
            >
                <Icon
                    side={side}
                    bgColor={this.props.bgColor}
                    color={this.props.color}
                    image={(new ColorImage(side, color)).draw()}
                    pressed={this.props.pressed}
                />
            </button>
        );
    }
}
