import React, { useEffect } from "react";
import ReactTooltip from "react-tooltip";
import {
  Route,
  NavLink,
} from "react-router-dom";
import Staging from "./Staging";
import { useSelector, useDispatch } from 'react-redux';
import { attack, critAttack, riposte, opponentAttack, 
          blockedAttack, resetHealth, endTurn, skillBuff, 
          skill, setSkill, opponentDisabled, poisonDmg, bleedDmg} from './actions'
import { diceRoll, sleep, fadeOut, applyPoisonStyle, oppGetHurt, dodgeShake, oppAttackAnimation, closeDropup, openDropup, bleedTickAnimation, animatePlayerAttack, animateDualWieldAttack, displayDmgNumber, animateBuff, addActiveBuff} from './data/functions'
import ClickNHold from 'react-click-n-hold';

let stack = 0

export default function Arena() {
  
  const dispatch = useDispatch();
  const battleState = useSelector(state => state.BattleState)
  const myGladiator = useSelector(state => state.ChosenGladiator.chosen)
  const opponent = useSelector(state => state.ChosenOpponent.chosenOpp)
  const opponentArray = useSelector(state => state.OpponentReducer)
  const allSkills = useSelector(state => state.SkillsReducer)
  let mySkill = useSelector(state => state.SelectedSkill.mySkill)
  let skillArray = [];
  let activeBuffs = battleState.activeBuffs;

  // Setting skills for use in combat. skillArray will contain all usable skills by gladiator at its current level
  allSkills.map((skill) => {
    if (skill.gladiator === myGladiator.name && myGladiator.level >= skill.lvlUnlock && !skill.passive){
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
    let critRoll
    let passiveEffect
    let bleedTick
    let myAC = myGladiator.ac
    let critChance = myGladiator.critChance
    let dmgBonus = myGladiator.dmgBonus
    let toHitBonus = myGladiator.toHitBonus
    let oppToHitBonus = opponent.toHitBonus
    let blockValue = myGladiator.blockValue

//Applies Dex and STR bonuses to hit and damage
    if (myGladiator.dex > 15){
      toHitBonus += (myGladiator.dex - 15)
    }

    if (myGladiator.str > 15){
      dmgBonus += (myGladiator.str - 15)
    }

//Applies passive skill at level 4

    if (myGladiator.level >= 4){
      myGladiator.passiveUnlocked = true
      passiveEffect = myGladiator.passiveEffect
    }

 //Each gladiator has a different bleed tick damage
    switch (myGladiator.name){
      case "Dimachaerus":
        bleedTick = 1
        break
      case "Secutor":
        bleedTick = Math.ceil(dmgBonus/2)
        break
      case "Retiarius":
        bleedTick = Math.ceil(dmgBonus/2) + 3
        break
      default:
        break
    }

/*---------------------PASSIVES, BUFFS AND BUFF DURATIONS---------------------------*/

  //Riposte function will activate during opponent turn (on successful block)
  async function riposteAttack() {
    await sleep(200)
    let anim = document.createElement("img")
    myHit = diceRoll(myGladiator.maxDmg) + dmgBonus + toHitBonus;
    dispatch(riposte(myHit))
    animatePlayerAttack(myGladiator.name)
    displayDmgNumber(myHit, "skill-number")
    anim.className = 'skill-animation'
    anim.src= require(`./assets/images/animations/riposte.gif`)
    document.getElementsByClassName('center-screen')[0].appendChild(anim)
    setTimeout(() => {  anim.parentNode.removeChild(anim); }, 500)
  }

  if ('rage' in activeBuffs) {
    if (stack > 5) {
      stack = 5
    }
    dmgBonus += stack
  }

  if ('champion' in activeBuffs) {
    dmgBonus += 3
    myAC += 3
    critChance += 20
    toHitBonus += 3
    blockValue += 3
  }

  // Decrements buff durations every time player turn is activated
  function decrementBuffDuration() {
    if ('rage' in activeBuffs) {
      activeBuffs.rage.duration -= 1
      if (activeBuffs.rage.duration === 0){
        document.getElementById("weaponBuff").classList.remove("rage-active")
        delete activeBuffs.rage
      }
    }
    if ('riposte' in activeBuffs){  
      activeBuffs.riposte.duration -=1
      if (activeBuffs.riposte.duration === 0){
        document.getElementById("weaponBuff").classList.remove("riposte-active")
        delete activeBuffs.riposte
      }
    }
    if ('poisonTrident' in activeBuffs){
      activeBuffs.poisonTrident.duration -=1
      if (activeBuffs.poisonTrident.duration === 0){
        document.getElementById("weaponBuff").classList.remove("poisonTrident-active")
        delete activeBuffs.poisonTrident
      }
    }
    if ('champion' in activeBuffs){
      activeBuffs.champion.duration -=1
      if (activeBuffs.champion.duration === 0){
        document.getElementById("weaponBuff").classList.remove("champion-active")
        delete activeBuffs.champion
      }
    }
  }

/*---------------------COMBAT---------------------------*/
  
  useEffect(() => {
    if (battleState.playerTurn) {
    //Events that happen at the start of *MY TURN
    
    console.log(myGladiator.blocked+ "meee")
    
      if ('riposte' in activeBuffs && myGladiator.blocked){
        riposteAttack()
      }
      decrementBuffDuration()
    
    } else if (!battleState.playerTurn && opponentHP > 0) {
    //Events that happen at the start of *OPPONENT TURN
    async function opponentDoubleAttack () {
      opponentTurn(true)
      await sleep(200)
      opponentTurn(false)
    }
      switch (opponent.id) {
        case 0:
          opponentTurn(false)
          break
        case 6:
        case 7:
        case 8:
        case 9:
          opponentTurn(false)
          opponentTurn(false)
          break
        default:
          opponentTurn(false)
          break
      }     
    }
  }, [battleState.playerTurn])

/*---------------------COMBAT MY TURN---------------------------*/


  //**ADD DIFFERENT AC VALUES FOR DIFFERENT BODY PARTS!
  function normalAttack(e) {
    if (passiveEffect === "sever"){
      critChance += 15
    }
    critRoll = diceRoll(100)
    atkRoll = diceRoll(20)

    let anim = document.createElement("img")
    //CRIT condition
    if (critRoll <= critChance) { 
      myHit =(Math.ceil(myGladiator.maxDmg*1.5) + dmgBonus)
      dispatch(critAttack(myHit))
      if ('poisonTrident' in activeBuffs) {
        battleState.poisoned = true
        stack += 1
      }
      anim.className = 'attack-animation'
      anim.src= require(`./assets/images/animations/crit2.gif`)
      oppGetHurt()
      displayDmgNumber(myHit, "crit-number")
    //HIT condition
    } else if ((atkRoll + toHitBonus) >= opponent.ac){
      myHit = diceRoll(myGladiator.maxDmg) + dmgBonus;
      dispatch(attack(myHit))
      if ('poisonTrident' in activeBuffs) {
        battleState.poisoned = true
        stack += 1
      }
      anim.className = 'attack-animation'
      anim.src= require(`./assets/images/animations/atk${diceRoll(2)}.gif`)
      oppGetHurt()
      displayDmgNumber(myHit, "hit-number")
    //MISS condition
    } else {
      myHit = 0
      anim.className = 'attack-animation'
      anim.src= require('./assets/images/animations/miss.gif')
      dodgeShake()
      dispatch(attack(myHit))
      displayDmgNumber(myHit, "hit-number")
    }
    anim.style.left = e.clientX-96 + 'px'
    anim.style.top = e.clientY-96 + 'px'
    document.body.appendChild(anim)
    setTimeout(() => {  anim.parentNode.removeChild(anim); }, 500)
  }

  //SECONDARY attack when dual wield triggers
  function dualWieldAttack() {
    critRoll = diceRoll(100)
    atkRoll = diceRoll(20)
    let anim = document.createElement("img")
    //CRIT condition
    if (critRoll <= critChance) { 
      myHit =(Math.ceil(myGladiator.maxDmg*1.5) + dmgBonus)
      dispatch(critAttack(myHit))
      anim.className = 'attack-animation'
      anim.src= require(`./assets/images/animations/crit2.gif`)
      displayDmgNumber(myHit, "crit-number")
    //HIT condition
    } else if ((atkRoll + toHitBonus) >= opponent.ac){
      myHit = diceRoll(myGladiator.maxDmg) + dmgBonus;
      dispatch(attack(myHit))
      anim.className = 'attack-animation'
      anim.src= require(`./assets/images/animations/atk3.gif`)
      displayDmgNumber(myHit, "hit-number")
    //MISS condition
    } else {
      myHit = 0
      anim.className = 'attack-animation'
      anim.src= require('./assets/images/animations/miss.gif')
      dispatch(attack(myHit))
      displayDmgNumber(myHit, "hit-number")
    }
    document.getElementsByClassName('center-screen')[0].appendChild(anim)
    setTimeout(() => {  anim.parentNode.removeChild(anim); }, 500)
  }
  
  /* FULL ATTACK ROLL */

  async function myAttackRoll(e) {
    animatePlayerAttack(myGladiator.name)
    if (passiveEffect === "dual-wield") {
      let dwRoll = diceRoll(20) + toHitBonus
      if (dwRoll >= 1) {
        normalAttack(e)
      }
      setTimeout(() => {  dualWieldAttack(e) }, 200)
      setTimeout(() => {animateDualWieldAttack(myGladiator.name) }, 200)
    } else {
      normalAttack(e)
    }
    if (battleState.poisoned){
      applyPoisonStyle()
      dispatch(poisonDmg(stack))
      displayDmgNumber(stack, "poison-number")
    }
    if (battleState.bleeding){
      bleedTickAnimation()
      dispatch(bleedDmg(bleedTick))
      displayDmgNumber(bleedTick, "bleed-number")
    }
    
    await sleep(300)
    dispatch(endTurn())
  }



/* ------------------SKILLS------------------*/

  async function mySkillAttack() { // Functions with sleep require async
    
    if (mySkill.uses > 0) { 
      let anim = document.createElement("img") 
      if (mySkill.buff === true) {

        dispatch(skillBuff(mySkill.buffEffect))
        animateBuff(mySkill.buffEffect.name)
      } else {
        while (mySkill.attacks > 0) {
          myHit = diceRoll(Math.ceil(myGladiator.maxDmg*mySkill.multiplier)) + dmgBonus + mySkill.dmgBonus
          switch (mySkill.name){
            case "Execute":
              myHit += mySkill.executeBonus(opponent.hp, opponentHP, opponent.disabled)
              break
            case "Shield Bash":
              myHit += myGladiator.blockValue
              break
            case "Pinpoint":
              myHit += toHitBonus
              opponent.attackSpeed += myGladiator.dex*10
              break
            default:
              break
          }
          //send dmg to reducer
          dispatch(skill(myHit))
          //Animate player weapons
          if (mySkill.attacks === 2) {
            animateDualWieldAttack(myGladiator.name)
          } else {
            animatePlayerAttack(myGladiator.name)
          }
          //animate opponent getting hurt
          oppGetHurt()
          //skill animation
          anim.className = `${mySkill.animContainer}`
          anim.src= require(`./assets/images/animations/${mySkill.animation}${mySkill.attacks}.gif`)
          document.getElementsByClassName('center-screen')[0].appendChild(anim)
          setTimeout(() => {  anim.parentNode.removeChild(anim); }, 550)
          displayDmgNumber(myHit, "skill-number")
          await sleep(550)
          mySkill.attacks -= 1
        }
      }
      if (mySkill.bleed || battleState.bleeding){
        dispatch(bleedDmg(bleedTick))
        displayDmgNumber(bleedTick, "bleed-number")
      }
      if (battleState.poisoned){
        dispatch(poisonDmg(stack))
        displayDmgNumber(stack, "poison-number")
      }
      opponent.disabled = diceRoll(mySkill.disableTurns)
      mySkill.uses -= 1
      mySkill.used = true
      mySkill.addClass = "grayscale"
      dispatch(endTurn())
    }
  }



/*---------------------COMBAT OPPONENT TURN-------------------------*/
  //All actions in opponent's turn
  /*MultiHitCheck parameter is used for opponent attacking multiple times in a round, so that the player must block all attacks to gain benefits. Default is false, and when there are multiple attacks they should be true until the last one which should be false. */
  async function opponentTurn(multiHitCheck) {
      //setup
      myGladiator.blocked = false
      let anim = document.createElement("img")
      anim.className = `opponent-animation`

      //Disabled condition
      if (opponent.disabled > 0) { 
        await sleep(1300);
        opponent.disabled -= 1
        dispatch(opponentDisabled(mySkill.disableMessage))
        
      } else {
        //Making tap to block animation appear at random location
        await sleep(diceRoll(opponent.attackSpeed)+1000);
        let blockTappy = document.createElement("img")
        blockTappy.className = "tap-to-block"
        blockTappy.style.left = diceRoll(100) + '%'
        blockTappy.style.bottom = diceRoll(100) + '%'
        blockTappy.src = require(`./assets/images/animations/block-pulse.gif`)
        blockTappy.addEventListener("click", function(){
          myGladiator.blocked = true
          if ('rage' in activeBuffs) {
            stack += 1
          } 
        })
        document.getElementsByClassName('block-area')[0].appendChild(blockTappy)
        setTimeout(() => {  blockTappy.parentNode.removeChild(blockTappy); }, opponent.attackSpeed)

        //Preparing opponent attack
        await sleep(1300) 
        atkRoll = diceRoll(20)

        //Check for character for "Prod" passive
        if (passiveEffect === "prod"){
          atkRoll -= 3
        }

        //Block attack condition
        if (myGladiator.blocked === true) {
          anim.src = require(`./assets/images/animations/block.gif`)
          if ((atkRoll + oppToHitBonus) >= myAC){
            oppHit = diceRoll(opponent.maxDmg) + opponent.dmgBonus;
          } else {
            oppHit = 0
          }
          oppHit -= blockValue
          if (oppHit < 0){
            oppHit = 0
          }   
          dispatch(blockedAttack(oppHit, blockValue))
          //parameter is used so player needs to block all attacks
          myGladiator.blocked = !multiHitCheck

        // Crit condition  
        } else if (atkRoll === 20) {
          anim.src = require(`./assets/images/animations/bloodsplat-crit.gif`)
          oppHit = (Math.ceil(opponent.maxDmg * 1.5)) + opponent.dmgBonus
          dispatch(opponentAttack(oppHit))

        // Normal Hit condition
        } else if ((atkRoll + oppToHitBonus) >= myAC){
          anim.src = require(`./assets/images/animations/bloodsplat${diceRoll(3)}.gif`)
          oppHit = diceRoll(opponent.maxDmg) + opponent.dmgBonus;
          dispatch(opponentAttack(oppHit))
        //Miss condition    
        } else {
          anim.src = require(`./assets/images/animations/opponentmiss.gif`)
          dispatch(opponentAttack(null))  
        }

        //Applying animations
        oppAttackAnimation()
        document.getElementsByClassName('center-screen')[0].appendChild(anim)
        setTimeout(() => {  anim.parentNode.removeChild(anim); }, 500)
      }
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
    battleState.playerTurn = true
    opponent.disabled = false
    opponent.attackSpeed = opponent.baseAtkSpeed
    stack = 0
    dispatch(resetHealth()) // Resets health after battle is complete - reducer does both player and opponent health reset
    unlockNext() //unlock next opponent battle
    myGladiator.blocked = false
    allSkills.forEach((skill) => { // Resets skill usage
      skill.used = false
      skill.attacks = skill.maxAttacks
      skill.uses = skill.maxUses
      skill.addClass = ""
      if (skill.buff === true) {
        skill.buffEffect.duration = skill.buffEffect.maxDuration
      }
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
    <div className="arena-bg" >
      {renderVictoryScreen()}
      <div className="top-center">
        <div className="lefta stroke"><h2>Opponent: {opponent.name} </h2></div>
        <div className="centera stroke"><h2>HP: {opponentHP} / {opponent.hp} </h2></div>
      </div>
      
      <div className="center-screen">
        <div className="justify-center disable-message stroke">
          {battleState.disableMessage}
        </div>
        <div className="justify-center dmg-num-top stroke">
        </div>
          <div className="opponent-container" id="shakeContainer">
            {renderClickNHold()}
          </div>
        <div className="justify-center dmg-num-bottom stroke" id="bottom-message">
          {battleState.oppHitMessage}
        </div>
        <div className="block-area"></div>
        <img alt="weapons" src={require(`./assets/images/weapons-${myGladiator.name}.png`)} className="weapons-container" id="weaponBuff"></img>
      </div>
      
      <div className="bottom-center" disabled={!battleState.playerTurn}>
        <div className="dropup righta stroke">
        <div className="dropbtn" onClick={openDropup}>SKILL</div>
          <div className="dropup-content">
            {skillArray.map((skill) => (
              <div key={skill.id} disabled={skill.used} className={skill.addClass} onClick={() => {dispatch(setSkill(skill)); closeDropup()}}>
              <img alt="skill" src={require(`./assets/images/skills/${skill.animation}.png`)} 
              className={`skill-icon`}></img>
              <p>{skill.name}</p>
              </div>
            ))}
          </div>
        </div>
        {/* <div className="dropup righta stroke"><h2>{mySkill.name} </h2>
        
        </div> */}
        <div className="righta">
          <img alt="selected-skill" data-border="true" data-effect="solid" data-html="true" data-tip={`<h3>${mySkill.name}</h3> <h4>Unlocks: Level ${mySkill.lvlUnlock}</h4> ${mySkill.description}`} data-class="tooltip" src={require(`./assets/images/skills/${mySkill.animation}.png`)} className={`skill-icon ${mySkill.addClass}`}></img>
          <ReactTooltip />
        </div>
        <div className="centera stroke"><h2>HP: {currentHP} / {myGladiator.hp}</h2></div> 
        </div>

      
    </div>
  )
}  


 