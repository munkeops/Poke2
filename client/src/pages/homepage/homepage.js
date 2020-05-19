import React from "react";

import "./homepage.styles.scss";
import { Layout } from "../layout";

import StartCard from "../../components/start-card/startCard";

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTeams: false,
      teamList: [
        [
          { name: "alakazam" },
          { name: "parasect" },
          { name: "nidorino" },
          { name: "spearow" },
          { name: "raticate" },
          { name: "mankey" },
        ],

        [
          { name: "rhydon" },
          { name: "liepard" },
          { name: "cherubi" },
          { name: "swablu" },
          { name: "corsola" },
          { name: "marshtomp" },
        ],
      ],
      activeTeam: 0,
      pokeData: [],
      newTeam: [],
    };
  }

  async componentDidMount() {
    const idArray = [...Array(100).keys()].map((x) => x + 1);
    idArray.map((id) => {
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((res) => res.json())
        .then((data) => {
          let joined = this.state.pokeData.concat({
            stats: data.stats,
            name: data.name,
            img: data.sprites.front_default,
            id: data.id,
          });
          this.setState({
            pokeData: joined,
          });
        })
        .then((res) => {
          let sortedData = this.state.pokeData.sort((a, b) =>
            a.id > b.id ? 1 : -1
          );
          this.setState({ pokeData: sortedData });
        });
    });
  }
  showTeams = () => this.setState({ showTeams: !this.state.showTeams });
  setActive = (index) => this.setState({ activeTeam: index });

  updateTeam = (name) => {
    this.setState({ newTeam: this.state.newTeam.concat({ name: name }) });
  };
  renderCreation = (member) => {
    let pokemon = this.state.pokeData.find((item) => item.name === member.name);
    return (
      <div className="cp-poke">
        <h3>{pokemon.name}</h3>
      </div>
    );
  };
  saveTeam = () => {
    this.setState({
      teamList: this.state.teamList.concat([this.state.newTeam]),
      newTeam: [],
    });
  };

  render() {
    const idArray = [...Array(100).keys()].map((x) => x + 1);
    const sixRange = [...Array(6).keys()];

    return (
      <Layout>
        <div className="homepage-container">
          <div className="play-half">
            <StartCard
              teamToggle={this.showTeams}
              setActive={this.setActive}
              showTeams={this.state.showTeams}
              teamList={this.state.teamList}
              activeTeam={this.state.activeTeam}
            />
          </div>
          <div className="selection-half">
            <div className="selection-container">
              <div className="cur-team"></div>
              <div className="save-button" onClick={this.saveTeam}>
                SAVE TEAM
              </div>
              <div className="poke-finder">
                <div className="searchbox"></div>
                <div className="creation-prev">
                  {this.state.newTeam.map((member) =>
                    this.renderCreation(member)
                  )}
                </div>
                {this.state.pokeData.length < 100 ? (
                  <div>LOADING ... </div>
                ) : (
                  idArray.map((arrayId) => {
                    if (this.state.pokeData[arrayId]) {
                      return (
                        <div
                          className="poke-row"
                          key={this.state.pokeData[arrayId].id}
                          onClick={() =>
                            this.updateTeam(this.state.pokeData[arrayId].name)
                          }
                        >
                          <div className="single-stat">
                            #{this.state.pokeData[arrayId].id}{" "}
                            {this.state.pokeData[arrayId].name}
                          </div>
                          {sixRange.map((index) => {
                            return (
                              <div
                                className="single-stat"
                                key={
                                  this.state.pokeData[arrayId].stats[index].stat
                                    .name
                                }
                              >
                                {
                                  this.state.pokeData[arrayId].stats[index]
                                    .base_stat
                                }
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Homepage;
