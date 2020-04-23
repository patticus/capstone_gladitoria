import { combineReducers } from 'redux';
import Counter from './counterReducer';
import GladiatorReducer from './gladiatorReducer'
import ChosenGladiator from './chosenGladiator'
import OpponentReducer from './opponentReducer'
import ChosenOpponent from './chosenOpponent'
import BattleState from './battleReducer'


const JoinedReducers = combineReducers({
  count: Counter,
  ChosenGladiator,
  GladiatorReducer,
  OpponentReducer,
  ChosenOpponent,
  BattleState
  
});

export default JoinedReducers;