import React, { Component } from 'react';
import Header from '../components/Header';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import '../styles/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Header />
          <div className="col-lg-12">
              <div className="row">
                <MuiThemeProvider>
                  {this.props.children}
                </MuiThemeProvider>
              </div>
          </div>
      </div>
    );
  }
}

export default App;
