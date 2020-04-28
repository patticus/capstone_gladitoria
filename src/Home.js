import React, { Component } from "react";
import {
  Route,
  NavLink,
} from "react-router-dom";
import CharSelect from "./CharSelect";
import { useSelector, useDispatch } from 'react-redux';
 
export default function Home(){

  // console.log(store.getState())
  const dispatch = useDispatch();

    return (
      <div className="start-container">
        <div className="justify-center">
          <h1> LUDUS GLADITORIA</h1>
        </div>

        <div className="justify-center">
          <div className="start"><NavLink to="/charselect">START</NavLink></div>
          <Route path="/charselect" component={CharSelect} />
      </div>
      </div>
    );
  }
