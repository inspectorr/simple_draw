import React, { Component } from 'react';

import ThicknessImage from '../images/ThicknessImage';
import Icon from '../Icon';

export default class Thickness extends Component {

    render() {
        const side = this.props.side;
        const color = this.props.color;
        const thickness = this.props.thickness;

        return (
            <button
                onClick={() => alert('ux')}
                style={{width:`${side}px`, height:`${side}px`}}
            >
                <Icon
                    side={side}
                    color={color}
                    image={(new ThicknessImage(side, color, thickness)).draw()}
                />
            </button>
        );
    }
}
