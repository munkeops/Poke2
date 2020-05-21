import React from "react";

const StartCard = (props) => {
  return (
    <div className="start-card">
      <div className="selector" onClick={props.teamToggle}>
        <div className="team-list">
          {props.showTeams ? (
            <div>
              {props.teamList.map((team, index) => (
                <div
                  key={index}
                  className="team-prev"
                  onClick={() => props.setActive(index)}
                >
                  {team.map((pokemon) => (
                    <div key={pokemon.name} className="prev-poke">
                      <img
                        src={`https://img.pokemondb.net/sprites/sword-shield/icon/${pokemon.name}.png`}
                        alt={pokemon.name}
                      ></img>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="team-prev">
              {props.teamList[props.activeTeam].map((pokemon) => (
                <div key={pokemon.name} className="prev-poke">
                  <img
                    src={`https://img.pokemondb.net/sprites/sword-shield/icon/${pokemon.name}.png`}
                    alt={pokemon.name}
                  ></img>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartCard;
