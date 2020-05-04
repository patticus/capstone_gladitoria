  //ADD DIFFERENT AC VALUES FOR DIFFERENT BODY PARTS!

const opponentData = [
  {
    id: 0,
    styleName: 'opponent1',
    battleTitle: 'BATTLE 1',
    name: 'Slave',
    level: 1,
    hp: 30,
    ac: 8,
    expVal: 50,
    maxDmg: 6,
    dmgBonus: 0,
    toHitBonus: 0,
    weapons: 'Rusty Sword',
    unlocked: 1,
    addClass: "",
    difficulty: "Difficulty: Easy",
    disabled: 0
  },

  {
    id: 1,
    styleName: 'opponent2',
    battleTitle: 'BATTLE 2',
    name: 'Foreign Solider',
    level: 2,
    hp: 45,
    ac: 10,
    expVal: 100,
    maxDmg: 8,
    dmgBonus: 0,
    toHitBonus: 0,
    weapons: 'Gladius',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: Easy"
  },

  {
    id: 2,
    styleName: 'opponent3',
    battleTitle: 'BATTLE 3',
    name: 'Weak Gladiator',
    level: 3,
    hp: 53,
    ac: 11,
    expVal: 150,
    maxDmg: 8,
    dmgBonus: 1,
    toHitBonus: 0,
    weapons: 'Gladius',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: Medium"
  },

  {
    id: 3,
    styleName: 'opponent4',
    battleTitle: 'BATTLE 4',
    name: 'Trained Thraex',
    level: 4,
    hp: 66,
    ac: 12,
    expVal: 300,
    maxDmg: 10,
    dmgBonus: 3,
    toHitBonus: 0,
    weapons: 'Gladius',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: Medium"
  },

  {
    id: 4,
    styleName: 'opponent5',
    battleTitle: 'BATTLE 5',
    name: 'Trained Retiarius',
    level: 5,
    hp: 70,
    ac: 13,
    expVal: 500,
    maxDmg: 10,
    dmgBonus: 3,
    toHitBonus: 0,
    weapons: 'Gladius',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: Medium"
  }
]

export default opponentData;