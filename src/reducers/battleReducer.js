const initialState = {
  playerHealth: 0,
  opponentHealth: 0,
  disableMessage: "",
  numberStyle: "",
  myPoisonMessage: "",
  myBleedMessage: "",
  oppHitMessage: "",
  playerTurn: true,
  activeBuffs: {},
  poisoned: false,
  bleeding: false,
  forfeit: false
}

//total damage your gladiator has taken during the battle
let myDmgTaken = initialState.playerHealth
//total damage your opponent has taken during the battle
let oppDmgTaken = initialState.opponentHealth


const BattleState = (state = initialState, action) => {

  switch(action.type){
      //forfeit
      case "forfeit":
        return {
          ...state,
          forfeit: true
        }

      //attacking your opponent
      case "attack":
        let myHit = action.payload
        oppDmgTaken -= myHit
        if (myHit === 0){
          return {
            ...state,
            disableMessage: "",
            numberStyle: `hit-number`,
          }
        } else {
          return {
            ...state,
            disableMessage: "",
            opponentHealth: oppDmgTaken,
            numberStyle: `hit-number`,
          }
        }
      
      // Crit attack
      case "critAttack":
        let critHit = action.payload
        oppDmgTaken -= critHit
        if (critHit === 0){
          return {
            ...state,
            disableMessage: "",
            numberStyle: `crit-number`,
          }
        } else {
          return {
            ...state,
            disableMessage: "",
            opponentHealth: oppDmgTaken,
            numberStyle: `crit-number`,
          }
        }
      
      case "poisonDmg":
        let poisonDmg = action.payload
        oppDmgTaken -= poisonDmg
        return {
          ...state,
          opponentHealth: oppDmgTaken,
          poisoned: true,
          numberStyle: `poison-number`,
          myPoisonMessage: `${poisonDmg}`
        }

      case "bleedDmg":
        let bleedDmg = action.payload
        oppDmgTaken -= bleedDmg
        return {
          ...state,
          opponentHealth: oppDmgTaken,
          bleeding: true,
          numberStyle: `bleed-number`,
          myBleedMessage: `${bleedDmg}`
        }

      //Using Skill on your opponent
      case "skill":
        let skillDmg = action.payload
        oppDmgTaken -= skillDmg
        
        return {
          ...state,
          disableMessage: "",
          opponentHealth: oppDmgTaken,
          numberStyle: `skill-number`,
        }

      case "heal":
        let healAmount = action.payload
        myDmgTaken += healAmount
        
        return {
          ...state,
          playerHealth: myDmgTaken,
        } 
      
      //applying buff
      case "skillBuff":
        let buff = action.payload
        let buffMsg = buff.name
        let activeBuffs = state.activeBuffs
        activeBuffs[buff.name] = buff

        return {
          ...state,
          disableMessage: "",
          oppHitMessage: `Activated ${buffMsg}`,
          activeBuffs: activeBuffs
        }

      //riposte
      case "riposte":
        let myRiposte = action.payload
        oppDmgTaken -= myRiposte
        return {
          ...state,
          opponentHealth: oppDmgTaken,
        }

        
      //opponent attacks you
      case "opponentAttack":
        let oppHit = action.payload
        myDmgTaken -= oppHit
        if (oppHit === null){
          return {
            ...state,
            oppHitMessage: "",
            playerTurn: true
          }
        } else {
          return {
            ...state,
            playerHealth: myDmgTaken,
            oppHitMessage: "",
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
          oppHitMessage: "",
          playerTurn: true
        }


      //Opponent Disabled Turn
      case "opponentDisabled":
        let disableMessage = action.payload
        return {
          ...state,
          playerTurn: true,
          disableMessage: `${disableMessage}`
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
          disableMessage: "",
          numberStyle: "",
          oppHitMessage: "",
          myPoisonMessage: "",
          myBleedMessage: "",
          playerTurn: true,
          activeBuffs: {},
          bleeding: false,
          poisoned: false
        }
      default:
        return state
  }
}

export default BattleState;