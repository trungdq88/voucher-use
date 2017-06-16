import React, { Component } from 'react';
import dateFormat from 'dateformat';
import TimeAgo from 'react-timeago';
import logo from './logo.png';

const ACTIVE_ENV = window.location.hash.replace(/#/, '') || 'prod';

const ENV = {
  uat: {
    API_ENDPOINT: 'http://uat-rewards.sevensystem.vn/api/sc/v1/vouchers/use',
    AUTHENTICATE: 'Basic ZmZlNjJhOjhkZDhlNDE1MDM3NjdhMTQ5OWNkNjJiZjk5ZWNhMzZj',
  },
  prod: {
    API_ENDPOINT: 'https://crm.sevensystem.vn/api/sc/v1/vouchers/use',
    AUTHENTICATE: 'Basic OWNlMmVlOjU5NTZiYTM2Zjg1YWI5M2JhNGQ4YjFmZmYxNjNlMmNi',
  },
};

if (!ENV[ACTIVE_ENV]) alert('Link truy cập sai!');

const VARS = ENV[ACTIVE_ENV];

class App extends Component {

  state = {
    code: '',
    history: [],
    loading: false,
  }

  submit = () => {
    if (!this.state.code) return;
    this.setState({ loading: true });
    fetch(VARS.API_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: VARS.AUTHENTICATE,
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
        <div>
          <div>
            <img src={logo} alt="logo" className="logo" />
          </div>
          <div>
            {
              this.state.loading ?
                <div style={{ height: 90, width: 600 }}>
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
          {ACTIVE_ENV}
        </div>
      </div>
    );
  }
}

export default App;
