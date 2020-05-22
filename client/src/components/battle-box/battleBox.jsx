import React from "react";
import { connect } from "react-redux";

import "./battleBox.styles.scss";

class BattleBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePoke: null,
      enemySelected: null,
    };
  }

  firstTurn = (name) => {
    const socket = this.props.socket;
    socket.emit("play-turn", {
      username: this.props.user.username,
      room: this.props.room,
      firstTurn: true,
      selected: name,
    });
    let selectedPoke = this.props.team.find(
      (pokemon) => pokemon.name === "name"
    );
    console.log(selectedPoke);
    this.setState({ activePoke: selectedPoke });
  };

  render() {
    return (
      <div className="battle-box">
        <div className="battle">
          {this.state.enemySelected === null ? (
            <div>
              <div className="enemy">
                {" "}
                {this.props.enemy.map((pokemon) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        maxHeight: "119px",
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
                        maxHeight: "119px",
                      }}
                    >
                      <img
                        style={{
                          width: "100%",
                          height: "auto",
                        }}
                        src={`http://www.pkparaiso.com/imagenes/xy/sprites/animados-espalda/${pokemon.name}.gif`}
                        alt={pokemon.name}
                      ></img>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="enemy">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    maxHeight: "119px",
                  }}
                >
                  <img
                    style={{ width: "100%", height: "auto" }}
                    src={`http://www.pkparaiso.com/imagenes/xy/sprites/animados/${this.state.enemySelected}.gif`}
                    alt={this.state.enemySelected}
                  ></img>
                </div>
              </div>
              <div className="team">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    maxHeight: "119px",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                    src={`http://www.pkparaiso.com/imagenes/xy/sprites/animados-espalda/${this.state.activePoke}.gif`}
                    alt={this.state.activePoke}
                  ></img>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="pokemons">
          {this.props.team.map((pokemon) => {
            console.log(pokemon);
            return (
              <div
                className="poke-card"
                key={pokemon.name}
                onClick={() => this.firstTurn(pokemon.name)}
              >
                <div style={{ display: "flex", verticalAlign: "center" }}>
                  <img
                    src={`https://img.pokemondb.net/sprites/sword-shield/icon/${pokemon.name}.png`}
                    style={{ height: "45px", width: "auto" }}
                    alt={pokemon.name}
                  ></img>
                  <p style={{ margin: "auto" }}>{pokemon.name}</p>
                </div>

                {this.props.origTeam.map((pokemonOrig) => {
                  if (pokemonOrig.name === pokemon.name) {
                    return (
                      <div style={{ textAlign: "center" }}>
                        <p
                          style={{
                            width: `${
                              (pokemon.stats.hp / pokemonOrig.stats.hp) * 90
                            }%`,
                            backgroundColor: "green",
                            height: "6px",
                            margin: "auto",
                            marginTop: "8px",
                          }}
                        ></p>
                        <div>
                          {pokemon.stats.hp}/{pokemonOrig.stats.hp}
                        </div>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            );
          })}
        </div>
        <div className="moves"></div>
      </div>
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
  origTeam: state.auth.origTeam,
  socket: state.auth.socket,
});
export default connect(mapStateToProps)(BattleBox);
