import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/base.css'
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App';
import {Provider} from 'react-redux'
import store from "./store"

ReactDOM.render(
  <Provider store={store}>
    <React.Fragment>
      <CssBaseline/>
      <App/>
    </React.Fragment>
  </Provider>
  , document.getElementById('root')
);
