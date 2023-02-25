import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Pushup from './Components/Pushup/Pushup';
import Tpose from './Components/Tpose/Tpose';

function App() {
  return (
    <Router>
      <Switch>
        <Route extact path="/exercise/pushup" component={Pushup} ></Route>
        <Route exact path="/exercise/tpose" component={Tpose}></Route>
      </Switch>
    </Router>
  )
}

export default App;