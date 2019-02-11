import React, { Component } from 'react';
import './style.css';

import Button from './Button';

import BrushImage from './images/BrushImage';
import ColorImage from './images/ColorImage';
import ThicknessImage from './images/ThicknessImage';
import EraserImage from './images/EraserImage';
import UndoImage from './images/UndoImage';
import DownloadImage from './images/DownloadImage';


export default class ControlPanel extends Component {
    render() {
        const settings = {
            side: this.props.panelProps.height,
            color: this.props.panelProps.brush.color,
            thickness: this.props.panelProps.brush.thickness,
            bgColor: this.props.bgColor,
            mode: this.props.app.mode
        }

        const items = [
            <Button
                key='Brush'
                image={BrushImage}
                pressed={this.props.app.mode === 'draw'}
                onClick={() => this.props.setDrawMode()}
                {...settings}
            />,

            <Button
                key='Color'
                image={ColorImage}
                pressed={this.props.app.palette.open}
                onClick={() => {
                    if (!this.props.app.palette.open) {
                        this.props.openPalette();
                    } else this.props.closePalette();
                }}
                {...settings}
            />,

            <Button
                key='Thickness'
                image={ThicknessImage}
                pressed={this.props.app.thicknessSlider.open}
                onClick={() => {
                    if (!this.props.app.thicknessSlider.open) {
                        this.props.openSlider();
                    } else this.props.closeSlider();
                }}
                {...settings}
            />,

            <Button
                key='Earser'
                image={EraserImage}
                pressed={this.props.app.mode === 'erase'}
                onClick={() => this.props.setEraseMode()}
                {...settings}
            />,

            <Button
                key='Undo'
                image={UndoImage}
                pressed={false}
                animatePress={true}
                onClick={() => {
                    this.props.undo();
                }}
                {...settings}
            />,

        <a key='Download' href={this.props.canvasHref} download>
                <Button
                    image={DownloadImage}
                    pressed={false}
                    animatePress={true}
                    onClick={() => {}}
                    {...settings}
                />
            </a>,
        ];

        const side = this.props.height;
        const bgColor = this.props.bgColor;

        return (
            <div
                key='container'
                id='container'
                style={{
                    width: `${this.props.width}px`,
                    height: `${side}px`,
                    backgroundColor: `${bgColor}`,
                    borderBottom: bgColor === '#ffffff' ? '0.05em solid black' : 'none', 
                }}
            >
                {items}
            </div>
        );
    }
}
