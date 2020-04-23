import React, { Component } from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import Main from "./Main";
import "./index.css";
import JoinedReducers from "./reducers";
import store from './store'

var destination = document.querySelector("#root");
 
// Store
// const store = createStore(JoinedReducers);
// console.log(store.getState())
   
ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Main />
    </HashRouter>
  </Provider>,
  destination
);