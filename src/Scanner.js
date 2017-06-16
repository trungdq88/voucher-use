import React, { Component } from 'react';
import Instascan from 'instascan';

export default class Scanner extends Component {

  constructor(props) {
    super(props);
    this.ref = null;
  }

  componentDidMount() {
    let scanner = new Instascan.Scanner({
      video: this.ref
    });
    scanner.addListener('scan', content => {
      this.props.onCodeDetected(content);
    });
    Instascan.Camera.getCameras().then(cameras => {
      if (cameras.length > 0) {
        scanner.start(cameras[0]);
      } else {
        console.error('No cameras found.');
      }
    }).catch(function (e) {
      console.error(e);
    });
  }

  render() {
    return (
      <video ref={r => this.ref = r}></video>
    );
  }

}
