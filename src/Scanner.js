import React, { Component } from 'react';
import Instascan from 'instascan';
import beep from './beep.js';

export default class Scanner extends Component {

  constructor(props) {
    super(props);
    this.ref = null;
    this.scanner = null;
  }

  componentDidMount() {
    this.scanner = new Instascan.Scanner({
      video: this.ref
    });
    this.scanner.addListener('scan', content => {
      beep();
      this.props.onCodeDetected(content);
    });
    Instascan.Camera.getCameras().then(cameras => {
      if (cameras.length > 0) {
        this.scanner.start(cameras[0]);
      } else {
        console.error('No cameras found.');
      }
    }).catch(function (e) {
      console.error(e);
    });
  }

  componentWillUnmount() {
    this.scanner && this.scanner.stop();
  }

  render() {
    return (
      <video ref={r => this.ref = r}></video>
    );
  }

}
