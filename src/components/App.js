import React, { Component } from 'react';

import Canvas from './Canvas';
import ControlPanel from './ControlPanel';
import Palette from './Palette';
import ThicknessSlider from './ThicknessSlider';

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
  return `#${r}${g}${b}`;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef();

    this.state = {};

    this.state.mode = 'draw';

    let {clientWidth, clientHeight} = document.documentElement;
    this.state.window = {
      height: clientHeight,
      width: clientWidth
    };

    const N = 6;
    const maxHeight = Math.floor(0.115*clientHeight);
    let controlPanelHeight = clientWidth / N <= maxHeight ? clientWidth / N : maxHeight;

    this.state.controlPanel = {
      height: controlPanelHeight,

      brush: {
        color: '#ffaaaa',
        thickness: 0.01*this.state.window.height,
        minThickness: 1,
        maxThickness: Math.floor(0.05*this.state.window.height),
        opacity: 100,
      },

    };

    this.state.palette = {
      open: false,

      colors: [
        '#000000',
        '#501111',
        '#cc9966',
        '#ffff99',
        '#336600',
        '#33cc99',
        '#afeeee',
        '#000066',
        '#6633CC',
        '#cc99ff',
        '#ffaaaa',
        '#cc3366',
      ],
    };

    this.state.thicknessSlider = {
      open: false,
    };

    this.state.canvasURL = null;
  }

  setCanvasURL(canvasURL) {
    this.setState({ canvasURL });
  }

  undo() {
    this.canvas.current.undo();
  }

  setDrawMode() {
    this.setState({ mode: 'draw' });
  }

  setEraseMode() {
    this.setState({ mode: 'erase' });
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

    let canvas = <Canvas
      key='Canvas'
      ref={this.canvas}
      panelProps={this.state.controlPanel}
      width={this.state.window.width}
      height={canvasHeight}

      app={this.state}
      closeSlider={() => this.closeSlider()}
      setCanvasURL={this.setCanvasURL.bind(this)}
      />;

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

      canvasHref={this.state.canvasURL}
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

        setDrawMode={() => this.setDrawMode()}
        closePalette={() => this.closePalette()}
        setBrushColor={(color) => this.setBrushColor(color)}
        />;
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
        />;
    } else {
      thicknessSlider = null;
    }

    return [controlPanel, canvas, palette, thicknessSlider];
  }
}

export default App;
