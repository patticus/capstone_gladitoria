const inititalState = {
  chosenOpp: {
    battleTitle: "SELECT A BATTLE!",
    name: "",
    difficulty: ""

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