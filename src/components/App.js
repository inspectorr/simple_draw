import React, { Component } from 'react';

import Canvas from './Canvas';
import ControlPanel from './ControlPanel';
import Palette from './Palette';

function reverseColor(color) {
    color = color.slice(1);
    let r = parseInt(color.slice(0, 2), 16);
    let g = parseInt(color.slice(2, 4), 16);
    let b = parseInt(color.slice(4, 6), 16);
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    r = r.length < 2 ? '0' + r : r;
    g = g.length < 2 ? '0' + g : g;
    b = b.length < 2 ? '0' + b : b;
    // console.log(r,g,b);
    return `#${r}${g}${b}`;
}

class App extends Component {
    state = {
        // размеры и оринтация элементов могут меняться
        window: {
            height: document.documentElement.clientHeight,
            width: document.documentElement.clientWidth
        },

        controlPanel: {
            height: 70,
            // width:  500,
            orientation: 'portrait',

            brush: {
                color: '#ffaaaa',
                thickness: 10,
                opacity: 100,
            },


        },

        palette: {
            open: false,
            colors: [
                // https://colorscheme.ru/html-colors.html
                '#000000', // черный
                '#8B0000', // бордовый
                '#dd0000', // красный
                '#FF4500', // оранжевый coral
                '#ffff7f', // желтый
                '#ffaaaa', // розовый
                '#006400', // темно-зеленый
                '#228B22', // светло-зеленый
                '#005555', // морская волна
                '#1E90FF', // голубой dodger blue
                '#000080', // синий navy
                '#4B0082', // фиолетовый indigo
            ],
        }

    }

    openPalette() {
        let palette = Object.assign({}, this.state.palette);
        palette.open = true;
        this.setState({palette});
    }

    closePalette() {
        let palette = Object.assign({}, this.state.palette);
        palette.open = false;
        this.setState({palette});
    }

    setBrushColor(color) {
        let controlPanel = Object.assign({}, this.state.controlPanel);
        controlPanel.brush.color = color;
        this.setState({controlPanel});
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    render() {
        const canvasHeight = this.state.window.height-this.state.controlPanel.height;
        const bgColor = reverseColor(this.state.controlPanel.brush.color);

        let controlPanel = <ControlPanel
            id='ControlPanel'
            key='ControlPanel'
            panelProps={this.state.controlPanel}
            height={this.state.controlPanel.height}
            width={this.state.window.width}
            orientation={this.state.controlPanel.orientation}
            bgColor={bgColor}

            app={this.state}
            openPalette={() => this.openPalette()}
            closePalette={() => this.closePalette()}

        />;

        let canvas = <Canvas
            key='Canvas'
            panelProps={this.state.controlPanel}
            width={this.state.window.width}
            height={canvasHeight}
        />;

        let palette;
        if (this.state.palette.open) {
            palette = <Palette
                key='Palette'
                colors={this.state.palette.colors}
                width={this.state.window.width}
                height={this.state.window.height - this.state.controlPanel.height}
                panelProps={this.state.controlPanel}
                style={{position: 'fixed'}}
                bgColor={bgColor}

                open={this.state.open}

                closePalette={() => this.closePalette()}
                setBrushColor={(color) => this.setBrushColor(color)}
            />
        } else {
            palette = null;
        }

        return [controlPanel, canvas, palette];
    }
}

export default App;
