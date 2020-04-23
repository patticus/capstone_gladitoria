import gladiatorData from '../data/gladiatorData';

const initialState = {
  gladiators: gladiatorData,
  chosen: {}
}



const GladiatorReducer = (state = gladiatorData, action) => {
  switch (action.type) {
    default:
      return state;
  }
}

export default GladiatorReducer;