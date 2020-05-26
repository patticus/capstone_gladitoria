import React from "react";
import ReactTooltip from "react-tooltip";
import { Route, NavLink } from "react-router-dom";
import Staging from "./Staging";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./actions";

let intro = true;
let grayedOut = "grayscale";

export default function CharSelect() {
  const gladArray = useSelector((state) => state.GladiatorReducer);
  const dispatch = useDispatch();
  const chosenGlad = useSelector((state) => state.ChosenGladiator);

  if (chosenGlad.selected === true) {
    grayedOut = "";
  }

  // const isEnabled = this.canContinue();

  const renderIntroScreen = () => {
    if (intro === true) {
      return (
        <div className="overlay-container">
          <div className="intro-screen">
            <h5 className="message-title">Greetings, Dominus!</h5>
            <h5 className="message-text">
              The Gladitoria Tournament is underway! The gladiator who proves
              their might against all competitors will be granted the Rudis, a
              symbol of their freedom. Additionally, their sponsoring Ludus will
              receive the patronage of our esteemed Senator Gracchus.
            </h5>
            <h5 className="message-text">
              Select your champion to represent your Ludus in the
              tournament. 
            </h5>
            <h5 className="message-text">
              Choose wisely. Blood and Glory await!
            </h5>
            <NavLink
              to="/charselect"
              className="navlink-bg"
              activeClassName="navlink-bg"
            >
              <button
                className="button-bg btn-tutorial"
                onClick={(intro = false)}
              >
                CONTINUE
              </button>
            </NavLink>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="staging-bg">
      <div className="center-screen">
        {renderIntroScreen()}
        <div className="char-select-title">
          <h2>CHARACTER SELECTION</h2>
        </div>
        <div className="char-description">
          <h2>{chosenGlad.chosen.name}</h2>
          <h2 className="description">{chosenGlad.chosen.description}</h2>
        </div>

        <div className="char-select-container">
          {gladArray.map((gladiator) => (
            <div
              tabIndex="-1"
              key={gladiator.id}
              className={`char-select${gladiator.id} ${gladiator.styleName}`}
              onFocus={() => dispatch(setUser(gladiator))}
            ></div>
          ))}
          <ReactTooltip />
        </div>
        <div className="char-select-button">
          <NavLink
            to="/staging"
            className="navlink-bg"
            activeClassName="navlink-bg"
          >
            <button
              className={`button-bg ${grayedOut}`}
              disabled={!chosenGlad.selected}
            >
              CONTINUE
            </button>
          </NavLink>
        </div>
        <Route path="/staging" component={Staging} />
      </div>
    </div>
  );
}
