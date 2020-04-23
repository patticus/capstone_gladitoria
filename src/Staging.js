import React, { Component } from "react";
import {
  Route,
  NavLink,
} from "react-router-dom";
import Arena from "./Arena";
import { useSelector, useDispatch } from 'react-redux';
import { setUser, logOut } from './actions/userActions'
import { setOpponent } from "./actions/setOpponent";

 
export default function Staging() {

  const dispatch = useDispatch()
  const opponentArray = useSelector(state => state.OpponentReducer) //Array of all opponent objects
  const opponent = useSelector(state => state.ChosenOpponent.chosenOpp) //Selected opponent object
  const myGladiator = useSelector(state => state.ChosenGladiator.chosen) //Chosen gladiator object

    return (
      <div className="flex-column"> 

        <div className="justify-center">
          <h2>STAGING</h2>
        </div>
          
        <div className="justify-center">   
          <div className="staging-character">
            <h2>CHARACTER</h2>
              <div className="justify-center">
                <div className={`char-screen ${myGladiator.styleName}`}>{myGladiator.name}</div>
                <div className="char-screen">
                  <h2>Level: {myGladiator.level}</h2>
                  <h2>EXP: {myGladiator.exp} / 100</h2>
                  <h2>HP: {myGladiator.hp}</h2>
                  <h2>AC: {myGladiator.ac}</h2>
                  <h2>STR: {myGladiator.str} </h2>
                  <h2>DEX: {myGladiator.dex}</h2>
                  <h2>CON: {myGladiator.con}</h2>
                  <h2>WEAPONS: {myGladiator.weapons}</h2>
                </div>
                
              </div>
            </div>
          <div className="staging-select">
            <h2>ARENA</h2>
            <div className="justify-center">
              <div>
                {opponentArray.map((battle) => (
                  <div key={battle.id} className="justify-center">
                  <div tabIndex={battle.unlocked} key={battle.id} className={`arena-select ${battle.addClass}`} onFocus={() => dispatch(setOpponent(battle))}><div className="fl-left"><h2>{battle.battleTitle}</h2></div><div className="fl-right mini-arena"></div></div>
                  </div>
                ))}
              </div>
              <div className="char-screen">
                  <h2>{opponent.battleTitle}</h2>
                  <h2>{opponent.name}</h2>
                  <h2>{opponent.difficulty}</h2>
                </div>
                </div>     
            </div>
        </div>
        
        <div className="justify-center">
          <NavLink to="/arena"><button>FIGHT!</button></NavLink>
        </div>

        <Route path="/arena" component={Arena}/>
      </div> 
    );
  }

