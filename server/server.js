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

app.get("/", (req, res) => {
  res.json({ hi: "GAY" });
});

let activePlayers = {};
let playerId = 0;

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
    ({ username, room, gameStart, firstTurn, selected, stats }) => {
      if (firstTurn) {
        console.log("FIRST TURN");
        console.log("selected:  ", selected);
      }
      activePlayers[room][socket.id].status = "ready";
      if (selected) {
        myPokemonIndex = activePlayers[room][socket.id].team.findIndex(
          (pokemon) => pokemon.name === selected
        );
        console.log(myPokemonIndex);
        activePlayers[room][socket.id].team[myPokemonIndex].active = 1;
      }

      let entries = Object.values(activePlayers[room]);

      console.log(entries);
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
          console.log(activePlayers);
          io.to(room).emit("starting-game", {
            team: activePlayers[room][socket.id].team,
            enemy: enemy[0].team,
            username,
          });
        } else if (firstTurn) {
          let myTeam = entries.find((entry) => entry.id === socket.id);
          let enemyTeam = entries.find((entry) => entry.id !== socket.id);
          console.log(myTeam.team);
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
        }
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("Connection lost");
  });
});

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

http.listen(5000, () => console.log("Server is listening at port 5000"));
