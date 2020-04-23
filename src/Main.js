import React, { Component } from "react";
import {
  Route,
} from "react-router-dom";
import Home from "./Home";
import CharSelect from "./CharSelect";
import Staging from "./Staging";
import Arena from "./Arena";
import "./index.css";
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './actions/counterActions'
import store from './store'
 

function Main(){

  const counter = useSelector(state => state.count);
  const dispatch = useDispatch();
  function getState(){
    console.log(store.getState())
  }
    return (
      <div className="content">
        {/* <div>
          <h2>Counter: {counter}</h2>
          <button onClick={() => dispatch(increment())}>+</button>
          <button onClick={() => dispatch(decrement())}>-</button>
        </div> */}
        <Route exact path="/" component={Home}/>
        <Route path="/charselect" component= {CharSelect} />
        <Route path="/staging" component={Staging}/>
        <Route path="/arena" component={Arena}/>
      </div>
    );
}
 
export default Main;