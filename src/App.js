import React, {useEffect} from 'react';
import {HashRouter as Router, Route,} from "react-router-dom";
import router from './router'
import {registerKeyShortcuts, unRegisterKeyShortcuts} from "./utils/key-shortcuts"
import {makeStyles} from "@material-ui/core/styles"
import AppContainer from "./components/AppContainer"

const useStyles = makeStyles(theme => ({
  pageContent: {
    paddingTop: theme.spacing(1),
  },
}))

function App() {
  const classes = useStyles();

  useEffect(() => {
    registerKeyShortcuts()
    return () => {
      unRegisterKeyShortcuts()
    }
  }, [])

  return (
    <Router>

      <AppContainer router={router} match>
        <div className={classes.pageContent}>
          {
            router.map((item, index) => {
              return (
                <Route key={index} path={item.pathRoute || item.path} exact={item.exact} component={item.component}/>)
            })
          }
        </div>
      </AppContainer>

    </Router>
  );
}

export default App;
