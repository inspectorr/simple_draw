import React, { Component } from 'react';

import Canvas from './Canvas';
import ControlPanel from './ControlPanel';
import Palette from './Palette';
import ThicknessSlider from './ThicknessSlider';

import { reverseColor } from '../colorFunctions';

const {clientWidth, clientHeight} = document.documentElement;

class App extends Component {
    constructor(props) {
        super(props);

        this.canvas = React.createRef();

        this.state = {};

        this.state.mode = 'draw';

        this.state.window = {
            height: clientHeight,
            width: clientWidth
        };

        this.state.controlPanel = {
            height: Math.floor(0.1*this.state.window.height),

            brush: {
                color: '#ffaaaa',
                thickness: 0.01*this.state.window.height,
                minThickness: 1,
                maxThickness: 0.05*this.state.window.height,
                opacity: 100,
            },
        };

        this.state.palette = {
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
        };

        this.state.thicknessSlider = {
            open: false,
        };
    }

    undo() {
        this.canvas.current.undo();
    }

    setDrawMode() {
        this.setState({ mode: 'draw' });
    }

    setEraseMode() {
        // this.setBrushColor('#ffffff');
        this.setState({ mode: 'erase' });
    }

    componentDidMount() {
        const self = this;
        window.addEventListener('resize', function(event) {
            const {clientWidth, clientHeight} = document.documentElement;
            let window = Object.assign({}, self.state.window);
            window.width = clientWidth;
            window.height = clientHeight;
            self.setState({ window });
        });
    }

    openPalette() {
        if (this.state.thicknessSlider.open) this.closeSlider();
        let palette = Object.assign({}, this.state.palette);
        palette.open = true;
        this.setState({palette});
    }

    closePalette() {
        let palette = Object.assign({}, this.state.palette);
        palette.open = false;
        this.setState({palette});
    }

    openSlider() {
        if (this.state.palette.open) this.closePalette();
        let thicknessSlider = Object.assign({}, this.state.thicknessSlider);
        thicknessSlider.open = true;
        this.setState({thicknessSlider});
    }

    closeSlider() {
        let thicknessSlider = Object.assign({}, this.state.thicknessSlider);
        thicknessSlider.open = false;
        this.setState({thicknessSlider});
    }

    setBrushColor(color) {
        let controlPanel = Object.assign({}, this.state.controlPanel);
        controlPanel.brush.color = color;
        this.setState({controlPanel});
    }

    setBrushThickness(thickness) {
        let controlPanel = Object.assign({}, this.state.controlPanel);
        controlPanel.brush.thickness = thickness;
        this.setState({controlPanel});
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

            openSlider={() => this.openSlider()}
            closeSlider={() => this.closeSlider()}

            setDrawMode={() => this.setDrawMode()}
            setEraseMode={() => this.setEraseMode()}

            undo={() => this.undo()}
          />;

        let canvas = <Canvas
            key='Canvas'
            ref={this.canvas}
            panelProps={this.state.controlPanel}
            width={this.state.window.width}
            height={canvasHeight}

            app={this.state}
            closeSlider={() => this.closeSlider()}
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

                open={this.state.palette.open}

                closePalette={() => this.closePalette()}
                setBrushColor={(color) => this.setBrushColor(color)}
            />
        } else {
            palette = null;
        }

        let thicknessSlider;
        if (this.state.thicknessSlider.open) {
            thicknessSlider = <ThicknessSlider
                key='ThicknessSlider'
                width={this.state.controlPanel.height*4}
                height={this.state.controlPanel.height}
                panelProps={this.state.controlPanel}
                bgColor={bgColor}

                open={this.state.thicknessSlider.open}
                closeSlider={() => this.closeSlider()}
                setBrushThickness={(thickness) => this.setBrushThickness(thickness)}
            />
        } else {
            thicknessSlider = null;
        }

        return [controlPanel, canvas, palette, thicknessSlider];
    }
}

export default App;
