import React, {useState, useEffect} from 'react';
import {Link, Outlet} from 'react-router-dom';
import { socket } from "../socket";
import paper from "./static/paper.svg";
import stone from "./static/stone.svg";
import scissor from "./static/scissor.svg";
import './root.css';

const Root = () => {
  const [nameExists, setNameExists] = useState();
  const [isConnected, setIsConnected] = useState(socket.connected);
  useEffect(() => {
    let name = window.localStorage.getItem('username');
    let isName = name ? true : false;
    setNameExists(isName)
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [])
  const handleClick = () => {
    let userName = window.localStorage.getItem('username'); 
    socket.emit('game-started', {userName : userName});
    window.localStorage.setItem('game-status', 'game-started')
  }
  return (
    <div className="root-container">
      <img id="scissor-root" src={scissor} alt="" />
      <div className="root-main">
        {!nameExists &&  <NameForm setNameExists={setNameExists} />}
        {
          nameExists &&
          <Link to='/game' onClick={handleClick}>Play</Link>  
        }
      </div>
      <div className="image">
        <img id="paper-root" src={paper} alt="" />
        <img id="stone-root" src={stone} alt="" />
      </div>
    </div>
  )
}
const NameForm = (props) => {
  const [username, setUsername] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('username', username);
    props.setNameExists(true);
  }
  return (
    <>
    {/* <h3>Create user before playing</h3> */}
    <form onSubmit={handleSubmit} className="login-form">
      <label htmlFor="">User Name : </label>
      <input type="text" value={username} onChange={(e) => {
        setUsername(e.target.value)
      }} />
      <input id="sub-btn" type="submit" />
    </form>
    </>
  )
}
export default Root