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
                <img
                  src={`https://img.pokemondb.net/sprites/black-white/anim/normal/${pokemon.name}.gif`}
                ></img>
              );
            })}
          </div>
          <div className="team">
            {this.props.team.map((pokemon) => {
              return (
                <img
                  src={`https://img.pokemondb.net/sprites/black-white/anim/back-normal/${pokemon.name}.gif`}
                ></img>
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
