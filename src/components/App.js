import React, { Component } from 'react';
import Canvas from './Canvas';

// const root = document.getElementById('root');
// const width = root.offsetWidth;
// const height = root.offsetHeight;

class App extends Component {
    state = {
        height: document.documentElement.clientHeight,
        width: document.documentElement.clientWidth
    }

    render() {
        return (
            <Canvas width={this.state.width} height={this.state.height} />
        );
  }
}

export default App;
