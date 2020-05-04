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
        if (myHit === 0){
          return {
            ...state,
            myHitMessage: `Miss!`,
            playerTurn: false
          }
        } else {
          return {
            ...state,
            opponentHealth: oppDmgTaken,
            myHitMessage: `Hit for ${myHit} damage!`,
            playerTurn: false
          }
        }
        
      //opponent attacks you
      case "opponentAttack":
        let oppHit = action.payload
        myDmgTaken -= oppHit
        if (oppHit === null){
          return {
            ...state,
            oppHitMessage: "Miss!",
            playerTurn: true
          }
        } else {
          return {
            ...state,
            playerHealth: myDmgTaken,
            oppHitMessage: `Taken ${oppHit} damage!`,
            playerTurn: true
          }
        }
      
      //Player blocks the attack
      case "blockedAttack":
        let partialHit = action.payload
        let blockAmount = action.payload2
        myDmgTaken -= partialHit
        return {
          ...state,
          playerHealth: myDmgTaken,
          oppHitMessage: `Taken ${partialHit} (${blockAmount} blocked!)`,
          playerTurn: true
        }

      //Using Skill on your opponent
      case "skill":
        let skillDmg = action.payload
        oppDmgTaken -= skillDmg
        
        return {
          ...state,
          opponentHealth: oppDmgTaken,
          myHitMessage: `Strike for ${skillDmg} damage!`,
        }

      //Opponent Disabled Turn
      case "opponentDisabled":
        let disableMessage = action.payload
        return {
          ...state,
          playerTurn: true,
          myHitMessage: `${disableMessage}`
        }

      // Ends player's turn
      case "endTurn":
        return {
          ...state,
          playerTurn: false
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