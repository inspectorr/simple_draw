import React, { Component } from 'react';

import ColorImage from '../images/ColorImage';
import Icon from '../Icon';

export default class Color extends Component {

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
                    color={color}
                    image={(new ColorImage(side, color)).draw()}
                />
            </button>
        );
    }
}
