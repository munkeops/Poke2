import React from "react";

import { Link } from "react-router-dom";
import "./homepage.styles.scss";
import { Layout } from "../layout";
import socketIO from "socket.io-client";
import { connect } from "react-redux";
import { setRoom, setTeam } from "../../actions/authActions";
import { Redirect } from "react-router";

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
      redirect: false,
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
      return 1;
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
  findGame = () => {
    if (!this.props.isAuthenticated) {
      return alert("You must be logged in to play a game");
    }

    const socket = socketIO("http://localhost:5000");
    socket.emit(
      "join",
      {
        username: this.props.user.username,
        team: this.state.teamList[this.state.activeTeam],
      },
      (room) => {
        console.log(room);
        this.props.setRoom({ room });
        socket.emit("play-turn", {
          username: this.props.user.username,
          room,
          gameStart: true,
        });

        console.log(this.props);
      }
    );

    socket.on("starting-game", ({ team, enemy, username }) => {
      console.log("USERS: ", username, this.props.user.username);
      if (this.props.user.username !== username) {
        console.log("WOW ENEMY");
        this.props.setTeam({ team: enemy, enemy: team });
      } else {
        this.props.setTeam({ team, enemy });
      }

      this.setState({ redirect: true });
    });
  };

  render() {
    const idArray = [...Array(100).keys()].map((x) => x + 1);
    const sixRange = [...Array(6).keys()];
    if (this.state.redirect) {
      return <Redirect to="/battle"></Redirect>;
    }
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
            <div className="start-btn" onClick={this.findGame}>
              Find game
            </div>
          </div>
          <Link to="/battle">GO TO BATTLE</Link>
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
                    return 1;
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

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  user: state.auth.user,
  room: state.auth.room,
});
export default connect(mapStateToProps, { setRoom, setTeam })(Homepage);
