import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const AdKeeper = () => {
  return <div style={{width: '100%', height: props.adHeight, backgroundColor: '#5F6368', postion: 'fixed', zIndex: 9999, bottom: 0}}></div>;
}

const ReactApp = (props) => {
  return (
    <div>
      <App adHeight={props.adHeight}/>
      <AdKeeper adHeight={props.adHeight}/>
    </div>
  );
}

const app = {
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  onDeviceReady: function() {
    window.screen.orientation.lock('portrait');
    window.admob.createBannerView({
      publisherId: "ca-app-pub-7113401163019527/8852005935",
      adSize: window.admob.AD_SIZE.BANNER,
    });
    const adHeight = 50;
    ReactDOM.render(<ReactApp adHeight={adHeight}/>, document.getElementById('root'));
  },
};

app.initialize();
