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
    hp: 100,
    headAC: 10,
    bodyAC: 10,
    legsAC: 10,
    headModifier: 3.0,
    bodyModifier: 1.0,
    legsModifier: 0.3,
    expVal: 50,
    maxDmg: 10,
    dmgBonus: 4,
    toHitBonus: 0,
    attackSpeed: 1000,
    baseAtkSpeed: 1000,
    weapons: 'Rusty Sword',
    unlocked: 1,
    addClass: "",
    difficulty: "Difficulty: Easy",
    disabled: 0,
    hasSkill: true,
    skillCharging: false

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