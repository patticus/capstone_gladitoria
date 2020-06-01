export function diceRoll(max) {
  return Math.ceil(Math.random() * Math.floor(max));
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function fadeOut() {
  let element = document.getElementById("bottom-message")
  element.classList.add("fade-out")
  setTimeout(() => {  element.classList.remove("fade-out") }, 1450)
}

export function applyPoisonStyle() {
  let element = document.getElementsByClassName('opponent')[0]
  element.classList.add("poisoned")
  setTimeout(() => {  element.classList.remove("poisoned") }, 900)
}

export function bleedTickAnimation() {
  let anim = document.createElement("img") 
  anim.className = `skill-animation`
  anim.src= require(`../assets/images/animations/bleed-tick.gif`)
  document.getElementsByClassName('center-screen')[0].appendChild(anim)
  setTimeout(() => {  anim.parentNode.removeChild(anim); }, 500)
}

export function oppGetHurt() {
  let element = document.getElementById("shakeContainer")
  element.classList.add("opp-hurt-anim")
  setTimeout(() => {  element.classList.remove("opp-hurt-anim") }, 500)
}

export function dodgeShake() {
  let element = document.getElementById("shakeContainer")
  element.classList.add("dodge-anim")
  setTimeout(() => {  element.classList.remove("dodge-anim") }, 500)
}

export function oppAttackAnimation() {
  let element = document.getElementById("shakeContainer")
  element.classList.add("opp-attack-anim")
  setTimeout(() => {  element.classList.remove("opp-attack-anim") }, 500)
}

export function closeDropup() {
  let element = document.getElementsByClassName('dropup-content')[0]
  element.style.display = "none"
}

export function openDropup() {
  let element = document.getElementsByClassName('dropup-content')[0]
  if (element.style.display === "block") {
    element.style.display = "none"
  } else {
    element.style.display = "block"
  }
}

export function displayDmgNumber (dmg, styleClass) {
  let dmgMessage = `${dmg}`
  if (dmg === 0) {
    dmgMessage = "Miss!"
  }
  let dmgNumber = document.createElement("div")
  dmgNumber.className = styleClass
  dmgNumber.innerText = `${dmgMessage}`
  document.getElementsByClassName('dmg-num-top')[0].appendChild(dmgNumber)
  setTimeout(() => {  dmgNumber.parentNode.removeChild(dmgNumber); }, 1400)
}

export function displayHurtNumber (dmg, styleClass) {
  let dmgMessage = `${dmg}`
  if (dmg === null) {
    dmgMessage = "Miss!"
  }
  let dmgNumber = document.createElement("div")
  dmgNumber.className = styleClass
  if (styleClass === "hurt-block-number"){
    dmgNumber.innerText = `${dmgMessage}(blocked!)`
  } else {
    dmgNumber.innerText = `${dmgMessage}`
  }
  document.getElementsByClassName('hurt-num')[0].appendChild(dmgNumber)
  setTimeout(() => {  dmgNumber.parentNode.removeChild(dmgNumber); }, 1400)
}


export function animatePlayerAttack (gladName) {
  let attackFrame = document.getElementsByClassName('weapons-container')[0]
  attackFrame.src = require(`../assets/images/attack-${gladName}.png`)
  attackFrame.style.zIndex = "2"
  setTimeout(() => {  attackFrame.src = require(`../assets/images/weapons-${gladName}.png`); attackFrame.style.zIndex = "0";}, 350)
}

export function animateDualWieldAttack (gladName) {
  let attackFrame = document.getElementsByClassName('weapons-container')[0]
  attackFrame.src = require(`../assets/images/dwattack-${gladName}.png`)
  attackFrame.style.zIndex = "2"
  setTimeout(() => {  attackFrame.src = require(`../assets/images/weapons-${gladName}.png`); attackFrame.style.zIndex = "0";}, 350)
}

export function animateBuff(skill) {
  let element = document.getElementById("weaponBuff")
  element.classList.add(`${skill}`)
  setTimeout(() => {  element.classList.remove(`${skill}`) }, 950)
  addActiveBuff(skill)
}

export function addActiveBuff(name) {
  let element = document.getElementById("weaponBuff")
  element.classList.add(`${name}-active`)
}

export function fadeToArena() {
  let innerStaging = document.getElementById("innerStaging")
  let stagingBG = document.getElementById("stagingBG")
  let navigate = document.getElementById("navArena")
  innerStaging.classList.add("fade-to-fight")
  setTimeout(() => {  stagingBG.classList.add("staging-bg-fade") }, 950)
  setTimeout(() => {  
    stagingBG.classList.remove("staging-bg-fade")
    innerStaging.classList.remove("fade-to-fight")
    navigate.click()
  }, 2900)

}

export function preventContextMenu(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

export const insults = [
  "Weak",
  "All stones and no pillar!",
  "<i>Fututus et mori</i>",
  "Pitiful",
  "<i>Cacare!</i>",
  "They'll feed you to the dogs!",
  "Why stir up the ashes in your tomb?",
  "You stink like guts!",
  "Old, like putrid gore...",
  "Blood!",
  "Lose your mind and your eyes",
  "The worms and maggots will know you soon",
  "Chains and death...",
  "We kill for glory",
  "The rats will gnaw your bones",
  "Carrion for the crows",
  "A man must accept his fate",
  "Fall to your knees already!",
  "I'll scrape you from the bottom of my heel",
  "Did they pull you from the pits?",
  "A gladiator does not fear death",
  "Pitiful",
  "<i>Futuo!</i>",
  "<i>Ede faecum!</i>",
  "<i>Filius canis! </i>",
  "<i>Irrumator!</i>",
  "<i>Vappa ac nebulo!</i>"
]

export const insultsGladiatrix = [
  "You pretend you are one of the big boys",
  "All stones and no pillar!",
  "Die beneath my heel!",
  "Do you fear my whip?"
]

export const insultsMaximus = [
  "I am required to kill, so I kill",
  "ARE YOU NOT ENTERTAINED?",
  "What we do in life echoes in eternity",
  "Shadows and dust...",
  "You have the power only to amuse a mob",
  "Strength and honor",
  "I will have my vengeance, in this life or the next",
  "<i>Roma Victor!</i>"
]

export const insultsPep = [
  "WAAAAAH!",
  "<i>growls</i>",
  "<i>hisses</i>"
]