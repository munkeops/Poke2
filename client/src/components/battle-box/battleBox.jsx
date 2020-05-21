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
        <div className="battle">
          <div className="enemy">
            {" "}
            {this.props.enemy.map((pokemon) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <img
                    style={{ width: "100%", height: "auto" }}
                    src={`http://www.pkparaiso.com/imagenes/xy/sprites/animados/${pokemon.name}.gif`}
                    alt={pokemon.name}
                  ></img>
                </div>
              );
            })}
          </div>
          <div className="team">
            {this.props.team.map((pokemon) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <img
                    style={{ width: "100%", height: "auto" }}
                    src={`http://www.pkparaiso.com/imagenes/xy/sprites/animados-espalda/${pokemon.name}.gif`}
                    alt={pokemon.name}
                  ></img>
                </div>
              );
            })}
          </div>
        </div>
        <div className="moves"></div>
      </div>
    );
  }
}

export default BattleBox;
