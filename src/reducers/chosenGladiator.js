const initialState = {
    chosen: {
        id: 0,
        styleName: 'dimachaerus',
        name: 'Dimachaerus',
        level: 10,
        hp: 134,
        ac: 12,
        exp: 0,
        nextLvlExp: 100,
        levelUp: false,
        str: 20,
        dex: 20,
        con: 20,
        weapons: 'Dual Swords',
        maxDmg: 8,
        dmgBonus: 0,
        toHitBonus: 0,
        critChance: 5,
        selected: true,
        blocked : false,
        blockValue: 2,
        passiveUnlocked: false,
        passiveEffect: "dual-wield"
      },
    selected: false
}


const ChosenGladiator = (state = initialState, action) => {
  switch(action.type){
      case "SET_USER":
          return {
              ...state,
              chosen: action.payload,
              selected: true
          }
      default:
          return state
  }
}

export default ChosenGladiator;