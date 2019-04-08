import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import AdKeeper from './components/AdKeeper';

const ReactApp = (props) => {
  const adHeight = 50;
  return (
    <div>
      <App adHeight={props.ad ? adHeight : 0}/>
      {props.ad ? <AdKeeper adHeight={adHeight}/> : null}
    </div>
  );
}

const app = {
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  onDeviceReady: function() {
    window.screen.orientation.lock('portrait');
    ReactDOM.render(<ReactApp ad={false}/>, document.getElementById('root'));
  },
};

app.initialize();
