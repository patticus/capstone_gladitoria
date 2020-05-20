import React from "react";
import {
  Route,
  NavLink,
} from "react-router-dom";
import Staging from "./Staging";
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './actions'
 
let intro = true

export default function CharSelect() {

  const gladArray = useSelector(state => state.GladiatorReducer);
  const dispatch = useDispatch()
  const chosenGlad = useSelector(state => state.ChosenGladiator)

    // const isEnabled = this.canContinue();

    const renderIntroScreen = () => {
      if (intro === true) {
        return (
          <div className="overlay-container">
            <div className="intro-screen">
              <h5 className="message-title">Greetings, Dominus!</h5>
              <h5 className="message-text">The Gladitoria Tournament is underway! The gladiator who proves their might against all competitors will be granted the Rudis, a symbol of their freedom. Additionally, their sponsoring Ludus will receive the patronage of our esteemed Senator Gracchus.</h5>
              <h5 className="message-text">Choose wisely your champion to represent your Ludus in the tournament. Blood and Glory await!</h5>
              <NavLink to="/charselect"><button onClick={intro=false}>CONTINUE</button></NavLink>
            </div>
          </div>
        );
      }  
    }

    return (
      <div className="staging-bg">
      <div className="flex-column">
      {renderIntroScreen()}
        <div className="justify-center">
          <h2>CHARACTER SELECTION</h2>
        </div>
          
        <div className="justify-center">
          {gladArray.map((gladiator) => (
            <div tabIndex="-1" key={gladiator.id} className={`char-select ${gladiator.styleName}`} onFocus={() => dispatch(setUser(gladiator))}>{gladiator.name}</div>
          ))}
        </div>

        <div className="justify-center">
          <NavLink to="/staging"><button disabled={ !chosenGlad.selected }>CONTINUE</button></NavLink>
        </div>

        <Route path="/staging" component={Staging}/>
      </div>
      </div> 
    );
  }

 