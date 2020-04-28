const inititalState = {
  mySkill: {
    name: "Select a Skill!",
  },
  selected: false
}


const SelectedSkill = (state = inititalState, action) => {
  switch(action.type){
      case "SET_SKILL":
          return {
              ...state,
              mySkill: action.payload,
              selected: true
          }
      default:
          return state
  }
}

export default SelectedSkill;