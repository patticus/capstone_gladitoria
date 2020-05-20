import React from "react";
import ReactTooltip from "react-tooltip";
import {
  Route,
  NavLink,
} from "react-router-dom";
import Arena from "./Arena";
import { useSelector, useDispatch } from 'react-redux';
import { setOpponent } from "./actions";
import { diceRoll } from './data/functions'

let tutorial = true
let statCount = 2
let increaseDisable = false
let continueDisable = true
  

export default function Staging() {


  const dispatch = useDispatch()
  const opponentArray = useSelector(state => state.OpponentReducer) //Array of all opponent objects
  const opponent = useSelector(state => state.ChosenOpponent.chosenOpp) //Selected opponent object
  const myGladiator = useSelector(state => state.ChosenGladiator.chosen) //Chosen gladiator object
  const allSkills = useSelector(state => state.SkillsReducer)
  const skillArray = [];
  let skillUnlockMessage = ""

  switch (myGladiator.level) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 9:
      if (increaseDisable === false) {
        statCount = 1
      }
      skillUnlockMessage = "New skill unlocked!"
      break
    default:
      break
  }
  
  allSkills.map((skill) => {
    if (skill.gladiator === myGladiator.name){
      skillArray.push(skill)
    }
    return skillArray
  });

  let conBonus = 0;
  if (myGladiator.con > 15){
    conBonus += (myGladiator.con - 15)
  }

  function levelUp () {
    myGladiator.level += 1
    myGladiator.hp += (diceRoll(5)+5 + conBonus)
    myGladiator.exp = 0
    myGladiator.nextLvlExp += (myGladiator.level * 200)
    myGladiator.levelUp = true
  }

  function tempLvlUp () {
    myGladiator.level = 10
    myGladiator.levelUp = true
  }

  function continueLvl () {
    levelUp()
    myGladiator.levelUp = false
    statCount = 2
    increaseDisable = false
    continueDisable = true
  }

  function strLvlUp () {
    myGladiator.str += 1
    myGladiator.critChance += 2
    statCount -= 1
    if (statCount === 0){
      increaseDisable = true
      continueDisable = false
    }
  }

  function dexLvlUp () {
    myGladiator.dex += 1
    myGladiator.ac += 1
    statCount -= 1
    if (statCount === 0){
      increaseDisable = true
      continueDisable = false
    }
  }

  function conLvlUp () {
    myGladiator.con += 1
    myGladiator.blockValue += 1
    statCount -= 1
    if (statCount === 0){
      increaseDisable = true
      continueDisable = false
    }
  }

//----------------------------BEGIN RENDER HTML-----------------------------------
  const renderTutorialScreen = () => {
    if (tutorial === true) {
      return (
        <div className="overlay-container">
          <div className="intro-screen">
            <h5 className="message-title">Prepare for Battle!</h5>
            <h5 className="message-text">You have chosen the mighty {myGladiator.name} as your champion! You can view your gladiator's battle attributes and skills. Once you are ready to start, select a battle and press Fight!</h5>
            <h5 className="message-text">Completing battles will earn experience for your gladiator and unlock the next battle in the tournament. You may replay battles as many times as you want for fun and additional experience!</h5>
            <NavLink to="/staging"><button onClick={tutorial=false}>CONTINUE</button></NavLink>
          </div>
        </div>
      );
    }  
  }

  const renderLevelScreen = () => {
    if (myGladiator.levelUp === true) {
      return (
        <div className="overlay-container">
          <div className="level-up">
            <h2>Level Up!</h2>
            <h2>{skillUnlockMessage}</h2>
            <h2>Remaining points: {statCount} </h2>
            <h2>STR: {myGladiator.str} <NavLink to="/staging"><button disabled={increaseDisable} onClick={strLvlUp}>+</button></NavLink></h2>
            <h2>DEX: {myGladiator.dex} <NavLink to="/staging"><button disabled={increaseDisable} onClick={dexLvlUp}>+</button></NavLink></h2>
            <h2>CON: {myGladiator.con} <NavLink to="/staging"><button disabled={increaseDisable} onClick={conLvlUp}>+</button></NavLink></h2>
            <NavLink to="/staging"><button disabled={continueDisable} onClick={continueLvl}>Continue</button></NavLink>
          </div>
        </div>
      );
    }  
  }

  return (
    <div className="staging-bg">
    <div className="flex-column">

      {renderTutorialScreen()}
      {renderLevelScreen()}

      
      <div class="topleft">
        <div className="quadrant-container">
        <div className={`char-screen ${myGladiator.styleName}`}>{myGladiator.name}</div>
        </div>

      </div>
      <div class="bottomleft">
        <div className="quadrant-container">
                <h2>Level: {myGladiator.level}</h2>
                <h2>EXP: {myGladiator.exp} / {myGladiator.nextLvlExp}</h2>
                <h2>HP: {myGladiator.hp}</h2>
                <h2>AC: {myGladiator.ac}</h2>
                <h2>STR: {myGladiator.str} </h2>
                <h2>DEX: {myGladiator.dex}</h2>
                <h2>CON: {myGladiator.con}</h2>
                <NavLink to="/staging"><button onClick={tempLvlUp}>LVL UP</button></NavLink>
                <h2>SKILLS:</h2>
                <div className="center-skills">
                  {skillArray.map((skill) => (
                    <img key={skill.id} alt="skill" data-border="true" data-effect="solid" data-html="true" data-tip={`<h3>${skill.name}</h3> <h4>Unlocks: Level ${skill.lvlUnlock}</h4> ${skill.description}`} data-class="tooltip" src={require(`./assets/images/skills/${skill.animation}.png`)} className={`skill-icon`}></img>
                  ))}
                  <ReactTooltip />
                </div>
            </div>

      </div>
      <div class="topright">
      
          <div className="overflow">
              {opponentArray.map((battle) => (
                <div key={battle.id} className="justify-center">
                <div tabIndex={battle.unlocked} key={battle.id} className={`arena-select ${battle.addClass}`} onFocus={() => dispatch(setOpponent(battle))}><div className="fl-left"><h2>{battle.battleTitle}</h2></div><div className="fl-right mini-arena"></div></div>
                </div>
              ))}
            </div>
          

      </div>
      <div class="bottomright">
        <div className="quadrant-container">
            <div className="char-screen">
                <h2>{opponent.battleTitle}</h2>
                <h2>{opponent.name}</h2>
                <h2>{opponent.difficulty}</h2>
                <div className="justify-center">
                  <NavLink to="/arena"><button>FIGHT!</button></NavLink>
                </div>
                <Route path="/arena" component={Arena}/>
              </div>
        </div>

      </div>











      {/* {renderTutorialScreen()}
      {renderLevelScreen()}
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
                <h2>EXP: {myGladiator.exp} / {myGladiator.nextLvlExp}</h2>
                <h2>HP: {myGladiator.hp}</h2>
                <h2>AC: {myGladiator.ac}</h2>
                <h2>STR: {myGladiator.str} </h2>
                <h2>DEX: {myGladiator.dex}</h2>
                <h2>CON: {myGladiator.con}</h2>
                <h2>WEAPONS: {myGladiator.weapons}</h2>
                <NavLink to="/staging"><button onClick={tempLvlUp}>LVL UP</button></NavLink>
                <h2>SKILLS:</h2>
                <div>
                  {skillArray.map((skill) => (
                    <img key={skill.id} alt="skill" data-border="true" data-effect="solid" data-html="true" data-tip={`<h3>${skill.name}</h3> <h4>Unlocks: Level ${skill.lvlUnlock}</h4> ${skill.description}`} data-class="tooltip" src={require(`./assets/images/skills/${skill.animation}.png`)} className={`skill-icon`}></img>
                  ))}
                  <ReactTooltip />
                </div>
              </div>
            </div>
          </div>  
        <div className="staging-select">
          <h2>ARENA</h2>
          <div className="justify-center">
            <div className = "overflow">
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
      <Route path="/arena" component={Arena}/> */}
    </div>
    </div>
  );
}


