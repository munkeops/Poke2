import React from "react";

import "./battleBox.styles.scss";

class BattleBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="battle-box">
        <div className="battle"></div>
        <div className="moves"></div>
      </div>
    );
  }
}

export default BattleBox;
