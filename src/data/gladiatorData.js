

export const Dimachaerus = "Dimachaerus";
export const Secutor = "Secutor";
export const Retiarius = "Retiarius";

/**
 * Gladiator Type
 * @enum {number}
 * 
 */
export const GladiatorType = {
  DIMACHAERUS: 0,
  SECUTOR: 1,
  RETIARIUS: 2
}


const gladiatorData = [
  {
    id: GladiatorType.DIMACHAERUS,
    styleName: 'dimachaerus',
    name: 'Dimachaerus',
    level: 1,
    hp: 34,
    ac: 12,
    exp: 0,
    nextLvlExp: 100,
    levelUp: false,
    str: 15,
    dex: 17,
    con: 15,
    weapons: 'Dual Swords',
    maxDmg: 8,
    dmgBonus: 0,
    toHitBonus: 0,
    critChance: 5,
    selected: true,
    blocked : false,
    blockValue: 2,
    passiveUnlocked: false,
    passiveEffect: "dual-wield"
  },

  {
    id: GladiatorType.SECUTOR,
    dualWieldImage: null,
    styleName: 'secutor',
    name: 'Secutor',
    level: 1,
    exp: 0,
    nextLvlExp: 100,
    levelUp: false,
    hp: 42,
    ac: 10,
    str: 16,
    dex: 15,
    con: 16,
    maxDmg: 8,
    dmgBonus: 0,
    toHitBonus: 0,
    critChance: 7,
    weapons: 'Axe and Shield',
    selected: false,
    blocked : false,
    blockValue: 3,
    passiveUnlocked: false,
    passiveEffect: "sever"
  },

  {
    id: GladiatorType.RETIARIUS,
    dualWieldImage: null,
    styleName: 'retiarius',
    name: 'Retiarius',
    level: 1,
    exp: 0,
    nextLvlExp: 100,
    levelUp: false,
    hp: 39,
    ac: 11,
    str: 16,
    dex: 16,
    con: 15,
    maxDmg: 8,
    dmgBonus: 0,
    toHitBonus: 0,
    critChance: 7,
    weapons: 'Trident and Net',
    selected: false,
    blocked : false,
    blockValue: 2,
    passiveUnlocked: false,
    passiveEffect: "prod"
  }
]

export default gladiatorData;