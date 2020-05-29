  //ADD DIFFERENT AC VALUES FOR DIFFERENT BODY PARTS!

const opponentData = [
  {
    id: 0,
    styleName: 'opponent1',
    battleTitle: 'BATTLE 1',
    name: 'Deserter',
    level: 1,
    hp: 30,
    headAC: 12,
    bodyAC: 8,
    legsAC: 8,
    headModifier: 1.6,
    bodyModifier: 1.0,
    legsModifier: 1.0,
    expVal: 50,
    maxDmg: 8,
    dmgBonus: 2,
    toHitBonus: 2,
    attackSpeed: 1000,
    baseAtkSpeed: 1000,
    weapons: 'Rusty Sword',
    unlocked: 1,
    addClass: "",
    difficulty: "Difficulty: Easy",
    disabled: 0,
  },

  {
    id: 1,
    styleName: 'opponent2',
    battleTitle: 'BATTLE 2',
    name: 'Foreign Solider',
    level: 2,
    hp: 45,
    headAC: 13,
    bodyAC: 9,
    legsAC: 9,
    headModifier: 1.6,
    bodyModifier: 1.0,
    legsModifier: 1.0,
    expVal: 180,
    maxDmg: 9,
    dmgBonus: 3,
    toHitBonus: 2,
    attackSpeed: 950,
    baseAtkSpeed: 950,
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
    hp: 60,
    headAC: 14,
    bodyAC: 10,
    legsAC: 10,
    headModifier: 1.5,
    bodyModifier: 1.0,
    legsModifier: 1.0,
    expVal: 450,
    maxDmg: 10,
    dmgBonus: 3,
    toHitBonus: 3,
    attackSpeed: 900,
    baseAtkSpeed: 900,
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
    hp: 78,
    headAC: 7,
    bodyAC: 11,
    legsAC: 11,
    headModifier: 0.5,
    bodyModifier: 1.0,
    legsModifier: 1.0,
    expVal: 750,
    maxDmg: 11,
    dmgBonus: 3,
    toHitBonus: 4,
    attackSpeed: 850,
    baseAtkSpeed: 850,
    weapons: 'Gladius',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: Medium"
  },

  {
    id: 4,
    styleName: 'opponent5',
    battleTitle: 'BATTLE 5',
    name: 'Deadly Murmillo',
    level: 5,
    hp: 101,
    headAC: 6,
    bodyAC: 5,
    legsAC: 11,
    headModifier: 0.3,
    bodyModifier: 0.2,
    legsModifier: 1.3,
    expVal: 1200,
    maxDmg: 12,
    dmgBonus: 5,
    toHitBonus: 1,
    attackSpeed: 800,
    baseAtkSpeed: 800,
    weapons: 'Gladius',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: Medium"
  },

  {
    id: 5,
    styleName: 'opponent6',
    battleTitle: 'BATTLE 6',
    name: 'Seasoned Champion',
    level: 6,
    hp: 99,
    headAC: 9,
    bodyAC: 13,
    legsAC: 13,
    headModifier: 0.6,
    bodyModifier: 1.0,
    legsModifier: 1.0,
    expVal: 1500,
    maxDmg: 13,
    dmgBonus: 5,
    toHitBonus: 5,
    attackSpeed: 750,
    baseAtkSpeed: 750,
    weapons: 'Gladius',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: Hard",
    hasSkill: true,
    skillCharging: false
  },

  {
    id: 6,
    styleName: 'opponent7',
    battleTitle: 'BATTLE 7',
    name: 'Uncaged Beast',
    level: 7,
    hp: 130,
    headAC: 99,
    bodyAC: 99,
    legsAC: 13,
    headModifier: 0,
    bodyModifier: 0,
    legsModifier: 1.0,
    expVal: 1900,
    maxDmg: 10,
    dmgBonus: 5,
    toHitBonus: 7,
    attackSpeed: 700,
    baseAtkSpeed: 700,
    weapons: 'Claws',
    unlocked: 1,
    addClass: "grayscale",
    difficulty: "Difficulty: Hard",
    hasSkill: true,
    skillCharging: false
  },

  {
    id: 7,
    styleName: 'opponent8',
    battleTitle: 'BATTLE 8',
    name: 'Gladiatrix',
    level: 8,
    hp: 155,
    headAC: 9,
    bodyAC: 11,
    legsAC: 15,
    headModifier: 0.4,
    bodyModifier: 1.0,
    legsModifier: 1.3,
    expVal: 2500,
    maxDmg: 12,
    dmgBonus: 6,
    toHitBonus: 6,
    attackSpeed: 650,
    baseAtkSpeed: 650,
    weapons: 'Gladius',
    unlocked: 1,
    addClass: "grayscale",
    difficulty: "Difficulty: Very hard",
    hasSkill: true,
    skillCharging: false
  },

  {
    id: 8,
    styleName: 'opponent9',
    battleTitle: 'BATTLE 9',
    name: 'Roman Praetorian',
    level: 9,
    hp: 190,
    headAC: 15,
    bodyAC: 10,
    legsAC: 10,
    headModifier: 1.5,
    bodyModifier: 0.5,
    legsModifier: 0.5,
    expVal: 3000,
    maxDmg: 13,
    dmgBonus: 6,
    toHitBonus: 6,
    attackSpeed: 600,
    baseAtkSpeed: 600,
    weapons: 'Gladius',
    unlocked: 1,
    addClass: "grayscale",
    difficulty: "Difficulty: Very hard",
    hasSkill: true,
    skillCharging: false
  },

  {
    id: 9,
    styleName: 'opponent10',
    battleTitle: 'FINAL',
    name: 'Maximus',
    level: 10,
    hp: 300,
    headAC: 15,
    bodyAC: 15,
    legsAC: 15,
    headModifier: 1.0,
    bodyModifier: 1.0,
    legsModifier: 1.0,
    expVal: 10000,
    maxDmg: 15,
    dmgBonus: 6,
    toHitBonus: 7,
    attackSpeed: 500,
    baseAtkSpeed: 500,
    weapons: 'Gladius',
    unlocked: 1,
    addClass: "grayscale",
    difficulty: "Difficulty: Insane",
    hasSkill: true,
    skillCharging: false
  }
]

export default opponentData;