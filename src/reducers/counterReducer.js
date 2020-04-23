// Reducer
const initialState = {
  counter: 0
}

 const CounterReducer = (state = initialState, action) => {
  let counter = initialState.counter
  switch (action.type) {
    
    case "increase":
      counter += 1;
      initialState.counter += 1
      return {...state, counter: counter + 1};
    case "decrease":
      return state - 1;
    default:
      return state;
  }
 }
 
export default CounterReducer;