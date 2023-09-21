import React from "react";
import paper from "../static/paper.svg";
import stone from "../static/stone.svg";
import scissor from "../static/scissor.svg";
import { Link } from "react-router-dom";

const Result = () => {
  const winner = localStorage.getItem("winner");
  
  return (
    <div className="root-container">
      <img id="scissor-root" src={scissor} alt="" />
      <div className="root-main">
        <h2>The winner is {winner}</h2>
        <Link to="/">
          Home
        </Link>
      </div>
      <div className="image">
        <img id="paper-root" src={paper} alt="" />
        <img id="stone-root" src={stone} alt="" />
      </div>
    </div>
  );
};

export default Result;
