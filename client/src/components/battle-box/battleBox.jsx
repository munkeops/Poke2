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
        <div className="pokemons">
          {this.props.team.map((pokemon) => {
            console.log(pokemon);
            return (
              <div className="poke-card">
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
                      <div>
                        <p
                          style={{
                            width: `${
                              (pokemon.stats.hp / pokemonOrig.stats.hp) * 100
                            }%`,
                            backgroundColor: "green",
                            height: "6px",
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

export default BattleBox;
