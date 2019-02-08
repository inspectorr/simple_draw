import React, { Component } from 'react';
import './style.css';

import ItemsList from './ItemsList';
import Brush from './ItemsList/Brush';
import Color from './ItemsList/Color';
import Thickness from './ItemsList/Thickness';

export default class ControlPanel extends Component {
    
    render() {
        const settings = {
            side: this.props.panelProps.height,
            color: this.props.panelProps.brush.color,
            thickness: this.props.panelProps.brush.thickness,
            bgColor: this.props.bgColor
        }

        const side = this.props.height;

        const items = [
            <Brush
                key='Brush'
                pressed={false}
                {...settings}
            />,

            <Color
                key='Color'
                onClick={() => {
                    if (!this.props.app.palette.open) {
                        this.props.openPalette();
                    } else this.props.closePalette();
                }}
                pressed={this.props.app.palette.open}
                {...settings}
            />,

            <Thickness
                key='Thickness'
                onClick={() => {
                    if (!this.props.app.thicknessSlider.open) {
                        this.props.openSlider();
                    } else this.props.closeSlider();
                }}
                pressed={this.props.app.thicknessSlider.open}
                {...settings}
            />,
        ]

        return (
            <div
                key='container'
                id='container'
                style={{
                    width: `${this.props.width}px`,
                    height: `${side}px`,
                    backgroundColor: `${this.props.bgColor}`
                }}
            >

                <ItemsList
                    items={items}
                />

            </div>

        );
    }
}
