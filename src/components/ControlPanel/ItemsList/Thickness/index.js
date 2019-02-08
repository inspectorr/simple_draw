import React, { Component } from 'react';

import ThicknessImage from '../images/ThicknessImage';
import Icon from '../Icon';

export default class Thickness extends Component {
    render() {
        const side = this.props.side;
        const color = this.props.color;
        const thickness = this.props.thickness;
        // console.log(this.props.pressed);

        return (
            <button
                onClick={() => this.props.onClick()}
                style={{width:`${side}px`, height:`${side}px`}}
            >
                <Icon
                    side={side}
                    bgColor={this.props.bgColor}
                    color={this.props.color}
                    image={(new ThicknessImage(side, color, thickness)).draw()}
                    pressed={this.props.pressed}
                />
            </button>
        );
    }
}
