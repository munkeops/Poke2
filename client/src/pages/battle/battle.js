import React from "react";

import "./battle.styles.scss";
import { Layout } from "../layout";
import BattleBox from "../../components/battle-box/battleBox.jsx";
import Logs from "../../components/logs/logs";

class Battle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Layout>
        <h2>Room #{this.props.room}</h2>
        <div className="container">
          <BattleBox />
          <Logs />
        </div>
      </Layout>
    );
  }
}

export default Battle;
