import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { Route, NavLink } from "react-router-dom";
import Arena from "./Arena";
import { useSelector, useDispatch } from "react-redux";
import { setOpponent } from "./actions";
import { diceRoll, fadeToArena } from "./data/functions";

let tutorial = true;
let statCount = 2;
let increaseDisable = false;
let continueDisable = true;
let grayedOut = "grayscale";
let fightContinue = "grayscale";
let severBonus = true;

export default function Staging() {
  const dispatch = useDispatch();
  const opponentArray = useSelector((state) => state.OpponentReducer); //Array of all opponent objects
  const selected = useSelector((state) => state.ChosenOpponent.selected);
  const opponent = useSelector((state) => state.ChosenOpponent.chosenOpp); //Selected opponent object
  const myGladiator = useSelector((state) => state.ChosenGladiator.chosen); //Chosen gladiator object
  const allSkills = useSelector((state) => state.SkillsReducer);
  const skillArray = [];
  let skillUnlockMessage = "";
  let xpPercent = Math.ceil((myGladiator.exp / myGladiator.nextLvlExp) * 100);
  let toHitBonus = myGladiator.dex - 15;
  let dmgBonus = myGladiator.str - 15;
  const [isDesktop, setDesktop] = useState(window.innerWidth > 800);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 1000);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  if (continueDisable === false) {
    grayedOut = "";
  }

  if (selected === true) {
    fightContinue = "";
  }

  switch (myGladiator.level) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 9:
      if (increaseDisable === false) {
        statCount = 1;
      }
      skillUnlockMessage = "New skill unlocked!";
      break;
    default:
      break;
  }

  allSkills.map((skill) => {
    if (skill.gladiator === myGladiator.name) {
      skillArray.push(skill);
    }
    return skillArray;
  });

  // Secutor's "Sever" passive adds additional crit chance
  if (myGladiator.name === "Secutor" && myGladiator.level >= 4 && severBonus) {
    myGladiator.critChance += 15;
    severBonus = false;
  }

  //Conbonus adds additional HP when leveling up
  let conBonus = 0;
  if (myGladiator.con > 15) {
    conBonus += myGladiator.con - 15;
  }

  function levelUp() {
    myGladiator.level += 1;
    myGladiator.hp += diceRoll(5) + 5 + conBonus;
    myGladiator.exp = 0;
    myGladiator.nextLvlExp += myGladiator.level * 200;
    myGladiator.levelUp = true;
  }

  // function tempLvlUp() {
  //   myGladiator.level = 10;
  //   myGladiator.str = 40;
  //   myGladiator.levelUp = true;
  // }

  function continueLvl() {
    levelUp();
    myGladiator.levelUp = false;
    statCount = 2;
    increaseDisable = false;
    continueDisable = true;
    grayedOut = "grayscale";
  }

  function strLvlUp() {
    myGladiator.str += 1;
    myGladiator.critChance += 2;
    statCount -= 1;
    if (statCount === 0) {
      increaseDisable = true;
      continueDisable = false;
    }
  }

  function dexLvlUp() {
    myGladiator.dex += 1;
    myGladiator.ac += 1;
    statCount -= 1;
    if (statCount === 0) {
      increaseDisable = true;
      continueDisable = false;
    }
  }

  function conLvlUp() {
    myGladiator.con += 1;
    myGladiator.blockValue += 1;
    myGladiator.hp += myGladiator.level;
    statCount -= 1;
    if (statCount === 0) {
      increaseDisable = true;
      continueDisable = false;
    }
  }

  //----------------------------BEGIN RENDER HTML-----------------------------------
  const renderTutorialScreen = () => {
    if (tutorial === true) {
      return (
        <div className="overlay-container">
          <div className="intro-screen">
            <h5 className="message-title">Prepare for Battle!</h5>
            <h5 className="message-text">
              You have chosen the mighty {myGladiator.name} as your champion!
              You can view details about your gladiator's battle attributes and
              skills by hovering over them. Once you are ready to start, select
              a battle and press Fight!
            </h5>
            <h5 className="message-text">
              Completing battles will earn experience for your gladiator and
              unlock the next battle in the tournament. You may replay battles
              as many times as you want for fun and additional experience!
            </h5>
            <NavLink
              to="/staging"
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

  const renderLevelScreen = () => {
    if (myGladiator.levelUp === true) {
      return (
        <div className="overlay-container">
          <div className="level-up">
            <h2>Level Up!</h2>
            <h2>{skillUnlockMessage}</h2>
            <h2>Remaining points: {statCount} </h2>
            <h2>
              <div
                data-border="true"
                data-effect="solid"
                data-html="true"
                data-tip={`<h4>Strength</h4> Increases damage and critical chance. <h4>Damage Bonus: ${dmgBonus}</h4> <h4>Crit Chance: ${myGladiator.critChance}%</h4>`}
                data-class="tooltip"
              >
                STR: {myGladiator.str}{" "}
              </div>
              <NavLink
                to="/staging"
                className="navlink-bg"
                activeClassName="navlink-bg"
              >
                <button
                  className="lvlup-btn"
                  disabled={increaseDisable}
                  onClick={strLvlUp}
                >
                  +
                </button>
              </NavLink>
            </h2>
            <h2>
              <div
                data-border="true"
                data-effect="solid"
                data-html="true"
                data-tip={`<h4>Dexterity</h4> Increases chance to hit and armor class <h4>Hit Bonus: ${toHitBonus}</h4>`}
                data-class="tooltip"
              >
                DEX: {myGladiator.dex}{" "}
              </div>
              <NavLink
                to="/staging"
                className="navlink-bg"
                activeClassName="navlink-bg"
              >
                <button
                  className="lvlup-btn"
                  disabled={increaseDisable}
                  onClick={dexLvlUp}
                >
                  +
                </button>
              </NavLink>
            </h2>
            <h2>
              <div
                data-border="true"
                data-effect="solid"
                data-html="true"
                data-tip={`<h4>Constitution</h4> Increases hp on level up and block value. <h4>Block Value: ${myGladiator.blockValue}</h4>`}
                data-class="tooltip"
              >
                CON: {myGladiator.con}{" "}
              </div>
              <NavLink
                to="/staging"
                className="navlink-bg"
                activeClassName="navlink-bg"
              >
                <button
                  className="lvlup-btn"
                  disabled={increaseDisable}
                  onClick={conLvlUp}
                >
                  +
                </button>
              </NavLink>
            </h2>
            <NavLink
              to="/staging"
              className="navlink-bg"
              activeClassName="navlink-bg"
            >
              <button
                className={`button-bg btn-tutorial ${grayedOut}`}
                disabled={continueDisable}
                onClick={continueLvl}
              >
                Continue
              </button>
            </NavLink>
          </div>
          <ReactTooltip />
        </div>
      );
    }
  };

  return (
    <div className="staging-bg" id="stagingBG">
      {renderTutorialScreen()}
      {renderLevelScreen()}

      {isDesktop ? (
        <div className="flex-column" id="innerStaging">
          <div className="justify-center">
            <h2>STAGING</h2>
          </div>
          <div className="justify-center">
            <div className="staging-select bg-topleft">
              <div className="quadrant-container-desktop">
                <div
                  data-border="true"
                  data-effect="solid"
                  data-html="true"
                  data-tip={`<h3>${myGladiator.name}</h3> ${myGladiator.description}`}
                  data-class="tooltip"
                  className={`char-screen ${myGladiator.styleName}`}
                ></div>

                <div className="quadrant-container">
                  <h2>{myGladiator.name}</h2>
                  <table>
                    <tr
                      data-border="true"
                      data-effect="solid"
                      data-html="true"
                      data-tip={`<h4>Current Gladiator Level</h4> Increase your level to become more powerful!`}
                      data-class="tooltip"
                    >
                      <th>
                        <h2 className="stats-text">Level:</h2>
                      </th>
                      <th>
                        <h2 id="tagline" className="stats-text text-right">
                          {myGladiator.level}
                        </h2>
                      </th>
                    </tr>

                    <tr
                      data-border="true"
                      data-effect="solid"
                      data-html="true"
                      data-tip={`<h4>Experience Points</h4> ${myGladiator.exp} / ${myGladiator.nextLvlExp}`}
                      data-class="tooltip"
                    >
                      <th>
                        <h2 className="stats-text">EXP:</h2>
                      </th>
                      <th>
                        <h2 id="tagline" className="stats-text text-right">
                          {xpPercent}%
                        </h2>
                      </th>
                    </tr>

                    <tr
                      data-border="true"
                      data-effect="solid"
                      data-html="true"
                      data-tip={`<h4>Health Points</h4> How much damage you can take in battle before dying`}
                      data-class="tooltip"
                    >
                      <th>
                        <h2 className="stats-text">HP:</h2>
                      </th>
                      <th>
                        <h2 className="stats-text text-right">
                          {myGladiator.hp}
                        </h2>
                      </th>
                    </tr>

                    <tr
                      data-border="true"
                      data-effect="solid"
                      data-html="true"
                      data-tip={`<h4>Armor Class</h4> Higher armor class increases chance to avoid attacks`}
                      data-class="tooltip"
                    >
                      <th>
                        <h2 className="stats-text">AC:</h2>
                      </th>
                      <th>
                        <h2 className="stats-text text-right">
                          {myGladiator.ac}
                        </h2>
                      </th>
                    </tr>

                    <tr
                      data-border="true"
                      data-effect="solid"
                      data-html="true"
                      data-tip={`<h4>Strength</h4> Increases damage and critical chance. <h4>Damage Bonus: ${dmgBonus}</h4> <h4>Crit Chance: ${myGladiator.critChance}%</h4>`}
                      data-class="tooltip"
                    >
                      <th>
                        <h2 className="stats-text">STR:</h2>
                      </th>
                      <th>
                        <h2 className="stats-text text-right">
                          {myGladiator.str}
                        </h2>
                      </th>
                    </tr>

                    <tr
                      data-border="true"
                      data-effect="solid"
                      data-html="true"
                      data-tip={`<h4>Dexterity</h4> Increases chance to hit and armor class <h4>Hit Bonus: ${toHitBonus}</h4>`}
                      data-class="tooltip"
                    >
                      <th>
                        <h2 className="stats-text">DEX:</h2>
                      </th>
                      <th>
                        <h2 className="stats-text text-right">
                          {myGladiator.dex}
                        </h2>
                      </th>
                    </tr>

                    <tr
                      data-border="true"
                      data-effect="solid"
                      data-html="true"
                      data-tip={`<h4>Constitution</h4> Increases hp on level up and block value. <h4>Block Value: ${myGladiator.blockValue}</h4>`}
                      data-class="tooltip"
                    >
                      <th>
                        <h2 className="stats-text">CON:</h2>
                      </th>
                      <th>
                        <h2 className="stats-text text-right">
                          {myGladiator.con}
                        </h2>
                      </th>
                    </tr>
                  </table>
                  {/* <NavLink
                    to="/staging"
                    className="navlink-bg"
                    activeClassName="navlink-bg"
                  >
                    <button onClick={tempLvlUp}>LVL UP</button>
                  </NavLink> */}
                  <h2>SKILLS</h2>
                  <div className="center-skills">
                    {skillArray.map((skill) => (
                      <img
                        key={skill.id}
                        alt="skill"
                        data-border="true"
                        data-effect="solid"
                        data-html="true"
                        data-tip={`<h3>${skill.name}</h3> <h4>Unlocks: Level ${skill.lvlUnlock}</h4> ${skill.description}`}
                        data-class="tooltip-skills"
                        src={require(`./assets/images/skills/${skill.animation}.png`)}
                        className={`skill-icon`}
                      ></img>
                    ))}
                    <ReactTooltip />
                  </div>
                </div>
              </div>
            </div>
            <div className="staging-select bg-bottomright">
              <div className="quadrant-container-desktop">
                <div className="char-screen">
                  <div className="overflow">
                    {opponentArray.map((battle) => (
                      <div key={battle.id} className="justify-center">
                        <div
                          tabIndex={battle.unlocked}
                          key={battle.id}
                          className={`arena-select ${battle.addClass}`}
                          onFocus={() => dispatch(setOpponent(battle))}
                        >
                          <h2 className="battle-title">{battle.battleTitle}</h2>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="quadrant-container">
                  <h2>{opponent.battleTitle}</h2>
                  <h2>{opponent.name}</h2>
                  <h2>{opponent.difficulty}</h2>
                  <div className="justify-center">
                    {/* <NavLink
                      to="/arena"
                      className="navlink-bg"
                      activeClassName="navlink-bg"
                    > */}
                    <button
                      className={`button-bg ${fightContinue}`}
                      disabled={!selected}
                      onClick={fadeToArena}
                    >
                      FIGHT!
                    </button>
                    {/* </NavLink> */}
                  </div>
                  <Route path="/arena" component={Arena} />
                </div>
              </div>
            </div>
          </div>
          <NavLink
            to="/arena"
            className="navlink-bg"
            activeClassName="navlink-bg"
          >
            <div id="navArena"></div>
          </NavLink>
        </div>
      ) : (
        <div className="flex-column" id="innerStaging">
          <div class="topleft">
            <div className="quadrant-container bg-topleft">
              <div
                data-border="true"
                data-effect="solid"
                data-html="true"
                data-tip={`<h3>${myGladiator.name}</h3> ${myGladiator.description}`}
                data-class="tooltip"
                className={`char-screen ${myGladiator.styleName}`}
              ></div>
            </div>
          </div>
          <div class="bottomleft">
            <div className="quadrant-container bg-topright">
              <h2>{myGladiator.name}</h2>
              <table>
                <tr
                  data-border="true"
                  data-effect="solid"
                  data-html="true"
                  data-tip={`<h4>Current Gladiator Level</h4> Increase your level to become more powerful!`}
                  data-class="tooltip"
                >
                  <th>
                    <h2 className="stats-text">Level:</h2>
                  </th>
                  <th>
                    <h2 id="tagline" className="stats-text text-right">
                      {myGladiator.level}
                    </h2>
                  </th>
                </tr>

                <tr
                  data-border="true"
                  data-effect="solid"
                  data-html="true"
                  data-tip={`<h4>Experience Points</h4> ${myGladiator.exp} / ${myGladiator.nextLvlExp}`}
                  data-class="tooltip"
                >
                  <th>
                    <h2 className="stats-text">EXP:</h2>
                  </th>
                  <th>
                    <h2 id="tagline" className="stats-text text-right">
                      {xpPercent}%
                    </h2>
                  </th>
                </tr>

                <tr
                  data-border="true"
                  data-effect="solid"
                  data-html="true"
                  data-tip={`<h4>Health Points</h4> How much damage you can take in battle before dying`}
                  data-class="tooltip"
                >
                  <th>
                    <h2 className="stats-text">HP:</h2>
                  </th>
                  <th>
                    <h2 className="stats-text text-right">{myGladiator.hp}</h2>
                  </th>
                </tr>

                <tr
                  data-border="true"
                  data-effect="solid"
                  data-html="true"
                  data-tip={`<h4>Armor Class</h4> Higher armor class increases chance to avoid attacks`}
                  data-class="tooltip"
                >
                  <th>
                    <h2 className="stats-text">AC:</h2>
                  </th>
                  <th>
                    <h2 className="stats-text text-right">{myGladiator.ac}</h2>
                  </th>
                </tr>

                <tr
                  data-border="true"
                  data-effect="solid"
                  data-html="true"
                  data-tip={`<h4>Strength</h4> Increases damage and critical chance. <h4>Damage Bonus: ${dmgBonus}</h4> <h4>Crit Chance: ${myGladiator.critChance}%</h4>`}
                  data-class="tooltip"
                >
                  <th>
                    <h2 className="stats-text">STR:</h2>
                  </th>
                  <th>
                    <h2 className="stats-text text-right">{myGladiator.str}</h2>
                  </th>
                </tr>

                <tr
                  data-border="true"
                  data-effect="solid"
                  data-html="true"
                  data-tip={`<h4>Dexterity</h4> Increases chance to hit and armor class <h4>Hit Bonus: ${toHitBonus}</h4>`}
                  data-class="tooltip"
                >
                  <th>
                    <h2 className="stats-text">DEX:</h2>
                  </th>
                  <th>
                    <h2 className="stats-text text-right">{myGladiator.dex}</h2>
                  </th>
                </tr>

                <tr
                  data-border="true"
                  data-effect="solid"
                  data-html="true"
                  data-tip={`<h4>Constitution</h4> Increases hp on level up and block value. <h4>Block Value: ${myGladiator.blockValue}</h4>`}
                  data-class="tooltip"
                >
                  <th>
                    <h2 className="stats-text">CON:</h2>
                  </th>
                  <th>
                    <h2 className="stats-text text-right">{myGladiator.con}</h2>
                  </th>
                </tr>
              </table>
              {/* <NavLink
                to="/staging"
                className="navlink-bg"
                activeClassName="navlink-bg"
              >
                <button onClick={tempLvlUp}>LVL UP</button>
              </NavLink> */}
              <h2>SKILLS</h2>
              <div className="center-skills">
                {skillArray.map((skill) => (
                  <img
                    key={skill.id}
                    alt="skill"
                    data-border="true"
                    data-effect="solid"
                    data-html="true"
                    data-tip={`<h3>${skill.name}</h3> <h4>Unlocks: Level ${skill.lvlUnlock}</h4> ${skill.description}`}
                    data-class="tooltip-skills"
                    src={require(`./assets/images/skills/${skill.animation}.png`)}
                    className={`skill-icon`}
                  ></img>
                ))}
                <ReactTooltip />
              </div>
            </div>
          </div>

          <div class="topright">
            <div className="overflow bg-bottomleft">
              <div className="small-margin">
                {opponentArray.map((battle) => (
                  <div key={battle.id} className="justify-center">
                    <div
                      tabIndex={battle.unlocked}
                      key={battle.id}
                      className={`arena-select ${battle.addClass}`}
                      onFocus={() => dispatch(setOpponent(battle))}
                    >
                      <h2 className="battle-title">{battle.battleTitle}</h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div class="bottomright">
            <div className="quadrant-container bg-bottomright">
              <h2>{opponent.battleTitle}</h2>
              <h2>{opponent.name}</h2>
              <h2>{opponent.difficulty}</h2>
              <div className="justify-center">
                {/* <NavLink
                  to="/arena"
                  className="navlink-bg"
                  activeClassName="navlink-bg"
                > */}
                  <button
                    className={`button-bg ${fightContinue}`}
                    disabled={!selected}
                    onClick={fadeToArena}
                  >
                    FIGHT!
                  </button>
                {/* </NavLink> */}
              </div>
              <Route path="/arena" component={Arena} />
            </div>
          </div>
          <NavLink
            to="/arena"
            className="navlink-bg"
            activeClassName="navlink-bg"
          >
            <div id="navArena"></div>
          </NavLink>
        </div>
      )}
    </div>
  );
}
