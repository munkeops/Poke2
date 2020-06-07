const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const config = require("config");
const authMiddleware = require("./middleware/auth");

const User = require("./models/User");
const mongo_uri = config.get("mongoURI");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose.connect(
  mongo_uri,
  {
    socketTimeoutMS: 0,
    connectTimeoutMS: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("database connection successful");
    }
  }
);

app.get("/leaderboard",async (req,res)=>{
  data=[]

  await(User.find({},function(err,users){
    if(err){
      return res.json(err)
    }
    // console.log(users)
    for(i=0;i<users.length;i++){
      data.push({
        "username":users[i]["username"],
        "rating":users[i]["rank"]
      })
    
    }
   
  }))
  console.log(data.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating)).reverse())
  res.json(data)
});

app.get("/", (req, res) => {
  res.json({ hi: "GAY" });
});

let activePlayers = {};
let playerId = 0;

function damagecalc(attackObject, defendingPoke) {
  console.log("ATTACKING: ", attackObject.move);
  console.log("DEFENDING: ", defendingPoke);
  let damage_1 = ((2 * 10) / 5 + 2) * attackObject.move.power; //the calculation was split up in parts for better readability although it is the same as on the referenced website.
  let attackingPoke = attackObject.team.find((pokemon) => pokemon.active === 1);
  console.log("ATTACKING POKE: ", attackingPoke);
  let damage_2 = attackingPoke.stats.atk / defendingPoke.stats.def;
  damage = ((damage_1 * damage_2) / 50 + 2) * 3; // all calculations here are done in favor of "me" team due to it having higher speed
  return Math.round(damage);
}

io.on("connection", (socket) => {
  console.log("Connection accepted");

  //Check for the 'join' event which is emitted from the frontend, which sends across the username. ignore callback, that is only for error handling
  socket.on("join", ({ username, team }, callback) => {
    //Create a new dictionary entry for the user
    const newPlayer = {
      room: parseInt(playerId / 2),
      id: socket.id,
      username,
      status: "pending",
      team: team,
      origTeam: team,
      killCount: 0,
    };

    //Here, basically checking if the dictionary entry for that room already exists, if it doesn't we create a new one and populate it
    if (playerId % 2 === 0) {
      activePlayers[parseInt(playerId / 2)] = {};
    }
    activePlayers[parseInt(playerId / 2)][socket.id] = newPlayer;
    socket.join(parseInt(playerId / 2));
    playerId++;

    //Now, after the entry for that user is confirmed in the record, you will reply to the user with his room ID, which he will store in his browser
    callback(parseInt((playerId - 1) / 2));
  });

  //! When a player emits the 'play-turn' event, (in this case, typing a message and hitting send)
  //! he will send over his username and room ID. You will then find the relevant entry for that user in the dictionary and set the status to 'ready'
  //! If both players have their statuses as 'ready', you can proceed to execute what you want (in this case, logging 'YAY BOTH READY')
  socket.on(
    "play-turn",
    ({
      username,
      room,
      gameStart,
      firstTurn,
      selected,
      pokemon,
      move,
      changing,
    }) => {
      if (firstTurn) {
        console.log("FIRST TURN");
        console.log("selected:  ", selected);
      }
      activePlayers[room][socket.id].status = "ready";
      if (changing) {
        let prevSelected = activePlayers[room][socket.id].team.find(
          (pokemon) => pokemon.active === 1
        );
        prevSelected.active = 0;
        console.log("SETTING NEW ACTIVE");
        activePlayers[room][socket.id].changing = true;
      } else {
        activePlayers[room][socket.id].changing = false;
      }
      if (selected) {
        myPokemonIndex = activePlayers[room][socket.id].team.findIndex(
          (pokemon) => pokemon.name === selected
        );

        activePlayers[room][socket.id].team[myPokemonIndex].active = 1;
        console.log("confirming selection: ", selected);
        let activeBitches = activePlayers[room][socket.id].team.filter(
          (pokemon) => pokemon.active === 1
        );
      }

      let entries = Object.values(activePlayers[room]);
      if (move) {
        activePlayers[room][socket.id].move = move;
        activePlayers[room][socket.id].activePokemon = pokemon;
      }

      //Checking if both users in the room are ready, you can basically do the computation and emit an event here
      flag = true;
      if (entries.length < 2) {
        flag = false;
      }
      entries.map((entry) => {
        if (entry.status === "pending") {
          flag = false;
        }
      });
      if (flag === true) {
        if (gameStart) {
          let enemy = entries.filter((entry) => entry.id !== socket.id);
          activePlayers[room][socket.id].status = "pending";
          activePlayers[room][enemy[0].id].status = "pending";

          io.to(room).emit("starting-game", {
            team: activePlayers[room][socket.id].team,
            enemy: enemy[0].team,
            username,
          });
        } else if (firstTurn) {
          let myTeam = entries.find((entry) => entry.id === socket.id);
          let enemyTeam = entries.find((entry) => entry.id !== socket.id);

          let selectedPoke = myTeam.team.find(
            (pokemon) => pokemon.active === 1
          );
          let enemySelectedPoke = enemyTeam.team.find(
            (pokemon) => pokemon.active === 1
          );
          activePlayers[room][socket.id].status = "pending";
          activePlayers[room][enemyTeam.id].status = "pending";
          io.to(room).emit("first-turn", {
            selectedPoke,
            enemySelectedPoke,
            username,
          });
        } else {
          let myTeam = entries.find((entry) => entry.id === socket.id);
          let enemyTeam = entries.find((entry) => entry.id !== socket.id);
          let selectedPoke = myTeam.team.find(
            (pokemon) => pokemon.active === 1
          );
          let enemySelectedPoke = enemyTeam.team.find(
            (pokemon) => pokemon.active === 1
          );
          let myMove, enemyMove;
          if (myTeam.move) {
            myMove = myTeam.move;
          }
          if (enemyTeam.move) {
            enemyMove = enemyTeam.move;
          }
          console.log("MY SELECTION: ", selectedPoke.name);
          console.log("ENEMY SELECTION: ", enemySelectedPoke.name);
          console.log("MY MOVE: ", myMove);
          console.log("ENEMY MOVE: ", enemyMove);
          //////// ! Damage calculation (DUMMY)
          let myStats = selectedPoke.stats;
          let enemyStats = enemySelectedPoke.stats;
          // ! In this case, myPlayer is the player whose move was registered second by the server
          if (myTeam.changing && !enemyTeam.changing) {
            //If 1 player is switching a pokemon
            myStats.hp -= damagecalc(enemyTeam, selectedPoke); // TODO: Reduce the incoming Pokemons HP after calc
            let firstMove = enemySelectedPoke;
            console.log("MY TEAM CHANGE");
            if (myStats.hp <= 0) {
              activePlayers[room][socket.id].status = "pending";
              selectedPoke.active = 0;
              enemyTeam.killCount += 1;

              return io.to(room).emit("death", {
                username: enemyTeam.username,
                deadPoke: selectedPoke,
                myMove,
                enemyMove,
                firstMove,
              });
            }
            activePlayers[room][socket.id].status = "pending";
            activePlayers[room][enemyTeam.id].status = "pending";
            let myIndex = myTeam.team.findIndex(
              (pokemon) => pokemon.active === 1
            );
            let enemyIndex = enemyTeam.team.findIndex(
              (pokemon) => pokemon.active === 1
            );
            myTeam.team[myIndex].stats = myStats;
            enemyTeam.team[enemyIndex].stats = enemyStats;

            return io.to(room).emit("first-turn", {
              selectedPoke: myTeam.team[myIndex],
              enemySelectedPoke: enemyTeam.team[enemyIndex],
              username,
              myMove,
              enemyMove,
              firstMove,
            });
          }

          if (enemyTeam.changing && !myTeam.changing) {
            enemyStats.hp -= damagecalc(myTeam, enemySelectedPoke); //TODO: Reduce the incoming Pokemon HP after calc
            let firstMove = selectedPoke;
            if (enemyStats.hp <= 0) {
              activePlayers[room][enemyTeam.id].status = "pending";
              enemySelectedPoke.active = 0;
              myTeam.killCount += 1;

              return io.to(room).emit("death", {
                username: myTeam.username,
                deadPoke: enemySelectedPoke,
                myMove,
                enemyMove,
                firstMove,
              });
            }
            activePlayers[room][socket.id].status = "pending";
            activePlayers[room][enemyTeam.id].status = "pending";
            let myIndex = myTeam.team.findIndex(
              (pokemon) => pokemon.active === 1
            );
            let enemyIndex = enemyTeam.team.findIndex(
              (pokemon) => pokemon.active === 1
            );

            console.log("EMITTING EVENT ON POKEMON CHANGE");
            myTeam.team[myIndex].stats = myStats;
            enemyTeam.team[enemyIndex].stats = enemyStats;
            return io.to(room).emit("first-turn", {
              selectedPoke: myTeam.team[myIndex],
              enemySelectedPoke: enemyTeam.team[enemyIndex],
              username,
              myMove,
              enemyMove,
              firstMove,
            });
          }

          if (enemyTeam.changing && myTeam.changing) {
            //! If both players are changing pokemon
            let myIndex = myTeam.team.findIndex(
              (pokemon) => pokemon.active === 1
            );
            let enemyIndex = enemyTeam.team.findIndex(
              (pokemon) => pokemon.active === 1
            );
            myTeam.team[myIndex].stats = myStats;
            enemyTeam.team[enemyIndex].stats = enemyStats;
            console.log("EMITTING EVENT ON POKEMON CHANGE");
            return io.to(room).emit("first-turn", {
              myPoke: myTeam.team[myIndex],
              enemyPoke: enemyTeam.team[enemyIndex],
              username,
              myMove,
              enemyMove,
              firstMove: null,
            });
          }
          if (myStats.spe >= enemyStats.spe) {
            //! If neither are changing pokemon
            enemyStats.hp -= damagecalc(myTeam, enemySelectedPoke); //TODO If this players pokemon is faster, calc enemy hp.
            let firstMove = selectedPoke;
            if (enemyStats.hp <= 0) {
              activePlayers[room][enemyTeam.id].status = "pending";
              enemySelectedPoke.active = 0;
              myTeam.killCount += 1;
              if (myTeam.killCount === 6) {
                return io.to(room).emit("win", {
                  username: myTeam.username,
                  myMove,
                  enemyMove,
                });
              }
              return io.to(room).emit("death", {
                username: myTeam.username,
                deadPoke: enemySelectedPoke,
                myMove,
                enemyMove,
                firstMove,
              });
            }
            myStats.hp -= damagecalc(enemyTeam, selectedPoke); //TODO If after taking above damage, the "enemy" pokemon doesn't die,
            // TODO Calc the other guys hp reduction
            if (myStats.hp <= 0) {
              activePlayers[room][socket.id].status = "pending";
              selectedPoke.active = 0;
              enemyTeam.killCount += 1;
              if (enemyTeam.killCount === 6) {
                return io.to(room).emit("win", {
                  username: enemyTeam.username,
                  myMove,
                  enemyMove,
                });
              }
              return io.to(room).emit("death", {
                username: enemyTeam.username,
                deadPoke: selectedPoke,
                myMove,
                enemyMove,
                firstMove,
              });
            }
            activePlayers[room][socket.id].status = "pending";
            activePlayers[room][enemyTeam.id].status = "pending";
            let myIndex = myTeam.team.findIndex(
              (pokemon) => pokemon.active === 1
            );
            let enemyIndex = enemyTeam.team.findIndex(
              (pokemon) => pokemon.active === 1
            );
            myTeam.team[myIndex].stats = myStats;
            enemyTeam.team[enemyIndex].stats = enemyStats;
            return io.to(room).emit("next-turn", {
              myPoke: myTeam.team[myIndex],
              enemyPoke: enemyTeam.team[enemyIndex],
              username,
              myMove,
              enemyMove,
              firstMove,
            });
          } else if (myStats.spe <= enemyStats.spe) {
            myStats.hp -= damagecalc(enemyTeam, selectedPoke); //TODO Inverse of previous case. calculate hp reduction for "myStats" based on "enemyStats" first
            let firstMove = enemySelectedPoke;
            if (myStats.hp <= 0) {
              activePlayers[room][socket.id].status = "pending";
              selectedPoke.active = 0;
              enemyTeam.killCount += 1;
              if (enemyTeam.killCount === 6) {
                return io.to(room).emit("win", {
                  username: enemyTeam.username,
                  myMove,
                  enemyMove,
                });
              }
              return io.to(room).emit("death", {
                username: enemyTeam.username,
                deadPoke: selectedPoke,
                myMove,
                enemyMove,
                firstMove,
              });
            }
            enemyStats.hp -= damagecalc(myTeam, enemySelectedPoke); //TODO: Following the previous calculation
            if (enemyStats.hp <= 0) {
              activePlayers[room][enemyTeam.id].status = "pending";
              enemySelectedPoke.active = 0;
              myTeam.killCount += 1;
              if (myTeam.killCount === 6) {
                return io.to(room).emit("win", {
                  username: myTeam.username,
                  myMove,
                  enemyMove,
                });
              }
              return io.to(room).emit("death", {
                username: myTeam.username,
                deadPoke: enemySelectedPoke,
                myMove,
                enemyMove,
                firstMove,
              });
            }
            activePlayers[room][socket.id].status = "pending";
            activePlayers[room][enemyTeam.id].status = "pending";
            let myIndex = myTeam.team.findIndex(
              (pokemon) => pokemon.active === 1
            );
            let enemyIndex = enemyTeam.team.findIndex(
              (pokemon) => pokemon.active === 1
            );
            myTeam.team[myIndex].stats = myStats;
            enemyTeam.team[enemyIndex].stats = enemyStats;
            return io.to(room).emit("next-turn", {
              myPoke: myTeam.team[myIndex],
              enemyPoke: enemyTeam.team[enemyIndex],
              username,
              myMove,
              enemyMove,
              firstMove,
            });
          }
        }
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("Connection lost");
    let foundRoom;
    for (let [room, entry] of Object.entries(activePlayers)) {
      for (let socketId of Object.keys(entry)) {
        if (socketId === socket.id) {
          foundRoom = room;
        }
      }
    }
    if (foundRoom) {
      let entries = Object.values(activePlayers[foundRoom]);
      let enemyPlayer = entries.find((entry) => entry.id !== socket.id);
      console.log("FOUND ROOM, EMITTING WIN ON DC");
      io.to(foundRoom).emit("win", {
        username: enemyPlayer.username,
      });
      delete activePlayers[foundRoom];
    }
    return 0;
  });
});

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

http.listen(
  process.env.PORT || 5000
  // 5000, () => console.log("Server is listening at port 5000")
);
