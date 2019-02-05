import React, { Component } from 'react';

import BrushImage from '../images/BrushImage';
import Icon from '../Icon';

export default class Brush extends Component {

    render() {
        const side = this.props.side;
        const color = this.props.color;

        return (
            <button
                onClick={() => alert('ux')}
                style={{width:`${side}px`, height:`${side}px`}}
            >
                <Icon
                    side={side}
                    bgColor={this.props.bgColor}
                    color={this.props.color}
                    image={(new BrushImage(side, color)).draw()}
                    pressed={this.props.pressed}
                />
            </button>
        );
    }
}
