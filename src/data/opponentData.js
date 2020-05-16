  //ADD DIFFERENT AC VALUES FOR DIFFERENT BODY PARTS!

  /**
   * Opponent Type
   * @enum {number}
   * 
   */
export const OpponentType = {
  SLAVE: 0,
  FOREIGN_SOLDIER: 1,
  WEAK_GLADIATOR: 2,
  TRAINED_THRAEX: 3,
  SEASONED_FIGHTER: 4,
  DEADLY_MURMILLO: 5,
  UNCAGED_BEAST: 6,
  GLADIATRIX: 7,
  ROMAN_PRAETORIAN: 8,
  MAXIMUS: 9
}

  const opponentData = [
  {
    id: OpponentType.SLAVE,
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
    attackSpeed: 1000,
    baseAtkSpeed: 1000,
    weapons: 'Rusty Sword',
    unlocked: 1,
    addClass: "",
    difficulty: "Difficulty: Easy",
    disabled: 0
  },

  {
    id: OpponentType.FOREIGN_SOLDIER,
    styleName: 'opponent2',
    battleTitle: 'BATTLE 2',
    name: 'Foreign Solider',
    level: 2,
    hp: 45,
    ac: 9,
    expVal: 175,
    maxDmg: 8,
    dmgBonus: 1,
    toHitBonus: 1,
    attackSpeed: 950,
    baseAtkSpeed: 950,
    weapons: 'Gladius',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: Easy"
  },

  {
    id: OpponentType.WEAK_GLADIATOR,
    styleName: 'opponent3',
    battleTitle: 'BATTLE 3',
    name: 'Weak Gladiator',
    level: 3,
    hp: 60,
    ac: 10,
    expVal: 400,
    maxDmg: 8,
    dmgBonus: 2,
    toHitBonus: 2,
    attackSpeed: 900,
    baseAtkSpeed: 900,
    weapons: 'Gladius',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: Medium"
  },

  {
    id: OpponentType.TRAINED_THRAEX,
    styleName: 'opponent4',
    battleTitle: 'BATTLE 4',
    name: 'Trained Thraex',
    level: 4,
    hp: 78,
    ac: 11,
    expVal: 700,
    maxDmg: 10,
    dmgBonus: 3,
    toHitBonus: 3,
    attackSpeed: 850,
    baseAtkSpeed: 850,
    weapons: 'Gladius',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: Medium"
  },

  {
    id: OpponentType.SEASONED_FIGHTER,
    styleName: 'opponent5',
    battleTitle: 'BATTLE 5',
    name: 'Seasoned Fighter',
    level: 5,
    hp: 90,
    ac: 12,
    expVal: 1100,
    maxDmg: 10,
    dmgBonus: 3,
    toHitBonus: 3,
    attackSpeed: 800,
    baseAtkSpeed: 800,
    weapons: 'Gladius',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: Medium"
  },

  {
    id: OpponentType.DEADLY_MURMILLO,
    styleName: 'opponent6',
    battleTitle: 'BATTLE 6',
    name: 'Deadly Murmillo',
    level: 6,
    hp: 99,
    ac: 13,
    expVal: 1400,
    maxDmg: 10,
    dmgBonus: 4,
    toHitBonus: 4,
    attackSpeed: 750,
    baseAtkSpeed: 750,
    weapons: 'Gladius',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: Hard"
  },

  {
    id: OpponentType.UNCAGED_BEAST,
    styleName: 'opponent7',
    battleTitle: 'BATTLE 7',
    name: 'Uncaged Beast',
    level: 7,
    hp: 130,
    ac: 10,
    expVal: 1800,
    maxDmg: 10,
    dmgBonus: 5,
    toHitBonus: 5,
    attackSpeed: 700,
    baseAtkSpeed: 700,
    weapons: 'Claws',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: hard"
  },

  {
    id: OpponentType.GLADIATRIX,
    styleName: 'opponent8',
    battleTitle: 'BATTLE 8',
    name: 'Gladiatrix',
    level: 8,
    hp: 145,
    ac: 14,
    expVal: 2400,
    maxDmg: 12,
    dmgBonus: 6,
    toHitBonus: 6,
    attackSpeed: 650,
    baseAtkSpeed: 650,
    weapons: 'Gladius',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: Very hard"
  },

  {
    id: OpponentType.ROMAN_PRAETORIAN,
    styleName: 'opponent9',
    battleTitle: 'BATTLE 9',
    name: 'Roman Praetorian',
    level: 9,
    hp: 190,
    ac: 15,
    expVal: 2900,
    maxDmg: 12,
    dmgBonus: 7,
    toHitBonus: 7,
    attackSpeed: 600,
    baseAtkSpeed: 600,
    weapons: 'Gladius',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: Very hard"
  },

  {
    id: OpponentType.MAXIMUS,
    styleName: 'opponent10',
    battleTitle: 'FINAL',
    name: 'Maximus',
    level: 10,
    hp: 300,
    ac: 16,
    expVal: 5500,
    maxDmg: 15,
    dmgBonus: 6,
    toHitBonus: 10,
    attackSpeed: 500,
    baseAtkSpeed: 500,
    weapons: 'Gladius',
    unlocked: null,
    addClass: "grayscale",
    difficulty: "Difficulty: Insane"
  }
]

export default opponentData;