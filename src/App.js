import React, {useEffect} from 'react';
import {HashRouter as Router, Route,} from "react-router-dom";

import AppContainer from "./components/AppContainer"

import router from './router'
import hotkeys from "hotkeys-js"
import {saveKdbxDB} from "./store/setters"

function App() {

  useEffect(() => {

    // 保存数据库
    hotkeys('ctrl+s, command+s', function(event, handler){
      event.preventDefault()
      if(event.target === "input"){
        alert('你在输入框中按下了 a!')
      }
      saveKdbxDB()
    });

    return () => {
      hotkeys.unbind('ctrl+s, command+s')
    }
  }, [])

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
