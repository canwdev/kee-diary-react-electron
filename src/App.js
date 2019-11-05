import React from 'react';
import {HashRouter as Router, Route,} from "react-router-dom";

import AppContainer from "./components/AppContainer"

import router from './router'

function App() {

  return (
    <Router>

      <AppContainer router={router} match>
        <div className="page-content">
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
