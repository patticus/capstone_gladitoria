import React from "react";
import {
  Route,
  NavLink,
} from "react-router-dom";
import Arena from "./Arena";
import { useSelector, useDispatch } from 'react-redux';
import { setOpponent } from "./actions";
import { diceRoll } from './data/funtions'
 
export default function Staging() {

  const dispatch = useDispatch()
  const opponentArray = useSelector(state => state.OpponentReducer) //Array of all opponent objects
  const opponent = useSelector(state => state.ChosenOpponent.chosenOpp) //Selected opponent object
  const myGladiator = useSelector(state => state.ChosenGladiator.chosen) //Chosen gladiator object
  const allSkills = useSelector(state => state.SkillsReducer)
  const skillArray = [];
  
  allSkills.map((skill) => {
    if (skill.gladiator === myGladiator.name){
      skillArray.push(skill)
    }
    return skillArray
  });

  let conBonus = 0;
  if (myGladiator.con > 14){
    conBonus += (myGladiator.con - 14)
  }

  function levelUp () {
    myGladiator.level += 1
    myGladiator.hp += (diceRoll(10) + conBonus)
    myGladiator.exp = 0
    myGladiator.nextLvlExp += myGladiator.nextLvlExp + (myGladiator.level * 100)
    myGladiator.levelUp = false
  }

  function acLvlUp () {
    levelUp()
    myGladiator.ac += 1
  }

  function strLvlUp () {
    levelUp()
    myGladiator.str += 1
  }

  function dexLvlUp () {
    levelUp()
    myGladiator.dex += 1
  }

  function conLvlUp () {
    levelUp()
    myGladiator.con += 1
  }

  if (myGladiator.levelUp === false) {
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
                  <h2>EXP: {myGladiator.exp} / {myGladiator.nextLvlExp}</h2>
                  <h2>HP: {myGladiator.hp}</h2>
                  <h2>AC: {myGladiator.ac}</h2>
                  <h2>STR: {myGladiator.str} </h2>
                  <h2>DEX: {myGladiator.dex}</h2>
                  <h2>CON: {myGladiator.con}</h2>
                  <h2>WEAPONS: {myGladiator.weapons}</h2>
                  <NavLink to="/staging"><button onClick={levelUp}>LVL UP</button></NavLink>
                  <h2>SKILLS:</h2>
                  <div>
                    {skillArray.map((skill) => (
                      <div className={`skill-icon ${skill.styleName}`}>{skill.name}</div>
                    ))}
                  </div>
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
  } else {
    return (
      <div className="flex-column"> 
        <div className="overlay-container">
          <div className="level-up">
            <h2>Level Up!</h2>
            <h2>AC: {myGladiator.ac} <NavLink to="/staging"><button onClick={acLvlUp}>+</button></NavLink></h2>
            <h2>STR: {myGladiator.str} <NavLink to="/staging"><button onClick={strLvlUp}>+</button></NavLink></h2>
            <h2>DEX: {myGladiator.dex} <NavLink to="/staging"><button onClick={dexLvlUp}>+</button></NavLink></h2>
            <h2>CON: {myGladiator.con} <NavLink to="/staging"><button onClick={conLvlUp}>+</button></NavLink></h2>
          </div>
        </div>
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
}

