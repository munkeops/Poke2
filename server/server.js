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
app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose.connect(
  mongo_uri,
  {
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

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

app.listen(5000, () => console.log("Server is listening at port 5000"));
