import React, { Component } from "react";
import {
  Route,
  NavLink,
} from "react-router-dom";
import Staging from "./Staging";
import { useSelector, useDispatch } from 'react-redux';
import { attack, opponentAttack, resetHealth, endTurn, skill, setSkill } from './actions'


export default function Arena() {

  const dispatch = useDispatch();
  const battleState = useSelector(state => state.BattleState)
  const myGladiator = useSelector(state => state.ChosenGladiator.chosen)
  const opponent = useSelector(state => state.ChosenOpponent.chosenOpp)
  const opponentArray = useSelector(state => state.OpponentReducer)
  const allSkills = useSelector(state => state.SkillsReducer)
  const mySkill = useSelector(state => state.SelectedSkill.mySkill)
  const skillArray = [];
  
  allSkills.map((skill) => {
    if (skill.gladiator == myGladiator.name && myGladiator.level >= skill.lvlUnlock){
      skillArray.push(skill)
    }
  });

  let nextOpponent = opponentArray[opponent.id+1]

  function unlockNext() {
    nextOpponent.unlocked = 1
    nextOpponent.addClass = ""
    opponentArray[opponent.id+1] = nextOpponent
  }
  
  function diceRoll(max) {
    return Math.ceil(Math.random() * Math.floor(max));
  }

  let myHit;
  let oppHit;
  let atkRoll;
  let dmgBonus = myGladiator.dmgBonus;
  let toHitBonus = myGladiator.toHitBonus;
  let oppToHitBonus = opponent.toHitBonus;
  let conBonus = 0;

  if (myGladiator.dex > 15){
    toHitBonus += (myGladiator.dex - 15)
  }

  if (myGladiator.str > 15){
    dmgBonus += (myGladiator.str - 15)
  }

  if (myGladiator.con > 14){
    conBonus += (myGladiator.con - 14)
  }


  function setStats() {
    //do not include this if you want gladiator to retain its damage after battle
    dispatch(resetHealth())
    unlockNext()
    allSkills.forEach((skill) => {
      skill.attacks = skill.maxAttacks
      skill.uses = skill.maxUses
    })
    myGladiator.exp += opponent.expVal
    if (myGladiator.exp >= myGladiator.nextLvlExp){
      myGladiator.levelUp = true
    }
  }

  //ADD DIFFERENT AC VALUES FOR DIFFERENT BODY PARTS!
  function myAttackRoll() {
    atkRoll = diceRoll(20) + toHitBonus
    console.log(atkRoll)
    if (atkRoll >= opponent.ac){
      myHit = diceRoll(myGladiator.maxDmg) + dmgBonus;
      dispatch(attack(myHit))
    } else {
      dispatch(attack(0))
    }
  }

  async function mySkillAttack() {
    if (mySkill.uses > 0) {
      while (mySkill.attacks > 0) {
        myHit = diceRoll(myGladiator.maxDmg) + dmgBonus + mySkill.dmgBonus
        dispatch(skill(myHit))
        await sleep(500)
        mySkill.attacks -= 1
      }
      mySkill.uses -= 1
      dispatch(endTurn())
    }
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
  async function opponentTurn() {
    if (opponentHP > 0) {
      await sleep(2000);
      atkRoll = diceRoll(20) + oppToHitBonus
      if (atkRoll >= myGladiator.ac){
        oppHit = diceRoll(opponent.maxDmg) + opponent.dmgBonus;
        dispatch(opponentAttack(oppHit))
      } else {
        dispatch(opponentAttack(0))
      }
    }
  }

  //run this on opponent's turn
  if (battleState.playerTurn == false) {
    opponentTurn();
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
            <button disabled={!battleState.playerTurn} onClick={mySkillAttack}>SKILL</button>
            
            <div className="justify-center dmg-num-bottom stroke">
              {battleState.oppHitMessage}
            </div>
          </div>
          

          <div className="bottom-center">
            <div className="lefta stroke"><h2>{myGladiator.name} </h2></div>
            
            <div className="righta stroke"><h2>Skill: {mySkill.name} </h2>
            
            </div>
            <div className="righta">
                    {skillArray.map((skill) => (
                      <div className={`skill-icon ${skill.styleName}`} onClick={() => dispatch(setSkill(skill))}>{skill.name}</div>
                    ))}
                  </div>
            <div className="centera stroke"><h2>HP: {currentHP} / {myGladiator.hp}</h2></div>
            
          </div>
        </div>
    );
  }

    
  }

 