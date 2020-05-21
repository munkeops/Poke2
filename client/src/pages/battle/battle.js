import React from "react";
import { connect } from "react-redux";
import "./battle.styles.scss";
import { Layout } from "../layout";
import BattleBox from "../../components/battle-box/battleBox";
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
          <BattleBox team={this.props.team} enemy={this.props.enemy} />
          <Logs />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  user: state.auth.user,
  room: state.auth.room,
  team: state.auth.team,
  enemy: state.auth.enemy,
});
export default connect(mapStateToProps)(Battle);
