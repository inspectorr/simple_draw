import React, { Component } from 'react';

export default class AdKeeper extends Component {
  componentDidMount() {
    window.admob.createBannerView({
      publisherId: "ca-app-pub-7113401163019527/8852005935",
      adSize: window.admob.AD_SIZE.BANNER,
      autoShowBanner: true,  
      overlap: true,
    });
  }

  render() {
    const height = 50;
    return <div style={{width: '100%', height, backgroundColor: '#ccc', position: 'absolute', zIndex: 9999, bottom: 0}}></div>;
  }
}
