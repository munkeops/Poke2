import React from "react";
import { connect } from "react-redux";

import "./battleBox.styles.scss";
import { updateTeam } from "../../actions/authActions";
import { Redirect } from "react-router";
import { withRouter } from "react-router-dom";

class BattleBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePoke: null,
      enemySelected: null,
      origTeam: this.props.origTeam,
      disabled: false,
      dead: false,
      gameStart: true,
      gameEnd: false,
      redirect: false,
    };
  }
  componentWillMount() {
    try {
      if (this.props.enemy === undefined) {
        this.props.history.push("/");
      }
    } catch (err) {
      this.props.history.push("/");
    }
  }
  firstTurn = (name) => {
    const socket = this.props.socket;

    let selectedPoke = this.props.team.find((pokemon) => pokemon.name === name);
    selectedPoke.active = 1;
    let prevSelected = this.state.activePoke;
    if (prevSelected && selectedPoke.name !== prevSelected.name) {
      prevSelected.active = 0;
    }
    if (selectedPoke.dead) {
      return alert(`${name} is dead!, choose a different pokemon`);
    }

    this.setState({ disabled: true });
    if (!this.state.dead && !this.state.gameStart) {
      socket.emit("play-turn", {
        username: this.props.user.username,
        room: this.props.room,
        firstTurn: true,
        selected: name,
        changing: true,
      });
    } else {
      socket.emit("play-turn", {
        username: this.props.user.username,
        room: this.props.room,
        firstTurn: true,
        selected: name,
      });
    }

    this.setState({ activePoke: selectedPoke, dead: false });
    socket.on(
      "first-turn",
      ({ selectedPoke, enemySelectedPoke, username, myMove, enemyMove }) => {
        if (this.props.user.username === username) {
          console.log("MY MOVE: ", myMove, "ENEMY MOVE: ", enemyMove);
          let myIndex = this.props.team.findIndex(
            (pokemon) => pokemon.name === selectedPoke.name
          );

          let prevTeam = this.props.team;
          prevTeam[myIndex] = selectedPoke;
          this.props.updateTeam(prevTeam);
          this.setState({
            activePoke: selectedPoke,
            enemySelected: enemySelectedPoke,
            disabled: false,
            gameStart: false,
          });
        } else {
          console.log("MY MOVE: ", enemyMove, "ENEMY MOVE: ", myMove);
          let myIndex = this.props.team.findIndex(
            (pokemon) => pokemon.name === enemySelectedPoke.name
          );

          let prevTeam = this.props.team;
          prevTeam[myIndex] = enemySelectedPoke;
          this.props.updateTeam(prevTeam);
          this.setState({
            enemySelected: selectedPoke,
            activePoke: enemySelectedPoke,
            disabled: false,
            gameStart: false,
          });
        }
      }
    );
  };

  setColor = (type) => {
    switch (type) {
      case "water":
        return ["#1aafe1", "white"];
      case "fire":
        return ["#f58c1f", "black"];
      case "grass":
        return ["#54b947", "black"];
      case "normal":
        return ["#cecece", "black"];
      case "fighting":
        return ["#b92025", "white"];
      case "flying":
        return ["#1487b4", "black"];
      case "poison":
        return ["#9c27b0", "white"];
      case "electric":
        return ["#f5b915", "black"];
      case "ground":
        return [" #b56528", "white"];
      case "psychic":
        return [" #c03695", "white"];
      case "rock":
        return ["#a7a097", "black"];
      case "ice":
        return ["#63cdf6", "black"];
      case "bug":
        return ["#54b947", "black"];
      case "dragon":
        return ["#6a1b9a", "white"];
      case "ghost":
        return ["#4a148c", "white"];
      case "dark":
        return [" #b11f83", "white"];
      case "steel":
        return [" #8b7e72", "white"];
      case "fairy":
        return ["#f6e494", "black"];
      default:
        return ["#cecece", "black"];
    }
  };

  commit = (move) => {
    const socket = this.props.socket;
    this.setState({ disabled: true });
    socket.emit("play-turn", {
      username: this.props.user.username,
      room: this.props.room,
      move,
    });

    socket.on(
      "next-turn",
      ({ myPoke, enemyPoke, username, myMove, enemyMove }) => {
        if (this.props.user.username === username) {
          console.log("MY MOVE: ", myMove, "ENEMY MOVE: ", enemyMove);
          let myIndex = this.props.team.findIndex(
            (pokemon) => pokemon.name === myPoke.name
          );

          let prevTeam = this.props.team;
          prevTeam[myIndex] = myPoke;
          this.props.updateTeam(prevTeam);
          return this.setState({
            activePoke: myPoke,
            enemySelected: enemyPoke,
            disabled: false,
          });
        }
        console.log("MY MOVE: ", enemyMove, "ENEMY MOVE: ", myMove);
        let myIndex = this.props.team.findIndex(
          (pokemon) => pokemon.name === enemyPoke.name
        );

        let prevTeam = this.props.team;
        prevTeam[myIndex] = enemyPoke;
        this.props.updateTeam(prevTeam);
        return this.setState({
          activePoke: enemyPoke,
          enemySelected: myPoke,
          disabled: false,
        });
      }
    );

    socket.on("death", ({ username, deadPoke, myMove, enemyMove }) => {
      if (this.props.user.username !== username) {
        console.log("MY MOVE: ", enemyMove, "ENEMY MOVE: ", myMove);
        let updatedTeam = this.props.team;
        let dead = updatedTeam.find(
          (pokemon) => pokemon.name === deadPoke.name
        );
        dead.dead = true;
        dead.active = 0;

        this.setState({ disabled: false, activePoke: null, dead: true });
      } else {
        console.log("MY MOVE: ", myMove, "ENEMY MOVE: ", enemyMove);
        this.setState({ enemySelected: null });
      }
    });

    socket.on("win", ({ username, myMove, enemyMove }) => {
      this.setState({ redirect: true });
      if (this.props.user.username === username) {
        console.log("MY MOVE: ", myMove, "ENEMY MOVE: ", enemyMove);
        return alert("You win, your rating has increased");
      } else {
        console.log("MY MOVE: ", enemyMove, "ENEMY MOVE: ", myMove);
        return alert("You lose, your rating has decreased");
      }
    });
  };

  healthColor = (hp, hpTotal) => {
    console.log(hp / hpTotal);
    if (hp / hpTotal < 0.25) {
      return "red";
    }
    if (hp / hpTotal > 0.5) {
      return "green";
    }
    return "yellow";
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <div className="battle-box">
        <div className="bb-left">
          <h2>Room #{this.props.room}</h2>
          <div className="battle">
            {this.state.gameStart ? (
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
                        key={pokemon.name}
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
                {this.state.enemySelected ? (
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
                ) : null}
                {this.state.activePoke ? (
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
                ) : null}
              </div>
            )}
          </div>
          {this.state.disabled ? null : (
            <div className="pokemons">
              {this.props.team.map((pokemon) => {
                if (pokemon.dead) {
                  pokemon.stats.hp = 0;
                }
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
                        className="healthbar"
                        style={{
                          width: `${
                            (pokemon.stats.hp / pokemon.stats.hpTotal) * 90
                          }%`,
                          backgroundColor: this.healthColor(
                            pokemon.stats.hp,
                            pokemon.stats.hpTotal
                          ),
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
          )}
        </div>
        <div className="bb-right">
          {this.state.disabled ? null : (
            <div className="moves">
              {this.state.enemySelected === null || this.state.dead ? (
                <div></div>
              ) : (
                this.state.activePoke.moves.map((move) => {
                  let typeBg = this.setColor(move.moveType);
                  return (
                    <div
                      key={move.name}
                      className="move"
                      style={{
                        backgroundColor: `${typeBg[0]}`,
                        color: `${typeBg[1]}`,
                      }}
                      onClick={() => this.commit(move)}
                    >
                      <div>{move.name}</div>

                      <div style={{ display: "flex" }}>
                        <div
                          style={{ padding: "5px", border: "1px solid black" }}
                        >
                          {move.type}
                        </div>
                        <div style={{ margin: "auto" }}>pow: {move.power}</div>
                        <div style={{ margin: "auto" }}>
                          acc: {move.accuracy}%
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
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
export default withRouter(connect(mapStateToProps, { updateTeam })(BattleBox));
