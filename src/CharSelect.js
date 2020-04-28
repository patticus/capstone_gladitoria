import React, { Component } from "react";
import {
  Route,
  NavLink,
} from "react-router-dom";
import Staging from "./Staging";
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './actions'

import store from './store'
 
export default function CharSelect() {

  console.log(store.getState())
  const gladArray = useSelector(state => state.GladiatorReducer);
  const dispatch = useDispatch()
  const chosenGlad = useSelector(state => state.ChosenGladiator)

    // const isEnabled = this.canContinue();

    return (
      
      <div className="flex-column"> 
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
    );
  }

 