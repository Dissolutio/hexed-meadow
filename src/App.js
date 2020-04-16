import React, { useState } from "react";
import { Client, Lobby } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { SocketIO } from "boardgame.io/multiplayer";

import { HexedMeadow } from "./game/game";
import Board from "./ui/Board";

import "normalize.css";
import "./index.css";

export const App = () => {
  const [playerID, setPlayerID] = useState("");
  const [gameID, setGameID] = useState("");
  const handleGameIDInput = (e) => {
    console.log("%c⧭", "color: #f200e2", e);
    setGameID(e.target.value);
  };
  if (playerID === "") {
    return (
      <div>
        <label>
          Game ID:
          <input
            type="text"
            value={gameID}
            name={"gameID"}
            onChange={handleGameIDInput}
          />
        </label>
        <div style={{ padding: "1rem" }}>
          <button onClick={() => setPlayerID("0")}>BEES</button>
          <button onClick={() => setPlayerID("1")}>BUTTERFLIES</button>
        </div>
      </div>
    );
  }
  if (playerID === "0") {
    return <HexedMeadowClient gameID={gameID} playerID={playerID} />;
  }
  if (playerID === "1") {
    return <HexedMeadowClient gameID={gameID} playerID={playerID} />;
  }
};
// return <MainLobby />
const LoadingComponent = (props) => {
  return <div>Connecting...</div>;
};

const HexedMeadowClient = Client({
  game: HexedMeadow,
  numPlayers: 2,
  loading: LoadingComponent,
  board: Board,
  // multiplayer: Local(),
  multiplayer: SocketIO({ server: "http://localhost:8000" }),
  // multiplayer: SocketIO({ server: 'https://hexed-meadow-server.herokuapp.com/' }),
  debug: false,
  enhancer:
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
});

const MainLobby = () => {
  return (
    <Lobby
      gameServer={`http://localhost:8000`}
      lobbyServer={`http://localhost:8000`}
      // gameServer={`https://hexed-meadow.herokuapp.com/`}
      // lobbyServer={`https://hexed-meadow.herokuapp.com/`}
      gameComponents={[{ game: HexedMeadow, board: Board }]}
    />
  );
};
