import React from "react";
import {
  Route,
  NavLink,
} from "react-router-dom";
import Staging from "./Staging";
import { useSelector, useDispatch } from 'react-redux';
import { attack, opponentAttack, blockedAttack, resetHealth, endTurn, skill, setSkill, opponentDisabled } from './actions'
import { diceRoll, sleep } from './data/funtions'
import ClickNHold from 'react-click-n-hold';

export default function Arena() {
  
  const dispatch = useDispatch();
  const battleState = useSelector(state => state.BattleState)
  const myGladiator = useSelector(state => state.ChosenGladiator.chosen)
  const opponent = useSelector(state => state.ChosenOpponent.chosenOpp)
  const opponentArray = useSelector(state => state.OpponentReducer)
  const allSkills = useSelector(state => state.SkillsReducer)
  const mySkill = useSelector(state => state.SelectedSkill.mySkill)
  const skillArray = [];
  
  // Setting skills for use in combat. skillArray will contain all usable skills by gladiator at its current level
  allSkills.map((skill) => {
    if (skill.gladiator === myGladiator.name && myGladiator.level >= skill.lvlUnlock){
      skillArray.push(skill)
    }
    return skillArray
  });

/*---------------------STAT DECLARATIONS-------------------------*/
    let opponentHP = opponent.hp + battleState.opponentHealth
    let currentHP = myGladiator.hp + battleState.playerHealth
    let myHit
    let oppHit
    let atkRoll
    let dmgBonus = myGladiator.dmgBonus
    let toHitBonus = myGladiator.toHitBonus
    let oppToHitBonus = opponent.toHitBonus
    let blockValue = myGladiator.blockValue

    if (myGladiator.dex > 15){
      toHitBonus += (myGladiator.dex - 15)
    }

    if (myGladiator.str > 15){
      dmgBonus += (myGladiator.str - 15)
    }

    if (myGladiator.con > 15){
      blockValue += (myGladiator.con - 15)
    }



/*---------------------COMBAT MY TURN---------------------------*/
  //**ADD DIFFERENT AC VALUES FOR DIFFERENT BODY PARTS!
  function myAttackRoll(e) {
    atkRoll = diceRoll(20)
    var anim = document.createElement("img")
    //CRIT condition
    if (atkRoll === 20) { 
      myHit =(Math.ceil(myGladiator.maxDmg*1.5) + dmgBonus)
      dispatch(attack(myHit))//**make new action for crit
      anim.className = 'attack-animation'
      anim.src= require(`./assets/images/animations/crit2.gif`)
    //HIT condition
    } else if ((atkRoll + toHitBonus) >= opponent.ac){
      myHit = diceRoll(myGladiator.maxDmg) + dmgBonus;
      dispatch(attack(myHit))
      anim.className = 'attack-animation'
      anim.src= require(`./assets/images/animations/atk${diceRoll(3)}.gif`)
    //MISS condition
    } else {
      anim.className = 'attack-animation'
      anim.src= require('./assets/images/animations/miss.gif')
      dispatch(attack(0))
    }
    anim.style.left = e.clientX-128 + 'px'
    anim.style.top = e.clientY-128 + 'px'
    document.body.appendChild(anim)
    setTimeout(() => {  anim.parentNode.removeChild(anim); }, 500)
  }

  async function mySkillAttack() { // Functions with sleep require async
    
    if (mySkill.uses > 0) { 
      var anim = document.createElement("img")   
      while (mySkill.attacks > 0) {
        myHit = diceRoll(Math.ceil(myGladiator.maxDmg/2)) + dmgBonus + mySkill.dmgBonus
        dispatch(skill(myHit))
        anim.className = 'skill-animation'
        anim.src= require(`./assets/images/animations/${mySkill.animation}${mySkill.attacks}.gif`)
        document.getElementsByClassName('center-screen')[0].appendChild(anim)
        setTimeout(() => {  anim.parentNode.removeChild(anim); }, 500)
        await sleep(500)
        mySkill.attacks -= 1
      }
      opponent.disabled = diceRoll(mySkill.disableTurns)
      mySkill.uses -= 1
      dispatch(endTurn())
    }
  }



/*---------------------COMBAT OPPONENT TURN-------------------------*/
  //All actions in opponent's turn
  async function opponentTurn() {
    if (opponentHP > 0) {
      //setup
      myGladiator.blocked = false
      var anim = document.createElement("img")
      anim.className = `opponent-animation`
      
      //Disabled condition
      if (opponent.disabled > 0) { 
        await sleep(1300);
        opponent.disabled -= 1
        dispatch(opponentDisabled(mySkill.disableMessage))
        
      } else {
        //Making tap to block animation appear at random location
        await sleep(diceRoll(1000)+1000);
        var blockTappy = document.createElement("img")
        blockTappy.className = "tap-to-block"
        blockTappy.style.left = diceRoll(100) + '%'
        blockTappy.style.bottom = diceRoll(100) + '%'
        blockTappy.src = require(`./assets/images/animations/block-pulse.gif`)
        blockTappy.addEventListener("click", function(){
          myGladiator.blocked = true
        })
        document.getElementsByClassName('block-area')[0].appendChild(blockTappy)
        setTimeout(() => {  blockTappy.parentNode.removeChild(blockTappy); }, 800)

        //Preparing opponent attack
        await sleep(1300);
        atkRoll = diceRoll(20)
        //Crit condition
        if (atkRoll === 20) {
          anim.src = require(`./assets/images/animations/bloodsplat-crit.gif`)
          oppHit = (Math.ceil(opponent.maxDmg * 1.5)) + opponent.dmgBonus
          dispatch(opponentAttack(oppHit))
        //Regular hit condition
        } else if ((atkRoll + oppToHitBonus) >= myGladiator.ac){
          anim.src = require(`./assets/images/animations/bloodsplat${diceRoll(3)}.gif`)
          oppHit = diceRoll(opponent.maxDmg) + opponent.dmgBonus;
          console.log(oppHit)
          //Block attack condition
          if (myGladiator.blocked === true) {
            oppHit -= blockValue
            if (oppHit < 0){
              oppHit = 0
            }   
            dispatch(blockedAttack(oppHit, blockValue))
          } else {
            dispatch(opponentAttack(oppHit))
          }
        //Miss condition    
        } else {
          anim.src = require(`./assets/images/animations/opponentmiss.gif`)
          dispatch(opponentAttack(null))  
        }
        //Applying bloodsplat/miss animation
        document.getElementsByClassName('center-screen')[0].appendChild(anim)
        setTimeout(() => {  anim.parentNode.removeChild(anim); }, 500)
      }
    }
  }
  //Run opponent turn when it's not player's turn
  if (battleState.playerTurn === false) {
    opponentTurn();
  }

/*-----------------------VICTORY CONDITIONS-------------------------------*/
  //Assigns next opponent to be unlocked upon victory
  let nextOpponent = opponentArray[opponent.id+1]

  function unlockNext() {
    nextOpponent.unlocked = 1
    nextOpponent.addClass = ""
    opponentArray[opponent.id+1] = nextOpponent
  }

  //Victory function resets hp, returns skill uses, adds exp
  function victory() {
    dispatch(resetHealth()) // Resets health after battle is complete - reducer does both player and opponent health reset
    unlockNext() //unlock next opponent battle
    myGladiator.blocked = false
    allSkills.forEach((skill) => { // Resets skill usage
      skill.attacks = skill.maxAttacks
      skill.uses = skill.maxUses
    })
    myGladiator.exp += opponent.expVal // Gives player exp
    if (myGladiator.exp >= myGladiator.nextLvlExp){
      myGladiator.levelUp = true
    }
  }



/*-----------------DEFEAT CONDITION------------------*/

  if (currentHP < 1){
    alert("You Died")
  }
  

/*---------------------START HTML RENDER-------------------------*/
  const renderClickNHold = () => {
    if(mySkill.uses > 0) {
      return (
        <ClickNHold time={1.2} onClickNHold={mySkillAttack}>
          <div className={`opponent ${opponent.styleName}`} disabled={!battleState.playerTurn} onClick={myAttackRoll}></div>
        </ClickNHold>
      );
    } else {
      return (
        <div className={`opponent ${opponent.styleName}`} disabled={!battleState.playerTurn} onClick={myAttackRoll}></div>
      );
    }
  }

  const renderVictoryScreen = () => {
    if (opponentHP < 1){
      return (
        <div className="overlay-container">
            <div className="center-screen">
              <h1>VICTORY!</h1>
              <NavLink to="/staging"><button onClick={victory}>CONTINUE</button></NavLink>
            </div>
            <Route path="/staging" component={Staging}/>
        </div>
      );
    }
  }

  return (
    <div className="arena-bg">
      {renderVictoryScreen()}
      <div className="top-center">
        <div className="lefta stroke"><h2>Opponent: {opponent.name} </h2></div>
        <div className="centera stroke"><h2>HP: {opponentHP} / {opponent.hp} </h2></div>
      </div>
      
      <div className="center-screen">
        <div className="justify-center dmg-num-top stroke">
          {battleState.myHitMessage}
        </div>
          <div className="opponent-container">
            {renderClickNHold()}
          </div>
        <div className="justify-center dmg-num-bottom stroke">
          {battleState.oppHitMessage}
        </div>
        <div className="block-area"></div>
      </div>
      
      <div className="bottom-center">
        <div className="lefta stroke"><h2>{myGladiator.name} </h2></div>
        
        <div className="righta stroke"><h2>Skill: {mySkill.name} </h2>
        
        </div>
        <div className="righta">
          {/* add drop-up menu for skills, only clickable during player's turn to prevent switching skills on enemy turn */}
          {skillArray.map((skill) => (
            <div className={`skill-icon ${skill.styleName}`} onClick={() => dispatch(setSkill(skill))}>{skill.name}</div>
          ))}
        </div>
        <div className="centera stroke"><h2>HP: {currentHP} / {myGladiator.hp}</h2></div>
        
      </div>
    </div>
  )
}  


 