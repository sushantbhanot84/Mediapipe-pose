import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Pushup from './Components/Pushup/Pushup';
import Tpose from './Components/Tpose/Tpose';

function App() {
  return (
    <Router>
      <Switch>
        <Route extact path="/excercise/pushup" component={Pushup} ></Route>
        <Route exact path="/excercise/tpose" component={Tpose}></Route>
      </Switch>
    </Router>
  )
}

export default App;