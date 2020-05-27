import React from "react";
import {
  Route,
} from "react-router-dom";
import Home from "./Home";
import CharSelect from "./CharSelect";
import Staging from "./Staging";
import Arena from "./Arena";
import "./index.css";

 

function Main(){

    return (
      <div className="content">
        <Route exact path="/" component={Home}/>
        <Route path="/charselect" component= {CharSelect} />
        <Route path="/staging" component={Staging}/>
        <Route path="/arena" component={Arena}/>
      </div>
    );
}
 
export default Main;