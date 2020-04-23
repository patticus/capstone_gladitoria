export const increment = (damage) => {
  return {
    type: 'increase',
    payload: damage
  }
}

export const decrement = (damage) => {
  return {
    type: 'decrease',
    payload: damage
  }
}

export const attack = (damage) => {
  return {
    type: 'attack',
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