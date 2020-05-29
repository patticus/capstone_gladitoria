export const setUser = (userObj) => {
  return {
      type: "SET_USER",
      payload: userObj
  }
}

export const logOut = () => {
  return {
      type: "USER_LOGOUT",
  }
}

export const forfeit = () => {
  return {
    type: "forfeit"
  }
}

export const setOpponent = (opponentObj) => {
  return {
      type: "SET_OPP",
      payload: opponentObj
  }
}

export const setSkill = (skillObj) => {
  return {
      type: "SET_SKILL",
      payload: skillObj
  }
}

export const attack = (damage) => {
  return {
    type: 'attack',
    payload: damage
  }
}

export const critAttack = (damage) => {
  return {
    type: 'critAttack',
    payload: damage
  }
}

export const opponentAttack = (damage) => {
  return {
    type: 'opponentAttack',
    payload: damage
  }
}

export const resetHealth = () => {
  return {
      type: "resetHealth"
  }
}

export const skill = (damage) => {
  return {
    type: 'skill',
    payload: damage
  }
}

export const heal = (amount) => {
  return {
    type: 'heal',
    payload: amount
  }
}

export const endTurn = () => {
  return {
    type: 'endTurn',
  }
}

export const opponentDisabled = (message) => {
  return {
    type: 'opponentDisabled',
    payload: message
  }
}

export const blockedAttack = (damage, blockValue) => {
  return {
    type: 'blockedAttack',
    payload: damage,
    payload2: blockValue
  }
}

export const skillBuff = (message) => {
  return {
    type: 'skillBuff',
    payload: message
  }
}

export const riposte = (damage) => {
  return {
    type: 'riposte',
    payload: damage
  }
}

export const poisonCounter = () => {
  return {
    type: 'poisonCounter',
  }
}

export const poisonDmg = (tick) => {
  return {
    type: 'poisonDmg',
    payload: tick
  }
}

export const bleedDmg = (tick) => {
  return {
    type: 'bleedDmg',
    payload: tick
  }
}



