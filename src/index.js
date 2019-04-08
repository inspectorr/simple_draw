import React from 'react';
import ReactDOM from 'react-dom';
import ReactApp from './components/App';

const app = {
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  onDeviceReady: function() {
    window.screen.orientation.lock('portrait');
    ReactDOM.render(<ReactApp />, document.getElementById('root'));
  },
};

app.initialize();
