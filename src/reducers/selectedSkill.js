const inititalState = {
  mySkill: {
    name: "Select a Skill!",
    lvlUnlock: "1",
    description: "Choose a skill, then press and hold on your opponent to use it.",
    animation: "default"
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