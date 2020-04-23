const initialState = {
  playerHealth: 0,
  opponentHealth: 0,
  myHitMessage: "",
  oppHitMessage: "",
  playerTurn: true
}

//total damage your gladiator has taken during the battle
let myDmgTaken = initialState.playerHealth
//total damage your opponent has taken during the battle
let oppDmgTaken = initialState.opponentHealth


const BattleState = (state = initialState, action) => {

  switch(action.type){
      //attacking your opponent
      case "attack":
        let myHit = action.payload
        oppDmgTaken -= myHit
        return {
            ...state,
            opponentHealth: oppDmgTaken,
            myHitMessage: `Strike for ${myHit} damage!`,
            playerTurn: false
        }
      //opponent attacks you
      case "opponentAttack":
        let oppHit = action.payload
        myDmgTaken -= oppHit
        return {
            ...state,
            playerHealth: myDmgTaken,
            oppHitMessage: `Taken ${oppHit} damage!`,
            playerTurn: true
        }
      //resets health values after battle is complete
      case "resetHealth":
        oppDmgTaken = 0
        myDmgTaken = 0
        return {
          ...state,
          playerHealth: 0,
          opponentHealth: 0,
          myHitMessage: "",
          oppHitMessage: "",
          playerTurn: true
        }
      default:
        return state
  }
}

export default BattleState;