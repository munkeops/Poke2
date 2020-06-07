import React, { useEffect, useState } from "react";

import { Layout } from "../layout";

const Leaderboard = () => {
  const [leaderBoard, setLeaderBoard] = useState(null);
  useEffect(() => {
    fetch("https://poke2se-server.herokuapp.com/leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaderBoard(data));
  }, [setLeaderBoard]);

  return (
    <Layout>
      <div className="leaderboard">
        {leaderBoard ? (
          leaderBoard.map((userObj) => (
            <div className="lb-row">
              <div className="lb-item">{userObj.username}</div>
              <div className="lb-item">{userObj.rating}</div>
            </div>
          ))
        ) : (
          <div>LOADING</div>
        )}
        {}
      </div>
    </Layout>
  );
};

export default Leaderboard;
