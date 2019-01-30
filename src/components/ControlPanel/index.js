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

            <li key={0}>
                <Brush
                    side={this.props.panelProps.height}
                    panelProps={this.props.panelProps}
                    color={this.props.panelProps.brush.color}
                />
            </li>,

            <li key={1}>
                <Color
                    side={this.props.panelProps.height}
                    panelProps={this.props.panelProps}
                    color={this.props.panelProps.brush.color}
                />
            </li>,

            <li key={2}>
                <Thickness
                    side={this.props.panelProps.height}
                    panelProps={this.props.panelProps}
                    color={this.props.panelProps.brush.color}
                    thickness={this.props.panelProps.brush.thickness}
                />
            </li>,
            
        ],
    }

    render() {
        const items = this.state.items;
        const panelProps = this.props.panelProps;
        const N = items.length;

        // сторона квадратного элемента равна заданной высоте панели
        const side = this.props.height;

        // ширина панели равна количеству элементов на их сторону
        const width = N * side;

        return (
            <div
                className={'container'}
                style={{
                    // позиционирование панели
                    width: `${width}px`,
                    height: `${side}px`,
                    marginLeft: `${-width/2}px`
                }}
            >
                <ItemsList
                    side={side}
                    panelProps={panelProps}
                    items={this.state.items}
                    itemSideLength={side}
                />
            </div>
        );
    }
}
