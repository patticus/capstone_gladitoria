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
            <h1 className="message-title">ATTENTION!</h1>
            <h5 className="message-text">Ludus Gladitoria is an arcade-style rpg fighter game. The goal is to win the tournament in one playthrough. As such, there is currently no way to save your character data. </h5>
            <h5 className="warning-text">If you hit back or refresh the page, you will lose all progress!</h5>
            <h3 className="message-text">Ludus Gladitoria 1.0.0 is built in ReactJS. It is totally free to play and open source. The source code is available at https://github.com/patticus/capstone_gladitoria</h3>
            <NavLink to="/charselect"><button>CONTINUE</button></NavLink>
          </div>
          <Route path="/charselect" component={CharSelect} />
        </div>
      );
    }  
  }


    return (
      <div className="start-container start-bg">
        {renderIntroScreen()}
        <div className="justify-center">
          <h2> LUDUS GLADITORIA</h2>
        </div>

        <div className="justify-center">
          <div className="start" onClick={showIntroMessage}><NavLink to="/">START</NavLink></div>
      </div>
      </div>
    );
  }
