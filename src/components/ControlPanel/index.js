import React, { Component } from 'react';
import './style.css';

import ItemsList from './ItemsList';
import Brush from './ItemsList/Brush';
import Color from './ItemsList/Color';
import Thickness from './ItemsList/Thickness';

export default class ControlPanel extends Component {
    // центрированная панель с произвольным количеством элементов
    state = {
        items: [
            {
                key: 'Brush',
                component: Brush,
                pressed: false,
            },

            {
                key: 'Color',
                component: Color,
                onClick: () => {
                    if (!this.props.app.palette.open) this.props.openPalette();
                    else this.props.closePalette();
                },
                pressed: false,
            },

            {
                key: 'Thickness',
                component: Thickness,
                pressed: false,
            }
        ]
    }

    componentDidUpdate(){
        console.log('panel updated');
    }

    render() {
        const settings = {
            side: this.props.panelProps.height,
            color: this.props.panelProps.brush.color,
            thickness: this.props.panelProps.brush.thickness,
            bgColor: this.props.bgColor
        }

        // сторона кнопки равна заданной высоте панели
        const side = this.props.height;

        return (
            <div
                key={'container'}
                id={'container'}
                style={{
                    // позиционирование панели
                    width: `${this.props.width}px`,
                    height: `${side}px`,
                    backgroundColor: `${this.props.bgColor}`
                    // marginLeft: `${-width/2}px`
                }}
            >
                <ItemsList
                    items={this.state.items}
                    settings={settings}
                />
            </div>

        );
    }
}
