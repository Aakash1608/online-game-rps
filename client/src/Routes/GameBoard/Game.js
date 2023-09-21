import React, { useEffect, useState } from "react";
import { socket } from "../../socket";
import Loader from "../loader/Loader";
import paper from "./media/paper.svg";
import scissor from "./media/scissors.svg";
import rock from "./media/rock.svg";
import "./game.css";
const Game = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [finding, setFinding] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [opponent, setOpponent] = useState("");
  const [winner, setWinner] = useState("");
  const [choiceMade, setChoiceMade] = useState(false);
  const [choices, setChoice] = useState("");
  const [oppoChoice, setOppoChoice] = useState("");
  const name = localStorage.getItem("username");
  const [randomNum, setRandomNum] = useState(0)
  let [selfCount, setSelfCount] = useState(0);
  let [oppoCount, setOppocount] = useState(0);
  let [round, setRound] = useState(1);
  let val = 0;
  useEffect(() => {
    
    const arr = [0, 1, 2];
    
    setInterval(() => {
      setRandomNum(val%3);
      // console.log(val);
      // console.log(randomNum);
      val++;
    }, 6000)
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }
    socket.on("connect", onConnect);
    
    // finding game
    if(localStorage.getItem('game-status') != 'game-started'){
      if(groupId != ""){
        socket.emit("game-left", {
          groupId: groupId,
          username: name
        })
      }
      window.location.href = "/";
    }
    socket.on('game-left', (data) => {
      alert(`User - ${data.username} has left the game. Taking you back to the homapage`)
      window.location.href = "/";
    })
    socket.on("finding-game", (data) => {
      setFinding(true);
    });
    // game found
    socket.on("game-set", (data) => {
      setFinding(false);
      const group = data.groupId;
      setGroupId(group);
      console.log(data);
      window.localStorage.setItem('game-status', 'playing')
      let op = data.user.find((u) => u != name);
      setOpponent(op);
    });
    socket.on("result", (data) => {
      let self = data.userDetail.find((i) => i.username == name)
      let op = data.userDetail.find((i) => i.username != name)
      console.log("self shit", self)
      console.log("op shit", op)
      setOppoChoice(op.choice);
      setSelfCount(self.wins);
      setOppocount(op.wins);
      if(self.wins >= 3){
        socket.emit("final-winner", {
          groupId: data.groupId,
          username: name
        })
      }else {
        setTimeout(() => {
          setRound(data.gameDetail.round);
          setChoice("")
          setOppoChoice("");
          setChoiceMade(false)
        }, 2000)
      }
      
    });
    socket.on("final-winner", (data) => {
      setWinner(data.username);
      window.localStorage.setItem('winner', data.username);
      window.localStorage.setItem('game-status', 'completed')
      window.location.href = '/results'})
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("finding-game", (data) => {
        setFinding(true);
      });
      // game found
      socket.off("game-set", (data) => {
        setFinding(false);
        const group = data.groupId;
        setGroupId(group);
        let op = data.user.find((u) => u != name);
        setOpponent(op);
      });
    };
  }, []);
  const handleSelect = (e) => {
    
    let choice = e.target.getAttribute("value");
    setChoice(e.target.getAttribute("value"));
    setChoiceMade(true);
    let obj = {
      groupId: groupId,
      userDetail: {
        username: name,
        choice: choice,
        wins: selfCount
      },
      gameDetail: {
        round: round
      }
    };
    socket.emit("choice", obj);
  };
  return (
    <div className="gameboard">
      {finding ? (
        <Loader />
      ) : (
        <>
          <div className="game-screen-1">
            <h2>{name}</h2>
            <div className="image-container-game">
              {choiceMade ? (
                choices == "paper" ? (
                  <img src={paper} alt="" className="main-image-game" />
                ) : choices == "scissor" ? (
                  <img src={scissor} alt="" className="main-image-game" />
                ) : (
                  <img src={rock} style={{width: "18vw", height:"auto"}} alt="" className="main-image-game" />
                )
              ) : (
                <>
                  <img id="game-scissor" src={scissor} alt="" />
                  <div>
                    <img id="game-rock" src={rock} alt="" />
                    <img id="game-paper" src={paper} alt="" />
                  </div>
                </>
              )}
            </div>
            <p>Choose one</p>
            
            {
              !choiceMade && (<div>
                <img
              className="choices-img"
              value="rock"
              onClick={(e) => handleSelect(e)}
              src={rock}
              alt=""
            />
            <img
              className="choices-img"
              value="paper"
              style={{margin: "0 2vw"}}
              onClick={(e) => handleSelect(e)}
              src={paper}
              alt=""
            />
            <img
              className="choices-img"
              value="scissor"
              onClick={(e) => handleSelect(e)}
              src={scissor}
              alt=""
            /></div>
              )
            }
            
            <h3>Score - {selfCount}</h3>
          </div>
          {
            winner == "" ? 
            <h1>Round - {round}</h1> : 
            <div>
              <h2>Winner - {winner}</h2>
            </div>
          }
          <div className="game-screen-2">
            <h2>{opponent}</h2>
            {
                oppoChoice == "paper" ? (
                  <img src={paper} alt="" className="main-image-game" />
                ) : oppoChoice == "scissor" ? (
                  <img src={scissor} alt="" className="main-image-game" />
                ) : oppoChoice == "rock" ? (
                  <img src={rock} style={{width: "18vw", height:"auto"}} alt="" className="main-image-game" />
                ) : (
                  <div>
                  {
                    randomNum == 0 ? 
                    <img src={paper} alt="" className="main-image-game rotate-game-img" /> :
                    randomNum == 1 ? <img src={scissor} alt="" className="main-image-game rotate-game-img" /> : 
                    <img src={rock} alt="" className="main-image-game rotate-game-img" />
                  }
                  </div>
                )
            }
            <h3>Score - {oppoCount}</h3>
          </div>{" "}
        </>
      )}
    </div>
  );
};

export default Game;
