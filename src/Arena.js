import React, { useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { Route, NavLink } from "react-router-dom";
import Staging from "./Staging";
import { useSelector, useDispatch } from "react-redux";
import {
  forfeit,
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
  logOut,
  heal,
} from "./actions";
import {
  diceRoll,
  sleep,
  fadeOut,
  applyPoisonStyle,
  oppGetHurt,
  dodgeShake,
  oppAttackAnimation,
  closeDropup,
  openDropup,
  bleedTickAnimation,
  animatePlayerAttack,
  animateDualWieldAttack,
  displayDmgNumber,
  displayHurtNumber,
  animateBuff,
  addActiveBuff,
  preventContextMenu,
  insults,
  insultsGladiatrix,
  insultsMaximus,
  insultsPep
} from "./data/functions";
import ClickNHold from "react-click-n-hold";

let tutorial = true;
let hint = true;
let forfeitMessage = false;
let stack = 0;
let decapitate = false;

export default function Arena() {
  const dispatch = useDispatch();
  const battleState = useSelector((state) => state.BattleState);
  const myGladiator = useSelector((state) => state.ChosenGladiator.chosen);
  const opponent = useSelector((state) => state.ChosenOpponent.chosenOpp);
  const opponentArray = useSelector((state) => state.OpponentReducer);
  const allSkills = useSelector((state) => state.SkillsReducer);
  let mySkill = useSelector((state) => state.SelectedSkill.mySkill);
  let skillArray = [];
  let activeBuffs = battleState.activeBuffs;

  // Setting skills for use in combat. skillArray will contain all usable skills by gladiator at its current level
  allSkills.map((skill) => {
    if (
      skill.gladiator === myGladiator.name &&
      myGladiator.level >= skill.lvlUnlock &&
      !skill.passive
    ) {
      skillArray.push(skill);
    }
    return skillArray;
  });

  /*---------------------STAT DECLARATIONS-------------------------*/
  let opponentHP = opponent.hp + battleState.opponentHealth;
  let currentHP = myGladiator.hp + battleState.playerHealth;
  let myHit;
  let oppHit;
  let atkRoll;
  let critRoll;
  let passiveEffect;
  let bleedTick;
  let myAC = myGladiator.ac;
  let critChance = myGladiator.critChance;
  let toHitBonus = myGladiator.dex - 15;
  let dmgBonus = myGladiator.str - 15;
  let conBonus = myGladiator.con - 15;
  let oppToHitBonus = opponent.toHitBonus;
  let blockValue = myGladiator.blockValue;
  let reactionTime = 0;
  

  //Applies Dex and STR bonuses to hit and damage

  //Applies passive skill at level 4

  if (myGladiator.level >= 4) {
    myGladiator.passiveUnlocked = true;
    passiveEffect = myGladiator.passiveEffect;
  }

  //Each gladiator has a different bleed tick damage
  switch (myGladiator.name) {
    case "Dimachaerus":
      bleedTick = 1;
      break;
    case "Secutor":
      bleedTick = Math.ceil(dmgBonus / 3);
      break;
    case "Retiarius":
      bleedTick = Math.ceil(dmgBonus / 2) + 3;
      break;
    default:
      break;
  }

  /*---------------------PASSIVES, BUFFS AND BUFF DURATIONS---------------------------*/

  //Riposte function will activate during opponent turn (on successful block)
  async function riposteAttack() {
    await sleep(200);
    let anim = document.createElement("img");
    myHit = diceRoll(myGladiator.maxDmg) + dmgBonus + toHitBonus;
    dispatch(riposte(myHit));
    animatePlayerAttack(myGladiator.name);
    displayDmgNumber(myHit, "skill-number");
    anim.className = "skill-animation";
    anim.src = require(`./assets/images/animations/riposte.gif`);
    document.getElementsByClassName("center-screen")[0].appendChild(anim);
    setTimeout(() => {
      anim.parentNode.removeChild(anim);
    }, 500);
  }

  if ("rage" in activeBuffs) {
    if (stack > 5) {
      stack = 5;
    }
    dmgBonus += stack;
    reactionTime += myGladiator.str * 10;
  }

  if ("champion" in activeBuffs) {
    dmgBonus += 3;
    myAC += 3;
    critChance += 20;
    toHitBonus += 3;
    blockValue += 3;
    reactionTime += 100;
  }

  // Decrements buff durations every time player turn is activated
  function decrementBuffDuration() {
    if ("rage" in activeBuffs) {
      activeBuffs.rage.duration -= 1;
      if (activeBuffs.rage.duration === 0) {
        document.getElementById("weaponBuff").classList.remove("rage-active");
        delete activeBuffs.rage;
      }
    }
    if ("riposte" in activeBuffs) {
      activeBuffs.riposte.duration -= 1;
      if (activeBuffs.riposte.duration === 0) {
        document
          .getElementById("weaponBuff")
          .classList.remove("riposte-active");
        delete activeBuffs.riposte;
      }
    }
    if ("poisonTrident" in activeBuffs) {
      activeBuffs.poisonTrident.duration -= 1;
      if (activeBuffs.poisonTrident.duration === 0) {
        document
          .getElementById("weaponBuff")
          .classList.remove("poisonTrident-active");
        delete activeBuffs.poisonTrident;
      }
    }
    if ("champion" in activeBuffs) {
      activeBuffs.champion.duration -= 1;
      if (activeBuffs.champion.duration === 0) {
        document
          .getElementById("weaponBuff")
          .classList.remove("champion-active");
        delete activeBuffs.champion;
      }
    }
  }

  /*---------------------COMBAT---------------------------*/

  useEffect(() => {
    if (battleState.playerTurn) {
      //Events that happen at the start of *MY TURN

      console.log(myGladiator.blocked + "meee");

      if ("riposte" in activeBuffs && myGladiator.blocked) {
        riposteAttack();
      }
      decrementBuffDuration();
    } else if (!battleState.playerTurn && opponentHP > 0) {
      //Events that happen at the start of *OPPONENT TURN
      async function opponentDoubleAttack() {
        opponentTurn(true);
        await sleep(200);
        opponentTurn(false);
      }
      switch (opponent.id) {
        case 0:
          opponentTurn(false);
          break;
        case 6:
        case 7:
        case 8:
        case 9:
          opponentTurn(false);
          opponentTurn(false);
          break;
        default:
          opponentTurn(false);
          break;
      }
    }
  }, [battleState.playerTurn]);

  /*---------------------COMBAT MY TURN---------------------------*/

  //**ADD DIFFERENT AC VALUES FOR DIFFERENT BODY PARTS!
  function basicAttack(e) {
    let anim = document.createElement("img");
    if (passiveEffect === "sever") {
      critChance += 15;
    }
    critRoll = diceRoll(100);
    atkRoll = diceRoll(20);
    if (opponent.disabled > 0) {
      atkRoll += 20;
    }

    //Determining X,Y coordinates for body-part attacks
    let element = document.getElementById("shakeContainer");
    let position = element.getBoundingClientRect();
    let x = e.pageX - position.left;
    let y = e.pageY - position.top;
    let bodyPart = "";

    // Setting bodyPart hit based on coordinates tapped
    if (60 < x && x < 140 && 0 < y && y < 63) {
      bodyPart = "head";
    } else if (0 < x && x < 200 && 60 < y && y < 205) {
      bodyPart = "body";
    } else if (30 < x && x < 180 && 205 < y && y < 400) {
      bodyPart = "legs";
    } else {
      bodyPart = "none";
    }

    //HEAD STRIKE!
    if (bodyPart === "head") {
      //CRIT condition
      if (critRoll <= critChance) {
        myHit = Math.ceil(
          (myGladiator.maxDmg * 1.5 + dmgBonus) * opponent.headModifier
        );
        dispatch(critAttack(myHit));
        if ("poisonTrident" in activeBuffs) {
          battleState.poisoned = true;
          stack += 1;
        }
        if (myHit >= opponentHP) {
          document.getElementsByClassName("opponent")[0].classList.add(opponent.styleDecapitate)
        }
        anim.className = "attack-animation";
        anim.src = require(`./assets/images/animations/crit2.gif`);
        oppGetHurt();
        displayDmgNumber(myHit, "crit-number");
        //HIT condition
      } else if (atkRoll + toHitBonus >= opponent.headAC) {
        myHit = Math.ceil(
          (diceRoll(myGladiator.maxDmg) + dmgBonus) * opponent.headModifier
        );
        dispatch(attack(myHit));
        if ("poisonTrident" in activeBuffs) {
          battleState.poisoned = true;
          stack += 1;
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
        //insult
        let insult = diceRoll(3);
        if (insult === 3) {
          hurlInsult();
        }
      }
    }

    //BODY STRIKE!
    if (bodyPart === "body") {
      //CRIT condition
      if (critRoll <= critChance) {
        myHit = Math.ceil(
          (myGladiator.maxDmg * 1.5 + dmgBonus) * opponent.bodyModifier
        );
        dispatch(critAttack(myHit));
        if ("poisonTrident" in activeBuffs) {
          battleState.poisoned = true;
          stack += 1;
        }
        anim.className = "attack-animation";
        anim.src = require(`./assets/images/animations/crit2.gif`);
        oppGetHurt();
        displayDmgNumber(myHit, "crit-number");
        //HIT condition
      } else if (atkRoll + toHitBonus >= opponent.bodyAC) {
        myHit = Math.ceil(
          (diceRoll(myGladiator.maxDmg) + dmgBonus) * opponent.bodyModifier
        );
        dispatch(attack(myHit));
        if ("poisonTrident" in activeBuffs) {
          battleState.poisoned = true;
          stack += 1;
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
        //insult
        let insult = diceRoll(3);
        if (insult === 3) {
          hurlInsult();
        }
      }
    }

    //LEGS STRIKE!
    if (bodyPart === "legs") {
      //CRIT condition
      if (critRoll <= critChance) {
        myHit = Math.ceil(
          (myGladiator.maxDmg * 1.5 + dmgBonus) * opponent.legsModifier
        );
        dispatch(critAttack(myHit));
        if ("poisonTrident" in activeBuffs) {
          battleState.poisoned = true;
          stack += 1;
        }
        if (passiveEffect === "sever") {
          let severChance = diceRoll(2);
          if (severChance === 1) {
            document.getElementsByClassName("opponent")[0].classList.add(opponent.styleLegSever)
            dispatch(bleedDmg(bleedTick));
            displayDmgNumber(bleedTick, "bleed-number");
          }
        }
        anim.className = "attack-animation";
        anim.src = require(`./assets/images/animations/crit2.gif`);
        oppGetHurt();
        displayDmgNumber(myHit, "crit-number");
        //HIT condition
      } else if (atkRoll + toHitBonus >= opponent.legsAC) {
        myHit = Math.ceil(
          (diceRoll(myGladiator.maxDmg) + dmgBonus) * opponent.legsModifier
        );
        dispatch(attack(myHit));
        if ("poisonTrident" in activeBuffs) {
          battleState.poisoned = true;
          stack += 1;
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
        //insult
        let insult = diceRoll(3);
        if (insult === 3) {
          hurlInsult();
        }
      }
    }

    //YOU DIDN'T CLICK THE BODY LOL
    if (bodyPart === "none") {
      myHit = 0;
      anim.className = "attack-animation";
      anim.src = require("./assets/images/animations/miss.gif");
      dodgeShake();
      dispatch(attack(myHit));
      displayDmgNumber(myHit, "hit-number");
      //insult
      hurlInsult();
    }

    anim.style.left = e.clientX - 96 + "px";
    anim.style.top = e.clientY - 96 + "px";
    document.body.appendChild(anim);
    setTimeout(() => {
      anim.parentNode.removeChild(anim);
    }, 500);

    console.log(bodyPart + "hit!");
    console.log("X: " + x + " Y: " + y);
  }

  //SECONDARY attack when dual wield triggers
  function dualWieldAttack() {
    critRoll = diceRoll(100);
    atkRoll = diceRoll(20);
    atkRoll -= 5;
    let anim = document.createElement("img");
    //CRIT condition
    if (critRoll <= critChance) {
      myHit = Math.ceil(
        (diceRoll(myGladiator.maxDmg) + dmgBonus) * opponent.bodyModifier
      );
      dispatch(critAttack(myHit));
      anim.className = "attack-animation";
      anim.src = require(`./assets/images/animations/crit2.gif`);
      displayDmgNumber(myHit, "crit-number");
      //HIT condition
    } else if (atkRoll + toHitBonus >= opponent.bodyAC) {
      myHit = Math.ceil(
        (diceRoll(myGladiator.maxDmg) + dmgBonus) * 0.4 * opponent.bodyModifier
      );
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
    animatePlayerAttack(myGladiator.name);
    if (passiveEffect === "dual-wield") {
      basicAttack(e);
      setTimeout(() => {
        animateDualWieldAttack(myGladiator.name);
      }, 250);
      setTimeout(() => {
        dualWieldAttack(e);
      }, 250);
    } else {
      basicAttack(e);
    }
    if (battleState.poisoned) {
      applyPoisonStyle();
      dispatch(poisonDmg(stack));
      displayDmgNumber(stack, "poison-number");
    }
    if (battleState.bleeding) {
      bleedTickAnimation();
      dispatch(bleedDmg(bleedTick));
      displayDmgNumber(bleedTick, "bleed-number");
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
          myHit =
            diceRoll(Math.ceil(myGladiator.maxDmg * mySkill.multiplier)) +
            dmgBonus +
            mySkill.dmgBonus;
          switch (mySkill.name) {
            case "Execute":
              myHit += mySkill.executeBonus(
                opponent.hp,
                opponentHP,
                opponent.disabled
              );
              if (myHit >= opponentHP) {
                document.getElementsByClassName("opponent")[0].classList.add(opponent.styleDecapitate)
                decapitate = true
              }
              dispatch(skill(myHit));
              displayDmgNumber(myHit, "skill-number");
              break;
            case "Shield Bash":
              myHit += myGladiator.blockValue;
              dispatch(skill(myHit));
              displayDmgNumber(myHit, "skill-number");
              break;
            case "Pinpoint":
              opponent.attackSpeed += myGladiator.dex * 10;
              let pinPoint1 = diceRoll(
                Math.ceil(myGladiator.dex / 4) + dmgBonus / 2
              );
              dispatch(skill(pinPoint1));
              displayDmgNumber(pinPoint1, "skill-number");
              let pinPoint2 = diceRoll(
                Math.ceil(myGladiator.dex / 4) + dmgBonus / 2
              );
              setTimeout(() => {
                dispatch(skill(pinPoint2));
                displayDmgNumber(pinPoint2, "hit-number");
              }, 150);
              let pinPoint3 = diceRoll(
                Math.ceil(myGladiator.dex / 4) + dmgBonus / 2
              );
              setTimeout(() => {
                dispatch(skill(pinPoint3));
                displayDmgNumber(pinPoint3, "bleed-number");
              }, 300);
              break;
            case "Flurry Rush":
              let flurry1 =
                diceRoll(Math.ceil(toHitBonus)) + Math.ceil(dmgBonus / 2);
              dispatch(skill(flurry1));
              displayDmgNumber(flurry1, "skill-number");
              let flurry2 =
                diceRoll(Math.ceil(toHitBonus)) + Math.ceil(dmgBonus / 2);
              if (mySkill.attacks === 1) {
                let healAmount = Math.ceil((flurry1 + flurry2) / 4) + conBonus;
                dispatch(heal(healAmount));
                displayHurtNumber(healAmount, "heal-number");
                animateBuff("heal");
              }
              setTimeout(() => {
                dispatch(skill(flurry2));
                displayDmgNumber(flurry2, "hit-number");
              }, 250);

              break;
            default:
              dispatch(skill(myHit));
              displayDmgNumber(myHit, "skill-number");
              break;
          }

          //Animate player weapons
          if (mySkill.attacks === 2) {
            animateDualWieldAttack(myGladiator.name);
          } else {
            animatePlayerAttack(myGladiator.name);
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
          

          await sleep(550);
          mySkill.attacks -= 1;
        }
      }
      if (mySkill.bleed || battleState.bleeding) {
        dispatch(bleedDmg(bleedTick));
        displayDmgNumber(bleedTick, "bleed-number");
      }
      if (battleState.poisoned) {
        dispatch(poisonDmg(stack));
        displayDmgNumber(stack, "poison-number");
      }
      opponent.disabled = mySkill.disableTurns;
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
    let charmodel = document.getElementsByClassName("opponent")[0];
    anim.className = `opponent-animation`;
    let skillRoll = diceRoll(20);
    //Disabled condition
    if (opponent.disabled > 0) {
      await sleep(1300);
      opponent.disabled -= 1;
      if (opponent.skillCharging) {
        opponent.hasSkill = false;
        opponent.skillCharging = false;
      }
      dispatch(opponentDisabled(mySkill.disableMessage));
    } else if (opponent.skillCharging) {
      await sleep(500);
      anim.src = require(`./assets/images/animations/bloodsplat-crit.gif`);
      oppHit = Math.ceil(opponent.maxDmg * 3) + opponent.dmgBonus;
      opponent.hasSkill = false;
      opponent.skillCharging = false;
      charmodel.classList.remove("opponent-skill-active");
      charmodel.classList.add("opponent-skill-attack");
      oppAttackAnimation();
      document.getElementsByClassName("center-screen")[0].appendChild(anim);
      setTimeout(() => {
        charmodel.classList.remove("opponent-skill-attack");
        anim.parentNode.removeChild(anim);
      }, 500);
      displayHurtNumber(oppHit, "hurt-skill-number");
      dispatch(opponentAttack(oppHit));
    } else if (
      (opponent.hasSkill && skillRoll === 20) ||
      (opponent.hasSkill && opponentHP < opponent.hp / 2)
    ) {
      await sleep(1300);
      opponent.skillCharging = true;
      charmodel.classList.add("opponent-skill-active");
      dispatch(opponentDisabled(`. . .`));
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
          stack += 1;
        }
      });
      document.getElementsByClassName("block-area")[0].appendChild(blockTappy);
      setTimeout(() => {
        blockTappy.parentNode.removeChild(blockTappy);
      }, opponent.attackSpeed + reactionTime);

      //Preparing opponent attack
      await sleep(1300);
      atkRoll = diceRoll(20);

      //Check for character for "Prod" passive
      if (passiveEffect === "prod") {
        atkRoll -= 3;
      }

      //Block attack condition
      if (myGladiator.blocked === true) {
        anim.src = require(`./assets/images/animations/block.gif`);
        if (atkRoll + oppToHitBonus >= myAC) {
          oppHit = diceRoll(opponent.maxDmg) + opponent.dmgBonus;
        } else {
          oppHit = 0;
        }
        oppHit -= blockValue;
        if (oppHit < 0) {
          oppHit = 0;
        }
        displayHurtNumber(oppHit, "hurt-block-number");
        dispatch(blockedAttack(oppHit, blockValue));
        //parameter is used so player needs to block all attacks
        myGladiator.blocked = !multiHitCheck;

        // Crit condition
      } else if (atkRoll === 20) {
        anim.src = require(`./assets/images/animations/bloodsplat-crit.gif`);
        oppHit = Math.ceil(opponent.maxDmg * 1.5) + opponent.dmgBonus;
        displayHurtNumber(oppHit, "hurt-crit-number");
        dispatch(opponentAttack(oppHit));

        // Normal Hit condition
      } else if (atkRoll + oppToHitBonus >= myAC) {
        anim.src = require(`./assets/images/animations/bloodsplat${diceRoll(
          3
        )}.gif`);
        oppHit = diceRoll(opponent.maxDmg) + opponent.dmgBonus;
        displayHurtNumber(oppHit, "hurt-number");
        dispatch(opponentAttack(oppHit));
        //Miss condition
      } else {
        anim.src = require(`./assets/images/animations/opponentmiss.gif`);
        displayHurtNumber(null, "hurt-miss");
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
    decapitate = false;
    opponent.attackSpeed = opponent.baseAtkSpeed;
    stack = 0;
    dispatch(resetHealth()); // Resets health after battle is complete - reducer does both player and opponent health reset

    //unlock next opponent
    unlockNext();
    if (opponent.id >= 5) {
      opponent.hasSkill = true;
      opponent.skillCharging = false;
    }
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

  function keepPlaying() {
    battleState.playerTurn = true;
    opponent.disabled = false;
    decapitate = false;
    opponent.attackSpeed = opponent.baseAtkSpeed;
    stack = 0;
    dispatch(resetHealth());
    if (opponent.id >= 5) {
      opponent.hasSkill = true;
      opponent.skillCharging = false;
    }
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

  //Returns after forfeit
  function returnNoVictory() {
    battleState.playerTurn = true;
    opponent.disabled = false;
    decapitate = false;
    opponent.attackSpeed = opponent.baseAtkSpeed;
    stack = 0;
    dispatch(resetHealth());
    dispatch(forfeit());
    showForfeit();
    if (opponent.id >= 5) {
      opponent.hasSkill = true;
      opponent.skillCharging = false;
    }
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
  }

  /*---------------------START HTML RENDER-------------------------*/
  const renderTutorialScreen = () => {
    if (tutorial === true) {
      return (
        <div className="overlay-container">
          <div className="intro-screen">
            <h5 className="message-title">RULES OF BATTLE</h5>
            <h5 className="message-text">
              1. BASIC ATTCKS - Click or tap on your opponent to attack! Gladiators may be weak or resilient on certain areas of their body, such as legs, head, or torso.
            </h5>
            <h5 className="message-text">
              2. SKILLS - Use one of your gladiator's unique skills by selecting
              it from the menu in the bottom right corner, then press and
              hold on your opponent to activate the skill.
            </h5>
            <h5 className="message-text">
              3. OPPONENT TURN - After your turn, your opponent
              will strike back! Watch the bottom of your screen to anticipate
              where your opponent will strike, then tap on the flash to
              block the attack and mitigate some damage!
            </h5>
            <h5 className="message-text">
              4. MISSIO - You may forfeit from battle only once during the tournament. Click the 'Missio' button in the top-left corner.
            </h5>
            <h5 className="message-text">Good luck, brave Gladiator!</h5>
            <NavLink
              to="/arena"
              className="navlink-bg"
              activeClassName="navlink-bg"
            >
              <button
                className="button-bg btn-tutorial"
                onClick={(tutorial = false)}
              >
                CONTINUE
              </button>
            </NavLink>
          </div>
        </div>
      );
    }
  };

  const renderHintScreen = () => {
    if (hint === true && opponent.id === 5) {
      return (
        <div className="overlay-container">
          <div className="intro-screen">
            <h5 className="message-title">Hint!</h5>
            <h5 className="message-text">
              You have made it far in the tournament and your opponents are
              becoming increasingly deadly! They might take a menacing stance to
              unleash a devastating attack. Interrupt them with a disabling skill or face certain death...
            </h5>
            <NavLink
              to="/arena"
              className="navlink-bg"
              activeClassName="navlink-bg"
            >
              <button
                className="button-bg btn-tutorial"
                onClick={(hint = false)}
              >
                CONTINUE
              </button>
            </NavLink>
          </div>
        </div>
      );
    }
  };

  const renderClickNHold = () => {
    if (decapitate === true) {
      return (
      <div
          className={`opponent ${opponent.styleDecapitate}`}
          disabled={!battleState.playerTurn}
          onClick={myAttackRoll}
        ></div>
        );
    } else {
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
    }
  };

  async function delayVictoryMessage() {
    await sleep(500);
    let element = document.getElementsByClassName("victory-message")[0];
    setTimeout(() => {
      element.style.display = "flex";
    }, 1000);
  }

  const renderVictoryScreen = () => {
    if (opponentHP < 1 && opponent.name !== "Maximus") {
      delayVictoryMessage();
      return (
        <div className="victory-container" onContextMenu={preventContextMenu}>
          <div className="victory-message">
            <h1>VICTORY!</h1>
            <NavLink
              to="/staging"
              className="navlink-bg"
              activeClassName="navlink-bg"
            >
              <button className="button-bg" onClick={victory}>
                CONTINUE
              </button>
            </NavLink>
          </div>
          <Route path="/staging" component={Staging} />
        </div>
      );
    }
  };

  function bloodyDeath(e) {
    let anim = document.createElement("img");
    anim.className = `opponent-animation`;
    anim.src = require(`./assets/images/animations/bloodsplat${e}.gif`);
    document.getElementsByClassName("center-screen")[0].appendChild(anim);
  }

  async function hurlInsult() {
    await sleep(400);
    let element = document.getElementById("insults");
    let insultArray = []
    switch (opponent.id) {
      case 6:
        insultArray = insultsPep
        break;
      case 7:
        insultArray = insultsGladiatrix
        break;
      case 9:
        insultArray = insultsMaximus
        break;
      default:
        insultArray = insults
        break;
    }
    let insultIndex = diceRoll(insultArray.length) - 1;
    let insultText = insultArray[insultIndex];
    element.classList.add("chat-bubble");
    element.innerHTML = insultText;
    setTimeout(() => {
      element.classList.remove("chat-bubble");
      element.innerHTML = "";
    }, 2400);
  }

  const renderDefeatScreen = () => {
    if (currentHP < 1) {
      bloodyDeath(1);
      bloodyDeath(2);
      bloodyDeath(3);
      delayVictoryMessage();
      return (
        <div className="defeat-container">
          <div className="center-screen victory-message">
            <h1>A GLORIOUS DEATH!</h1>
            <h2>
              Alas, your champion has been slain and you will not achieve
              victory in this tournament. Fear not, for more opportunites to
              prove your Ludus' worth will arise in future tournaments!
            </h2>
            <br></br>
            <a className="button-bg" href="http://localhost:3000/">
              MAIN MENU
            </a>
            <br></br>
            {/* <NavLink to="/staging">
              <button onClick={victory}>$1.00</button>
            </NavLink> */}
          </div>
          <Route path="/staging" component={Staging} />
        </div>
      );
    }
  };

  const renderWinGame = () => {
    if (opponentHP < 1 && opponent.name === "Maximus") {
      delayVictoryMessage();
      return (
        <div className="defeat-container">
          <div className="center-screen victory-message">
            <h1>A NEW CHAMPION!</h1>
            <div className={`char-screen ${myGladiator.styleName}`}></div>
            <h2>Level {myGladiator.level}</h2>
            <h2>
              Your mighty {myGladiator.name} has proved their valor and beaten
              the undefeated Maximus!{" "}
            </h2>
            <h2>
              The Rudis has been bestowed and freedom has been granted. Your
              Ludus is known all across the Roman Empire!
            </h2>
            <br></br>
            <h1>Thanks for Playing!!!</h1>
            <NavLink
              to="/staging"
              className="navlink-bg"
              activeClassName="navlink-bg"
            >
              <button className="button-bg" onClick={keepPlaying}>
                CONTINUE
              </button>
            </NavLink>
            <a className="main-menu" href="http://localhost:3000/">MAIN MENU</a>
            <br></br>
          </div>
        </div>
      );
    }
  };

  function showForfeit() {
    forfeitMessage = !forfeitMessage;
  }

  function showRules() {
    tutorial = true;
  }

  const renderForfeitScreen = () => {
    if (forfeitMessage === true) {
      return (
        <div className="overlay-container">
          <div className="intro-screen">
            <h5 className="message-title">Missio</h5>
            <h5 className="message-text">
              If your gladiator is near defeat, you may forfeit the fight by
              holding up two fingers, the 'Missio' sign, acknowledging defeat
              and plea for mercy.
            </h5>
            <h5 className="message-text">Will you perform the Missio?</h5>
            <h5 className="warning-text2">
              <i>
                (WARNING: You may only perform the missio once during the
                tournament!)
              </i>
            </h5>
            <NavLink
              to="/staging"
              className="navlink-bg"
              activeClassName="navlink-bg"
            >
              <button
                className="button-bg btn-forfeit"
                onClick={returnNoVictory}
              >
                YES
              </button>
            </NavLink>
            <NavLink
              to="/arena"
              className="navlink-bg"
              activeClassName="navlink-bg"
            >
              <button className="button-bg btn-tutorial" onClick={showForfeit}>
                NO
              </button>
            </NavLink>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="arena-bg">
      {renderHintScreen()}
      {renderForfeitScreen()}
      {renderTutorialScreen()}
      {renderVictoryScreen()}
      {renderDefeatScreen()}
      {renderWinGame()}
      <NavLink to="/arena" className="navlink-bg" activeClassName="navlink-bg">
        <div
          data-border="true"
          data-effect="solid"
          data-html="true"
          data-tip={`<h3>Missio (forfeit)</h3>`}
          data-class="tooltip"
          disabled={battleState.forfeit}
          className="forfeit"
          id="forfeit"
          onClick={showForfeit}
        ></div>
      </NavLink>
      <NavLink to="/arena" className="navlink-bg" activeClassName="navlink-bg">
        <div
          data-border="true"
          data-effect="solid"
          data-html="true"
          data-tip={`<h3>Rules</h3>`}
          data-class="tooltip"
          disabled={battleState.forfeit}
          className="rules"
          onClick={showRules}
        ></div>
      </NavLink>
      <div className="top-center">
        <div className="center-hpnumbers">
          <h2 className="oppname-text">{opponent.name} </h2>
          <h2 className="hp-text">
            HP: {opponentHP} / {opponent.hp}{" "}
          </h2>
        </div>
      </div>

      <div className="center-screen" onContextMenu={preventContextMenu}>
        <div id="insults"></div>
        <div className="justify-center disable-message stroke">
          {battleState.disableMessage}
        </div>
        <div className="justify-center dmg-num-top stroke"></div>
        <div className="opponent-container" id="shakeContainer">
          {renderClickNHold()}
        </div>
        <div
          className="justify-center dmg-num-bottom stroke"
          id="bottom-message"
        >
          {battleState.oppHitMessage}
        </div>
        <div className="justify-center hurt-num stroke"></div>
        <div className="block-area"></div>
        <img
          alt="weapons"
          src={require(`./assets/images/weapons-${myGladiator.name}.png`)}
          className="weapons-container"
          id="weaponBuff"
        ></img>
      </div>

      <div className="bottom-center on-top" disabled={!battleState.playerTurn}>
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
        <div className="righta">
          <img
            alt="selected-skill"
            data-border="true"
            data-effect="solid"
            data-html="true"
            data-tip={`<h3>${mySkill.name}</h3> ${mySkill.description}`}
            data-class="tooltip"
            src={require(`./assets/images/skills/${mySkill.animation}.png`)}
            className={`skill-icon icon-battle ${mySkill.addClass}`}
          ></img>
          <ReactTooltip />
        </div>
      </div>

      <div className="bottom-center" disabled={!battleState.playerTurn}>
        <div className="center-hpnumbers">
          <h2 className="hp-text left-mobile">
            HP: {currentHP} / {myGladiator.hp}
          </h2>
        </div>
      </div>
    </div>
  );
}
