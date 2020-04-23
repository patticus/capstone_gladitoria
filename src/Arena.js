import React, { Component } from "react";
import {
  Route,
  NavLink,
} from "react-router-dom";
import Staging from "./Staging";
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, attack, opponentAttack, resetHealth } from './actions/counterActions'

import store from './store'


export default function Arena() {

  const dispatch = useDispatch();
  const counter = useSelector(state => state.count);
  const battleState = useSelector(state => state.BattleState)
  const myGladiator = useSelector(state => state.ChosenGladiator.chosen)
  const opponent = useSelector(state => state.ChosenOpponent.chosenOpp)
  const opponentArray = useSelector(state => state.OpponentReducer)

  let nextOpponent = opponentArray[opponent.id+1]

  function unlockNext() {
    nextOpponent.unlocked = 1
    nextOpponent.addClass = ""
    opponentArray[opponent.id+1] = nextOpponent
  }
  
  function randomDmg(max) {
    return Math.ceil(Math.random() * Math.floor(max));
  }

  let myHit;
  let oppHit;
  let dmgBonus = myGladiator.dmgBonus;

  if (myGladiator.str > 15){
    dmgBonus += (myGladiator.str - 15)
  }

  console.log(dmgBonus)


  function setStats() {
    //do not include this if you want gladiator to retain its damage after battle
    dispatch(resetHealth())
    unlockNext()
    myGladiator.exp += opponent.expVal
    if (myGladiator.exp >= 100){
      myGladiator.level = 2
    } else if (myGladiator.exp >= 300){
      myGladiator.level = 3
    }
  }

  function myAttackRoll() {
    myHit = randomDmg(myGladiator.maxDmg) + dmgBonus;
    dispatch(attack(myHit))
  }

  let opponentHP = opponent.hp + battleState.opponentHealth
  let currentHP = myGladiator.hp + battleState.playerHealth
  if (currentHP < 1){
    alert("You Died")
  }

  // Make a new JS file for all this crap
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //function for opponent to attack player
  async function peep() {
    if (opponentHP > 0) {
      await sleep(2000);
      oppHit = randomDmg(opponent.maxDmg) + opponent.dmgBonus;
      dispatch(opponentAttack(oppHit))
    }
  }

  //run this on opponent's turn
  if (battleState.playerTurn == false) {
    peep();
  }

  if (opponentHP < 1){
    return (
      <div className="arena-bg">

        <div className="center-screen">
          <h1>VICTORY!</h1>
          <NavLink to="/staging"><button onClick={setStats}>CONTINUE</button></NavLink>
        </div>
        <Route path="/staging" component={Staging}/>
        </div>
    );
  } else {

    return (
        <div className="arena-bg">
          <div className="top-center">
            <div className="lefta stroke"><h2>Opponent: {opponent.name} </h2></div>
            <div className="centera stroke"><h2>HP: {opponentHP} / {opponent.hp} </h2></div>
          </div>
          
          <div className="center-screen">
            <div className="justify-center dmg-num-top stroke">
              {battleState.myHitMessage}
            </div>
            
            <button disabled={!battleState.playerTurn} onClick={myAttackRoll}>ATTACK</button>
            
            <div className="justify-center dmg-num-bottom stroke">
              {battleState.oppHitMessage}
            </div>
          </div>
          

          <div className="bottom-center">
            <div className="lefta stroke"><h2>{myGladiator.name} </h2></div>
            <div className="righta stroke"><h2>Skills</h2></div>
            <div className="centera stroke"><h2>HP: {currentHP} / {myGladiator.hp}</h2></div>
          </div>
        </div>
    );
  }

    
  }

 