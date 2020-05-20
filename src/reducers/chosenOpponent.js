const inititalState = {
  chosenOpp: {
    // battleTitle: "SELECT A BATTLE!",
    // name: "",
    // difficulty: ""
    id: 0,
    styleName: 'opponent1',
    battleTitle: 'BATTLE 1',
    name: 'Slave',
    level: 1,
    hp: 30,
    ac: 8,
    expVal: 50,
    maxDmg: 6,
    dmgBonus: 1000,
    toHitBonus: 100,
    attackSpeed: 1000,
    baseAtkSpeed: 1000,
    weapons: 'Rusty Sword',
    unlocked: 1,
    addClass: "",
    difficulty: "Difficulty: Easy",
    disabled: 0

  },
  selected: false
}


const ChosenOpponent = (state = inititalState, action) => {
  switch(action.type){
      case "SET_OPP":
          return {
              ...state,
              chosenOpp: action.payload,
              selected: true
          }
      default:
          return state
  }
}

export default ChosenOpponent;