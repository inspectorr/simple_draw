import React, { Component } from 'react';
import Canvas from './Canvas';
import ControlPanel from './ControlPanel';

// const root = document.getElementById('root');
// const width = root.offsetWidth;
// const height = root.offsetHeight;

class App extends Component {
    state = {
        // размеры и оринтация элементов могут меняться
        canvas: {
            height: document.documentElement.clientHeight,
            width: document.documentElement.clientWidth
        },

        controlPanel: {
            height: 100,
            // width:  500,
            orientation: 'portrait',

            brush: {
                color: 'pink',
                thickness: 7,
                opacity: 100
            },
        },

    }

    render() {
        return (
            [
            <ControlPanel
                panelProps={this.state.controlPanel}
                height={this.state.controlPanel.height}
                orientation={this.state.controlPanel.orientation}
                key = 'ControlPanel'
            />,
            <Canvas
                panelProps={this.state.controlPanel}
                width={this.state.canvas.width}
                height={this.state.canvas.height}
                key = 'Canvas'
            />
            ]
        );
    }
}

export default App;
