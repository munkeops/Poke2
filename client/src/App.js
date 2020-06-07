import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.scss";

import Homepage from "./pages/homepage/homepage";
import Battle from "./pages/battle/battle";

import { loadUser } from "./actions/authActions";
import Leaderboard from "./pages/leaderboard/leaderboard";

class App extends React.Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }
  render() {
    return (
      <Provider store={store}>
        <div className="main-container">
          <Router>
            <Switch>
              <Route path="/battle">
                <Battle />
              </Route>
              <Route path="/leaderboard">
                <Leaderboard />
              </Route>
              <Route path="/">
                <Homepage />
              </Route>
            </Switch>
          </Router>
        </div>
      </Provider>
    );
  }
}

export default App;
