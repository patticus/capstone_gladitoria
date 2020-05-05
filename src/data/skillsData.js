const skillsData = [

  /* DIMACHAERUS SKILLS */
  {
    id: 0,
    name: "Power Strike",
    gladiator: "Dimachaerus",
    uses: 1,
    buff: false,
    maxUses: 1,
    dmgBonus: 9,
    attacks: 1,
    maxAttacks: 1,
    lvlUnlock: 1,
    hitChance: 100,
    animation: "power-slash",
    disableTurns: 0
  },
  {
    id: 1,
    name: "Dual Slash",
    gladiator: "Dimachaerus",
    uses: 1,
    buff: false,
    maxUses: 1,
    dmgBonus: 4,
    attacks: 2,
    maxAttacks: 2,
    lvlUnlock: 2,
    hitChance: 100,
    animation: "dual-slash",
    disableTurns: 0
  },
  {
    id: 2,
    name: "Riposte",
    gladiator: "Dimachaerus",
    buff: true,
    buffEffect: {
      name: "riposte",
      duration: 3,
      maxDuration: 3
    },
    uses: 1,
    maxUses: 1,
    lvlUnlock: 3,
    animation: "riposte-buff",
    disableTurns: 0
  },

    /* SECUTOR SKILLS */

  {
    id: 4,
    name: "Power Strike",
    gladiator: "Secutor",
    uses: 1,
    buff: false,
    maxUses: 1,
    dmgBonus: 9,
    attacks: 1,
    maxAttacks: 1,
    lvlUnlock: 1,
    hitChance: 100,
    animation: "power-slash",
    disableTurns: 0
  },
  {
    id: 5,
    name: "Shield Bash",
    gladiator: "Secutor",
    uses: 1,
    buff: false,
    maxUses: 1,
    dmgBonus: 0,
    attacks: 1,
    maxAttacks: 1,
    lvlUnlock: 2,
    hitChance: 100,
    animation: "shield-bash",
    disableTurns: 2,
    disableMessage: "Stunned!!!"
  },
  {
    id: 3,
    name: "Rage",
    gladiator: "Secutor",
    buff: true,
    buffEffect: {
      name: "rage",
      duration: 5,
      maxDuration: 5
    },
    uses: 1,
    maxUses: 1,
    lvlUnlock: 1,
    animation: "rage-buff",
    disableTurns: 0
  },

      /* RETIARIUS SKILLS */

  {
    id: 6,
    name: "Power Strike",
    gladiator: "Retiarius",
    uses: 1,
    buff: false,
    maxUses: 1,
    dmgBonus: 9,
    attacks: 1,
    maxAttacks: 1,
    lvlUnlock: 1,
    hitChance: 100,
    animation: "power-slash",
    disableTurns: 0
  },
  {
    id: 7,
    name: "Throw Net",
    gladiator: "Retiarius",
    uses: 1,
    buff: false,
    maxUses: 1,
    dmgBonus: -2,
    attacks: 1,
    maxAttacks: 1,
    lvlUnlock: 2,
    hitChance: 100,
    animation: "throw-net",
    disableTurns: 4,
    disableMessage: "Trapped!!!"
  },
]




export default skillsData;