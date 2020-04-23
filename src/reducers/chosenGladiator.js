const initialState = {
    chosen: {
        id: 1,
        styleName: 'dimachaerus',
        name: 'Dimachaerus',
        level: 1,
        hp: 44,
        ac: 13,
        exp: 0,
        str: 15,
        dex: 17,
        con: 14,
        maxDmg: 8,
        dmgBonus: 0,
        weapons: 'Dual Swords',
        selected: true
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