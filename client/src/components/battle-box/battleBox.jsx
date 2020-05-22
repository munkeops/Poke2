import React from "react";
import { connect } from "react-redux";

import "./battleBox.styles.scss";
import { updateTeam } from "../../actions/authActions";
class BattleBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePoke: null,
      enemySelected: null,
      origTeam: this.props.origTeam,
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

    this.setState({ activePoke: selectedPoke });
    socket.on("first-turn", ({ selectedPoke, enemySelectedPoke, username }) => {
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

  commit = (move) => {
    const socket = this.props.socket;

    socket.emit("play-turn", {
      username: this.props.user.username,
      room: this.props.room,
      move,
    });

    socket.on("next-turn", ({ myStats, enemyStats, username }) => {
      let stats, oppStats;
      if (this.props.user.username === username) {
        stats = myStats;
        oppStats = enemyStats;
        let newActivePoke = this.state.activePoke;
        newActivePoke.stats = stats;
        let newOppPoke = this.state.enemySelected;
        newOppPoke.stats = enemyStats;
        let myIndex = this.props.team.findIndex(
          (pokemon) => pokemon.name === newActivePoke.name
        );
        console.log("INDEX FOUND: ", myIndex);
        let prevTeam = this.props.team;
        prevTeam[myIndex] = newActivePoke;
        this.props.updateTeam(prevTeam);
        return this.setState({
          activePoke: newActivePoke,
          enemySelected: newOppPoke,
        });
      }
      stats = enemyStats;
      oppStats = myStats;
      let newActivePoke = this.state.activePoke;
      newActivePoke.stats = stats;
      let newOppPoke = this.state.enemySelected;
      newOppPoke.stats = enemyStats;
      let myIndex = this.props.team.findIndex(
        (pokemon) => pokemon.name === newActivePoke.name
      );
      console.log("INDEX FOUND: ", myIndex);
      let prevTeam = this.props.team;
      prevTeam[myIndex] = newActivePoke;
      this.props.updateTeam(prevTeam);
      return this.setState({
        activePoke: newActivePoke,
        enemySelected: newOppPoke,
      });
    });
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
                  {" "}
                  <div
                    style={{
                      height: "15px",
                      width: "100%",
                      backgroundColor: "grey",
                    }}
                  >
                    <div
                      style={{
                        height: "15px",
                        backgroundColor: "#388e3c",
                        width: `${
                          (this.state.enemySelected.stats.hp /
                            this.state.enemySelected.stats.hpTotal) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div>
                    {this.state.enemySelected.stats.hp} /{" "}
                    {this.state.enemySelected.stats.hpTotal}
                  </div>
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
                  <div
                    style={{
                      height: "15px",
                      width: "100%",
                      backgroundColor: "grey",
                    }}
                  >
                    <div
                      style={{
                        height: "15px",
                        backgroundColor: "#388e3c",
                        width: `${
                          (this.state.activePoke.stats.hp /
                            this.state.activePoke.stats.hpTotal) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>

                  <div>
                    {this.state.activePoke.stats.hp}/
                    {this.state.activePoke.stats.hpTotal}
                  </div>
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
                <div>
                  <p
                    style={{
                      width: `${
                        (pokemon.stats.hp / pokemon.stats.hpTotal) * 90
                      }%`,
                      backgroundColor: "green",
                      height: "6px",
                      marginLeft: "0",
                      marginTop: "8px",
                    }}
                  ></p>
                  <div>
                    {pokemon.stats.hp} / {pokemon.stats.hpTotal}
                    {/* {this.state.activePoke ? (
                            pokemonOrig.name === this.state.activePoke.name ? (
                              <p>
                                {this.state.activePoke.stats.hp} /{" "}
                                {pokemonOrig.stats.hp}
                              </p>
                            ) : (
                              <p>{pokemonOrig.stats.hp}</p>
                            )
                          ) : (
                            <p>
                              {pokemonOrig.stats.hp} / {pokemonOrig.stats.hp}
                            </p>
                          )} */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="moves">
          {this.state.enemySelected === null ? (
            <div></div>
          ) : (
            this.state.activePoke.moves.map((move) => {
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
                  onClick={() => this.commit(move)}
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
export default connect(mapStateToProps, { updateTeam })(BattleBox);
