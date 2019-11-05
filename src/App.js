import React from 'react';
import {HashRouter as Router, Redirect, Route,} from "react-router-dom";

import AppContainer from "./components/AppContainer"

import router from './router'
import {useSelector} from "react-redux"

function App() {
  const unlocked = useSelector(state => state.unlocked);

  return (
    <Router>
      {!unlocked ? <Redirect to="/login"/> : <Redirect to="/view-list"/>}
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
