import React, { Component } from 'react'

export default function Portrait(props){
    return (

      // this.props.gladiators.map((gladiator) => (
      //   <div tabIndex="-1" className={`char-select ${gladiator.styleName}`} onFocus={this.charSelected} onBlur={this.charDeselected}>{gladiator.name}</div>
      // ))
      <div>
        <div tabIndex="-1" className={`char-select ${props.gladiator.styleName}`} onFocus={props.gladiator.charSelected} onBlur={props.gladiator.charDeselected}>{props.gladiator.name}</div>
      </div>
    )
  }

