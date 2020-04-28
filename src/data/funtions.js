export function diceRoll(max) {
  return Math.ceil(Math.random() * Math.floor(max));
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}