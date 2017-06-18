import React, { Component } from 'react';
import Login from './Login.js';
import Main from './Main.js';

export default class App extends Component {

  state = {
    secret: JSON.parse(sessionStorage.getItem('secret')),
  }

  render() {
    if (!this.state.secret) return (
      <Login
        onLoggedIn={secret => {
          sessionStorage.setItem('secret', JSON.stringify(secret));
          this.setState({ secret });
        }}
      />
    );
    return <Main env={this.state.secret.env} />;
  }

}
