import React, { Component } from 'react';

import { decrypt } from './crypto.js';
import logo from './logo.png';
import './Login.css';

export default class Login extends Component {

  state = {
    email: '',
    isLoading: false,
    password: '',
    error: '',
  };

  login = () => {
    const key = this.state.email + ':' + this.state.password;
    this.setState({
      error: '',
      isLoading: true,
    });
    try {
      const secret = JSON.parse(decrypt(process.env.REACT_APP_SECRET, key));
      this.props.onLoggedIn && this.props.onLoggedIn(secret);
    } catch (e) {
      this.setState({
        error: 'Mật khẩu không chính xác',
        isLoading: false,
      });
    }
  }

  render() {
    return (
      <div className="login flex-center-center login-2">
        <div className="login-form">
          <img src={logo} className="logo" alt="7-Eleven Logo"/>
          <h2 className="white">7-Eleven Voucher</h2>
          <div>
            <input
              autoFocus
              tabIndex="1"
              placeholder="Username or email"
              className="text-input"
              type="email"
              onChange={e => this.setState({
                email: e.target.value,
                error: ''
              })}
              disabled={this.state.isLoading}
            />
          </div>
          <div className="mb-20">
            <input
              ref={r => this.passwordRef = r}
              tabIndex="2"
              placeholder="Password"
              type="password"
              className="text-input"
              onChange={e => this.setState({
                password: e.target.value,
                error: ''
              })}
              onKeyDown={e => e.keyCode === 13 && this.login()}
              disabled={this.state.isLoading}
            />
          </div>
          {
            this.state.isLoading ?
              <div style={{ height: '50px', lineHeight: '50px' }}>
                <div className="loading"></div>
              </div>
              :
              <button
                className="login-btn"
                type="button"
                onClick={this.login}
              >
                LOGIN
              </button>
          }
        </div>
        {
          this.state.error &&
            <div className="error-box">
              {this.state.error}
            </div>
        }
      </div>
    )
  }
};
