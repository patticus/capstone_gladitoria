import React from "react";
import {
  Route,
  NavLink,
} from "react-router-dom";
import CharSelect from "./CharSelect";
 
let intro = false

export default function Home(){
  console.log(intro)

  function showIntroMessage() {
    intro = true
  }

  const renderIntroScreen = () => {
    if (intro === true) {
      return (
        <div className="overlay-container">
          <div className="intro-screen">
            <h5 className="message-title">ATTENTION!</h5>
            <h5 className="message-text">Ludus Gladitoria is an arcade-style rpg fighter game. The goal is to win the tournament in one playthrough. As such, there is currently no way to save your character data. </h5>
            <h5 className="warning-text">If you hit back or refresh the page, you will lose all progress!</h5>
            <h5 className="message-text">For a more immersive experience, press F11 to play in full-screen mode!</h5>
            <h5 className="message-text">Ludus Gladitoria 1.0.0 is built in ReactJS. It is free to play and open source. The source code is available at:</h5>
            <p><a href="https://github.com/patticus/capstone_gladitoria" target="_blank" rel="noopener noreferrer">https://github.com/patticus/capstone_gladitoria</a></p>
            <p className="cr">Copyright © 2020 Ludus Gladitoria - All Rights Reserved.</p>
            <NavLink to="/charselect" className="navlink-bg" activeClassName="navlink-bg"><button className="button-bg btn-tutorial">CONTINUE</button></NavLink>
          </div>
          <Route path="/charselect" component={CharSelect} />
        </div>
      );
    }  
  }


    return (
      <div className="start-container start-bg">
        {renderIntroScreen()}
          <img src={require("./assets/images/logo.png")} className="logo"></img>
          <NavLink to="/" className="navlink-bg" activeClassName="navlink-bg"><button className="button-bg" onClick={showIntroMessage}>START</button></NavLink>
      </div>
    );
  }
