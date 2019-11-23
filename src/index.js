import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/normalize.css'
import './assets/styles/github-markdown.css'
import './assets/styles/base.css'
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App';
import {Provider} from 'react-redux'
import store from "./store"
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {brown, deepPurple} from '@material-ui/core/colors';
if (module.hot) {
  module.hot.accept();
}
const theme = createMuiTheme({
  palette: {
    primary: brown,
    secondary: deepPurple
  },
});

ReactDOM.render(
  <Provider store={store}>
    <React.Fragment>
      <CssBaseline/>
      <ThemeProvider theme={theme}>
        <App/>
      </ThemeProvider>
    </React.Fragment>
  </Provider>
  , document.getElementById('root')
);
