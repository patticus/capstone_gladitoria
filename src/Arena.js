import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import { Route, NavLink } from "react-router-dom";
import Staging from "./Staging";
import { useSelector, useDispatch } from "react-redux";
import {
  attack,
  critAttack,
  riposte,
  opponentAttack,
  blockedAttack,
  resetHealth,
  endTurn,
  skillBuff,
  skill,
  setSkill,
  opponentDisabled,
  poisonDmg,
  bleedDmg,
} from "./actions";
import {
  diceRoll,
  sleep,
  applyPoisonStyle,
  oppGetHurt,
  dodgeShake,
  oppAttackAnimation,
  closeDropup,
  openDropup,
  bleedTickAnimation,
  displayDmgNumber,
  animateBuff
} from "./data/functions";
import ClickNHold from "react-click-n-hold";
import Gladiator from "./models/Gladiator";
import Opponent from "./models/Opponent";

// PNG assets
import riposteImage from './assets/images/animations/riposte.gif';
import { OpponentType } from "./data/opponentData";


export default function Arena() {
  const dispatch = useDispatch();
  const {
    battleState,
    myGladiator,
    opponent,
    opponentArray,
    allSkills,
    mySkill,
    activeBuffs,
  } = useSelector((state) => ({
    battleState: state.BattleState,
    myGladiator: state.ChosenGladiator.chosen,
    opponent: state.ChosenOpponent.chosenOpp,
    opponentArray: state.OpponentReducer,
    allSkills: state.SkillsReducer,
    mySkill: state.SelectedSkill.mySkill,
    activeBuffs: state.BattleState.activeBuffs,
  }));

  // Setting skills for use in combat. skillArray will contain all usable skills by gladiator at its current level
  const skillArray = allSkills.filter(
    (skill) => skill.gladiator === myGladiator.name && myGladiator.level >= skill.lvlUnlock && !skill.passive
  );

  const [gladiator] = useState(new Gladiator(myGladiator, activeBuffs, dispatch));
  const [chosenOpponent] = useState(new Opponent(opponent));

  const [riposteAnimation, setRiposteAnimation] = useState(null);
  const [attackAnimation, setAttackAnimation] = useState({enabled: false});


  let myHit = 0;

  /*---------------------PASSIVES, BUFFS AND BUFF DURATIONS---------------------------*/

  function animateAttack(dualWield){
    setAttackAnimation({enabled: true, dualWield});
    setTimeout(() => {
      setAttackAnimation({enabled: false})
    }, 300)
  }

  //Riposte function will activate during opponent turn (on successful block)

  async function riposteAttack() {
    await sleep(200);
    setRiposteAnimation(true);
    const myHit = diceRoll(gladiator.maxDmg) + gladiator.dmgBonus + gladiator.toHitBonus;
    dispatch(riposte(myHit));
    animateAttack();
    displayDmgNumber(myHit, "skill-number");
    setTimeout(() => {
      setRiposteAnimation(false);
    }, 500);
  }

  // Decrements buff durations every time player turn is activated

  /*---------------------COMBAT---------------------------*/

  useEffect(() => {
    gladiator.updateGladiator(myGladiator);
    gladiator.setActiveBuffs(activeBuffs);

  }, [myGladiator])

  useEffect(() => {
    if (battleState.playerTurn) {
      //Events that happen at the start of *MY TURN

      console.log(myGladiator.blocked + "REEEEEEE");

      if ("riposte" in activeBuffs && gladiator.blocked) {
        riposteAttack();
      }
      gladiator.decrementBuffDuration();

  
    } else if (!battleState.playerTurn && opponent.hp > 0) {
      //Events that happen at the start of *OPPONENT TURN
      switch (opponent.id) {
        default:
        case OpponentType.SLAVE:
          opponentTurn(false);
          break;
        case OpponentType.UNCAGED_BEAST:
        case OpponentType.GLADIATRIX:
        case OpponentType.ROMAN_PRAETORIAN:
        case OpponentType.MAXIMUS:
          opponentTurn(false);
          opponentTurn(false);
          break;
      }
    }
  }, [battleState.playerTurn]);

  /*---------------------COMBAT MY TURN---------------------------*/

  //**ADD DIFFERENT AC VALUES FOR DIFFERENT BODY PARTS!
  function normalAttack(e) {
    if (gladiator.passiveEffect === "sever") {
      gladiator.critChance += 15;
    }
    const critRoll = diceRoll(100);
    const atkRoll = diceRoll(20);

    let anim = document.createElement("img");

    //CRIT condition
    if (critRoll <= gladiator.critChance) {
      myHit = Math.ceil(gladiator.maxDmg * 1.5) + gladiator.dmgBonus;
      dispatch(critAttack(myHit));
      if ("poisonTrident" in activeBuffs) {
        battleState.poisoned = true;
        gladiator.stack += 1;
      }
      anim.className = "attack-animation";
      anim.src = require(`./assets/images/animations/crit2.gif`);
      oppGetHurt();

      displayDmgNumber(myHit, "crit-number");
      //HIT condition
    } else if (atkRoll + gladiator.toHitBonus >= opponent.ac) {
      myHit = diceRoll(gladiator.maxDmg) + gladiator.dmgBonus;
      dispatch(attack(myHit));

      if ("poisonTrident" in activeBuffs) {
        battleState.poisoned = true;
        gladiator.stack += 1;
      }
      anim.className = "attack-animation";
      anim.src = require(`./assets/images/animations/atk${diceRoll(2)}.gif`);
      oppGetHurt();
      displayDmgNumber(myHit, "hit-number");
      //MISS condition
    } else {
      myHit = 0;
      anim.className = "attack-animation";
      anim.src = require("./assets/images/animations/miss.gif");
      dodgeShake();
      dispatch(attack(myHit));
      displayDmgNumber(myHit, "hit-number");
    }
    anim.style.left = e.clientX - 96 + "px";
    anim.style.top = e.clientY - 96 + "px";
    document.body.appendChild(anim);
    setTimeout(() => {
      anim.parentNode.removeChild(anim);
    }, 500);
  }

  //SECONDARY attack when dual wield triggers
  function dualWieldAttack() {
    const critRoll = diceRoll(100);
    const atkRoll = diceRoll(20);
    let anim = document.createElement("img");
    //CRIT condition
    if (critRoll <= gladiator.critChance) {
      myHit = Math.ceil(gladiator.maxDmg * 1.5) + gladiator.dmgBonus;
      dispatch(critAttack(myHit));
      anim.className = "attack-animation";
      anim.src = require(`./assets/images/animations/crit2.gif`);
      displayDmgNumber(myHit, "crit-number");
      //HIT condition
    } else if (atkRoll + gladiator.toHitBonus >= opponent.ac) {
      myHit = diceRoll(gladiator.maxDmg) + gladiator.dmgBonus;
      dispatch(attack(myHit));
      anim.className = "attack-animation";
      anim.src = require(`./assets/images/animations/atk3.gif`);
      displayDmgNumber(myHit, "hit-number");
      //MISS condition
    } else {
      myHit = 0;
      anim.className = "attack-animation";
      anim.src = require("./assets/images/animations/miss.gif");
      dispatch(attack(myHit));
      displayDmgNumber(myHit, "hit-number");
    }
    document.getElementsByClassName("center-screen")[0].appendChild(anim);
    setTimeout(() => {
      anim.parentNode.removeChild(anim);
    }, 500);
  }

  /* FULL ATTACK ROLL */

  async function myAttackRoll(e) {
    animateAttack(false);
    if (gladiator.passiveEffect === "dual-wield") {
      let dwRoll = diceRoll(20) + gladiator.toHitBonus;
      if (dwRoll >= 1) {
        normalAttack(e);
      }
      setTimeout(() => {
        dualWieldAttack(e);
      }, 200);
      setTimeout(() => {
        animateAttack(true);
      }, 200);
    } else {
      normalAttack(e);
    }
    if (battleState.poisoned) {
      applyPoisonStyle();
      dispatch(poisonDmg(gladiator.stack));
      displayDmgNumber(gladiator.stack, "poison-number");
    }
    if (battleState.bleeding) {
      bleedTickAnimation();
      dispatch(bleedDmg(gladiator.bleedTick));
      displayDmgNumber(gladiator.bleedTick, "bleed-number");
    }

    await sleep(300);
    dispatch(endTurn());
  }

  /* ------------------SKILLS------------------*/

  async function mySkillAttack() {
    // Functions with sleep require async

    if (mySkill.uses > 0) {
      let anim = document.createElement("img");
      if (mySkill.buff === true) {
        dispatch(skillBuff(mySkill.buffEffect));
        animateBuff(mySkill.buffEffect.name);
      } else {
        while (mySkill.attacks > 0) {
          myHit = diceRoll(Math.ceil(gladiator.maxDmg * mySkill.multiplier)) + gladiator.dmgBonus + mySkill.dmgBonus;
          switch (mySkill.name) {
            case "Execute":
              myHit += mySkill.executeBonus(opponent.hp, chosenOpponent.hp, opponent.disabled);
              break;
            case "Shield Bash":
              myHit += myGladiator.blockValue;
              break;
            case "Pinpoint":
              myHit += gladiator.toHitBonus;
              chosenOpponent.attackSpeed += gladiator.dex * 10;
              break;
            default:
              break;
          }
          //send dmg to reducer
          dispatch(skill(myHit));
          //Animate player weapons
          if (mySkill.attacks === 2) {
            animateAttack(true);
          } else {
            animateAttack(false);
          }
          //animate opponent getting hurt
          oppGetHurt();
          //skill animation
          anim.className = `${mySkill.animContainer}`;
          anim.src = require(`./assets/images/animations/${mySkill.animation}${mySkill.attacks}.gif`);
          document.getElementsByClassName("center-screen")[0].appendChild(anim);
          setTimeout(() => {
            anim.parentNode.removeChild(anim);
          }, 550);
          displayDmgNumber(myHit, "skill-number");
          await sleep(550);
          mySkill.attacks -= 1;
        }
      }
      if (mySkill.bleed || battleState.bleeding) {
        dispatch(bleedDmg(gladiator.bleedTick));
        displayDmgNumber(gladiator.bleedTick, "bleed-number");
      }
      if (battleState.poisoned) {
        dispatch(poisonDmg(gladiator.stack));
        displayDmgNumber(gladiator.stack, "poison-number");
      }
      opponent.disabled = diceRoll(mySkill.disableTurns);
      mySkill.uses -= 1;
      mySkill.used = true;
      mySkill.addClass = "grayscale";
      dispatch(endTurn());
    }
  }

  /*---------------------COMBAT OPPONENT TURN-------------------------*/
  //All actions in opponent's turn
  /*MultiHitCheck parameter is used for opponent attacking multiple times in a round, so that the player must block all attacks to gain benefits. Default is false, and when there are multiple attacks they should be true until the last one which should be false. */
  async function opponentTurn(multiHitCheck) {
    //setup
    myGladiator.blocked = false;
    let anim = document.createElement("img");
    anim.className = `opponent-animation`;

    //Disabled condition
    if (opponent.disabled > 0) {
      await sleep(1300);
      opponent.disabled -= 1;
      dispatch(opponentDisabled(mySkill.disableMessage));
    } else {
      //Making tap to block animation appear at random location
      await sleep(diceRoll(opponent.attackSpeed) + 1000);
      let blockTappy = document.createElement("img");
      blockTappy.className = "tap-to-block";
      blockTappy.style.left = diceRoll(100) + "%";
      blockTappy.style.bottom = diceRoll(100) + "%";
      blockTappy.src = require(`./assets/images/animations/block-pulse.gif`);
      blockTappy.addEventListener("click", function () {
        myGladiator.blocked = true;
        if ("rage" in activeBuffs) {
          gladiator.stack += 1;
        }
      });
      document.getElementsByClassName("block-area")[0].appendChild(blockTappy);
      setTimeout(() => {
        blockTappy.parentNode.removeChild(blockTappy);
      }, opponent.attackSpeed);

      //Preparing opponent attack
      await sleep(1300);
      let atkRoll = diceRoll(20);

      //Check for character for "Prod" passive
      if (gladiator.passiveEffect === "prod") {
        atkRoll -= 3;
      }
      let oppHit = 0;
      //Block attack condition
      if (myGladiator.blocked === true) {
        anim.src = require(`./assets/images/animations/block.gif`);
        if (atkRoll + chosenOpponent.toHitBonus >= gladiator.ac) {
          oppHit = diceRoll(opponent.maxDmg) + opponent.dmgBonus;
        } else {
          oppHit = 0;
        }
        oppHit -= gladiator.blockValue;
        if (oppHit < 0) {
          oppHit = 0;
        }
        dispatch(blockedAttack(oppHit, gladiator.blockValue));
        //parameter is used so player needs to block all attacks
        myGladiator.blocked = !multiHitCheck;

        // Crit condition
      } else if (atkRoll === 20) {
        anim.src = require(`./assets/images/animations/bloodsplat-crit.gif`);
        oppHit = Math.ceil(opponent.maxDmg * 1.5) + opponent.dmgBonus;
        dispatch(opponentAttack(oppHit));

        // Normal Hit condition
      } else if (atkRoll + chosenOpponent.toHitBonus >= gladiator.ac) {
        anim.src = require(`./assets/images/animations/bloodsplat${diceRoll(3)}.gif`);
        oppHit = diceRoll(opponent.maxDmg) + opponent.dmgBonus;
        dispatch(opponentAttack(oppHit));
        //Miss condition
      } else {
        anim.src = require(`./assets/images/animations/opponentmiss.gif`);
        dispatch(opponentAttack(null));
      }

      //Applying animations
      oppAttackAnimation();
      document.getElementsByClassName("center-screen")[0].appendChild(anim);
      setTimeout(() => {
        anim.parentNode.removeChild(anim);
      }, 500);
    }
  }

  /*-----------------------VICTORY CONDITIONS-------------------------------*/
  //Assigns next opponent to be unlocked upon victory
  let nextOpponent = opponentArray[opponent.id + 1];

  function unlockNext() {
    nextOpponent.unlocked = 1;
    nextOpponent.addClass = "";
    opponentArray[opponent.id + 1] = nextOpponent;
  }

  //Victory function resets hp, returns skill uses, adds exp
  function victory() {
    battleState.playerTurn = true;
    opponent.disabled = false;
    opponent.attackSpeed = opponent.baseAtkSpeed;
    gladiator.resetBase();
    dispatch(resetHealth()); // Resets health after battle is complete - reducer does both player and opponent health reset
    unlockNext(); //unlock next opponent battle
    myGladiator.blocked = false;
    allSkills.forEach((skill) => {
      // Resets skill usage
      skill.used = false;
      skill.attacks = skill.maxAttacks;
      skill.uses = skill.maxUses;
      skill.addClass = "";
      if (skill.buff === true) {
        skill.buffEffect.duration = skill.buffEffect.maxDuration;
      }
    });
    myGladiator.exp += opponent.expVal; // Gives player exp
    if (myGladiator.exp >= myGladiator.nextLvlExp) {
      myGladiator.levelUp = true;
    }
  }

  /*-----------------DEFEAT CONDITION------------------*/

  if (gladiator.hp < 1) {
    alert("You Died");
  }

  /*---------------------START HTML RENDER-------------------------*/

  const renderClickNHold = () => {
    if (mySkill.uses > 0) {
      return (
        <ClickNHold time={1.2} onClickNHold={mySkillAttack}>
          <div
            className={`opponent ${opponent.styleName}`}
            disabled={!battleState.playerTurn}
            onClick={myAttackRoll}
          ></div>
        </ClickNHold>
      );
    } else {
      return (
        <div
          className={`opponent ${opponent.styleName}`}
          disabled={!battleState.playerTurn}
          onClick={myAttackRoll}
        ></div>
      );
    }
  };

  const renderVictoryScreen = () => {
    if (chosenOpponent.hp < 1) {
      return (
        <div className="overlay-container">
          <div className="center-screen">
            <h1>VICTORY!</h1>
            <NavLink to="/staging">
              <button onClick={victory}>CONTINUE</button>
            </NavLink>
          </div>
          <Route path="/staging" component={Staging} />
        </div>
      );
    }
  };

  return (
    <div className="arena-bg">
      {renderVictoryScreen()}
      <div className="top-center">
        <div className="lefta stroke">
          <h2>Opponent: {opponent.name} </h2>
        </div>
        <div className="centera stroke">
          <h2>
            HP: {chosenOpponent.hp} / {opponent.hp}{" "}
          </h2>
        </div>
      </div>

      <div className="center-screen">
        {riposteAnimation && <img src={riposteImage} className="skill-animation" />}
        <div className="justify-center disable-message stroke">{battleState.disableMessage}</div>
        <div className="justify-center dmg-num-top stroke"></div>
        <div className="opponent-container" id="shakeContainer">
          {renderClickNHold()}
        </div>
        <div className="justify-center dmg-num-bottom stroke" id="bottom-message">
          {battleState.oppHitMessage}
        </div>
        <div className="block-area"></div>
        <img
          alt="weapons"
          style={{ zIndex: 2 }}
          src={
            attackAnimation.enabled
              ? attackAnimation.dualWield
                ? gladiator.dualWieldImage
                : gladiator.attackImage
              : gladiator.weaponImage
          }
          className="weapons-container"
          id="weaponBuff"
        ></img>
      </div>

      <div className="bottom-center" disabled={!battleState.playerTurn}>
        <div className="dropup righta stroke">
          <div className="dropbtn" onClick={openDropup}>
            SKILL
          </div>
          <div className="dropup-content">
            {skillArray.map((skill) => (
              <div
                key={skill.id}
                disabled={skill.used}
                className={skill.addClass}
                onClick={() => {
                  dispatch(setSkill(skill));
                  closeDropup();
                }}
              >
                <img
                  alt="skill"
                  src={require(`./assets/images/skills/${skill.animation}.png`)}
                  className={`skill-icon`}
                ></img>
                <p>{skill.name}</p>
              </div>
            ))}
          </div>
        </div>
        {/* <div className="dropup righta stroke"><h2>{mySkill.name} </h2>
        
        </div> */}
        <div className="righta">
          <img
            alt="selected-skill"
            data-border="true"
            data-effect="solid"
            data-html="true"
            data-tip={`<h3>${mySkill.name}</h3> <h4>Unlocks: Level ${mySkill.lvlUnlock}</h4> ${mySkill.description}`}
            data-class="tooltip"
            src={require(`./assets/images/skills/${mySkill.animation}.png`)}
            className={`skill-icon ${mySkill.addClass}`}
          ></img>
          <ReactTooltip />
        </div>
        <div className="centera stroke">
          <h2>
            HP: {gladiator.hp} / {myGladiator.hp}
          </h2>
        </div>
      </div>
    </div>
  );
}
