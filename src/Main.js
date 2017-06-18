import React, { Component } from 'react';
import dateFormat from 'dateformat';
import TimeAgo from 'react-timeago';
import logo from './logo.png';
import Scanner from './Scanner.js';

export default class Main extends Component {

  state = {
    code: '',
    scanner: false,
    history: [],
    loading: false,
  }

  componentDidMount() {
    this.activeEnv = window.location.hash.replace(/#/, '') || 'prod';
    const env = this.props.env;
    if (!env[this.activeEnv]) alert('Link truy cập sai!');
    this.vars = env[this.activeEnv];
  }

  submit = () => {
    if (!this.state.code) return;
    this.setState({ loading: true });
    fetch(this.vars.API_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: this.vars.AUTHENTICATE,
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        codes: [this.state.code]
      })
    }).then(r => r.json())
      .then(response => {
        if (
          response &&
          response.data
        ) {
          if (response.data.success) {
            return true;
          } else {
            return Promise.reject(response.data.message);
          }
        }
        return Promise.reject('Mã không hợp lệ');
      }).then(() => {
        console.log('success');
        this.setState({
          code: '',
          loading: false,
          history: [{
            code: this.state.code,
            success: true,
            message: '',
            time: new Date(),
          }].concat(this.state.history)
        });
      }).catch(error => {
        console.error('error', error);
        this.setState({
          code: '',
          loading: false,
          history: [{
            code: this.state.code,
            success: false,
            message: error,
            time: new Date(),
          }].concat(this.state.history)
        });
      });
  }

  render() {
    return (
      <div className="home">
        <div id="scanner">
          <button
            className="button"
            onClick={() => this.setState({ scanner: !this.state.scanner })}
          >
            {this.state.scanner ? 'Close Scanner' : 'Open Scanner'}
          </button>
        </div>
        <div>
          {
            this.state.scanner ?
              <Scanner
                onCodeDetected={code => {
                  this.setState({ code }, () => {
                    this.submit();
                  })
                }}
              />
              :
              <div>
                <img src={logo} alt="logo" className="logo" />
              </div>
          }
          <div>
            {
              this.state.loading ?
                <div className="loading-wrapper">
                  <div className="loading"></div>
                </div>
                :
                <input
                  autoFocus
                  type="text"
                  value={this.state.code}
                  placeholder="Nhập hoặc scan mã voucher..."
                  className="input"
                  onChange={e => this.setState({ code: e.target.value })}
                  onKeyDown={e => e.keyCode === 13 && this.submit()}
                />
            }
          </div>
          <div id="history">
            {this.state.history.map(({
              code, success, message, time
            }, index) => (
              <div
                key={code + '-' + index}
                className={'history-item ' + (index === 0 ? 'first' : '')}
              >
                <div
                  className={
                    'item-code ' + (success ? 'success' : 'failed')
                  }
                >{code}</div>
                <div className="item-success">
                  {this.state.history.length - index}
                </div>
                <div className="item-message">
                  {message || 'Thành công'}
                </div>
                <div
                  className="item-time"
                  title={dateFormat(time, 'dd/mm/yyyy HH:MM:ss')}
                >
                  <TimeAgo date={time} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div id="version">
          {this.activeEnv}
        </div>
      </div>
    );
  }
};
