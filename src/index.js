import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter, MemoryRouter } from "react-router-dom";
import Main from "./Main";
import "./index.css";
import store from './store'

var destination = document.querySelector("#root");
   
ReactDOM.render(
  <Provider store={store}>
    <MemoryRouter>
      <Main />
    </MemoryRouter>
  </Provider>,
  destination
);