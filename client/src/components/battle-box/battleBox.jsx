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
    socket.on("first-turn", ({ selectedPoke, enemySelectedPoke, username }) => {
      console.log(enemySelectedPoke, selectedPoke, username);
      if (this.props.user.username === username) {
        this.setState({
          activePoke: selectedPoke,
          enemySelected: enemySelectedPoke,
        });
      } else {
        this.setState({
          enemySelected: selectedPoke,
          activePoke: enemySelectedPoke,
        });
      }
    });
  };

  setColor = (type) => {
    switch (type) {
      case "water":
        return ["#4fc3f7", "white"];
      case "fire":
        return ["#ef9a9a", "black"];
      case "grass":
        return ["#dce775", "black"];
      case "normal":
        return ["#e0e0e0", "black"];
      case "fighting":
        return ["#b71c1c", "white"];
      case "flying":
        return ["#9fa8da", "black"];
      case "poison":
        return ["#9c27b0", "white"];
      case "electric":
        return ["#ffeb3b", "black"];
      case "ground":
        return ["#5d4037", "white"];
      case "psychic":
        return ["#f50057", "white"];
      case "rock":
        return ["#bf360c", "white"];
      case "ice":
        return ["#80deea", "black"];
      case "bug":
        return ["#9e9d24", "black"];
      case "dragon":
        return ["#6a1b9a", "white"];
      case "ghost":
        return ["#4a148c", "white"];
      case "dark":
        return ["#263238", "white"];
      case "steel":
        return ["#424242", "white"];
      case "fairy":
        return ["#f8bbd0", "black"];
    }
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
                      key={pokemon.name}
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
                    src={`http://www.pkparaiso.com/imagenes/xy/sprites/animados/${this.state.enemySelected.name}.gif`}
                    alt={this.state.enemySelected.name}
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
                    src={`http://www.pkparaiso.com/imagenes/xy/sprites/animados-espalda/${this.state.activePoke.name}.gif`}
                    alt={this.state.activePoke.name}
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
        <div className="moves">
          {this.state.enemySelected === null ? (
            <div></div>
          ) : (
            this.state.activePoke.moves.map((move) => {
              console.log(move);
              let typeBg = this.setColor(move.moveType);
              return (
                <div
                  key={move.name}
                  style={{
                    backgroundColor: `${typeBg[0]}`,
                    color: `${typeBg[1]}`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    margin: "1rem",
                    padding: "0.75rem",
                    border: "1px solid black",
                    borderRadius: "16px",
                  }}
                >
                  <div>{move.name}</div>

                  <div style={{ display: "flex" }}>
                    <div style={{ padding: "5px", border: "1px solid black" }}>
                      {move.type}
                    </div>
                    <div style={{ margin: "auto" }}>{move.power}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
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
