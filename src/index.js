import React, {useMemo} from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/normalize.css'
import './assets/styles/github-markdown.css'
import './assets/styles/github-markdown-dark.css'
import './assets/styles/base.css'
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App';
import {Provider, useSelector} from 'react-redux'
import store from "./store"
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {deepOrange, brown, cyan, deepPurple} from '@material-ui/core/colors';
import {selectorIsDarkMode} from "./store/getters"

if (module.hot) {
  module.hot.accept();
}

const themeConfig = {
  palette: {
    primary: brown,
    secondary: deepPurple,
  },
}

const themeConfigDark = {
  palette: {
    primary: deepOrange,
    secondary: cyan,
    type: 'dark'
  },
}


const ThemedApp = () => {
  const isDarkMode = useSelector(selectorIsDarkMode)

  const theme = useMemo(() => {
    return createMuiTheme(isDarkMode ? themeConfigDark : themeConfig)
  }, [isDarkMode])
  // console.log(theme)

  return (
    <ThemeProvider theme={theme}>
      <App/>
    </ThemeProvider>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <React.Fragment>
      <CssBaseline/>
      <ThemedApp/>
    </React.Fragment>
  </Provider>
  , document.getElementById('root')
);
