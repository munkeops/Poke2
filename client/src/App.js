import React from "react";
import { Provider } from "react-redux";
import store from "./store";

import "./App.scss";

import Homepage from "./pages/homepage/homepage";

import { loadUser } from "./actions/authActions";

class App extends React.Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }
  render() {
    return (
      <Provider store={store}>
        <div className="main-container">
          <Homepage />
        </div>
      </Provider>
    );
  }
}

export default App;
