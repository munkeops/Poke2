import React from "react";

import "./battle.styles.scss";
import { Layout } from "../layout";
import BattleBox from "../../components/battle-box/battleBox.jsx";
import Logs from "../../components/logs/logs";
import { withRouter } from "react-router-dom";

class Battle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginCheck: true,
    };
  }

  componentDidMount() {
    window.addEventListener("beforeunload", function (event) {
      event.returnValue = "Hellooww";
    });
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", function (event) {
      event.returnValue = "Hellooww";
    });
  }

  render() {
    return (
      <Layout>
        <div className="container">
          <BattleBox />
          <Logs />
        </div>
      </Layout>
    );
  }
}

export default withRouter(Battle);
