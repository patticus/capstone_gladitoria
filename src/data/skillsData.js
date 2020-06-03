const skillsData = [

  /* DIMACHAERUS SKILLS */
  {
    id: 0,
    name: "Power Strike",
    gladiator: "Dimachaerus",
    uses: 1,
    used: false,
    passive: false,
    buff: false,
    disable: false,
    maxUses: 1,
    dmgBonus: 9,
    multiplier: 0.5,
    attacks: 1,
    maxAttacks: 1,
    lvlUnlock: 1,
    animation: "power-slash",
    disableTurns: 0,
    addClass: "",
    skillGray: "grayscale",
    animContainer: "skill-animation",
    description: "Strike your opponent with all your strength, dealing extra damage."
  },
  {
    id: 1,
    name: "Pinpoint",
    gladiator: "Dimachaerus",
    uses: 1,
    used: false,
    bleed: true,
    passive: false,
    buff: false,
    disable: true,
    maxUses: 1,
    dmgBonus: 0,
    multiplier: 0.5,
    attacks: 1,
    maxAttacks: 1,
    lvlUnlock: 2,
    animation: "pinpoint",
    disableTurns: 1,
    disableMessage: "Paralyzed!",
    addClass: "",
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "A series of quick stabs to the most vulnerable parts of your opponent's body. Slows your opponent's attack speed, briefly stuns them, and severs their arteries."
  },
  {
    id: 2,
    name: "Dual Wield",
    gladiator: "Dimachaerus",
    passive: true,
    buff: false,
    disable: false,
    passiveEffect: "dual-wield",
    animation: "dual-wield",
    lvlUnlock: 4,
    disableTurns: 0,
    addClass: "",
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "Passive Skill. You have become skilled in the art of dual weapon combat. Your basic attacks will strike with both weapons, though you may have a harder time landing solid blows with your offhand."
  },
  {
    id: 3,
    name: "Riposte",
    gladiator: "Dimachaerus",
    used: false,
    passive: false,
    buff: true,
    disable: false,
    buffEffect: {
      name: "riposte",
      duration: 3,
      maxDuration: 3
    },
    uses: 1,
    maxUses: 1,
    lvlUnlock: 6,
    animation: "riposte-buff",
    disableTurns: 0,
    addClass: "",
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "Take a defensive stance, allowing you to immediately retaliate when you block an attack. You can maintain this stance for several turns."
  },
  {
    id: 4,
    name: "Flurry Rush",
    gladiator: "Dimachaerus",
    uses: 1,
    used: false,
    passive: false,
    buff: false,
    disable: false,
    maxUses: 1,
    dmgBonus: 4,
    multiplier: 0.5,
    attacks: 2,
    maxAttacks: 2,
    lvlUnlock: 8,
    animation: "dual-slash",
    disableTurns: 0,
    addClass: "",
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "Unleash a flurry of attacks with both swords. The rush from your assault steels your nerves, allowing you to gain some hit points."
  },
  {
    id: 5,
    name: "Champion",
    gladiator: "Dimachaerus",
    used: false,
    passive: false,
    buff: true,
    disable: false,
    buffEffect: {
      name: "champion",
      duration: 6,
      maxDuration: 6
    },
    uses: 1,
    maxUses: 1,
    lvlUnlock: 10,
    animation: "champion-buff",
    disableTurns: 0,
    addClass: "",
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "Your glorious victories have made you a champion of the arena. Call upon the crowd to gain their favor, increasing your prowess in battle."
  },

    /* SECUTOR SKILLS */

  {
    id: 6,
    name: "Power Strike",
    gladiator: "Secutor",
    uses: 1,
    used: false,
    passive: false,
    buff: false,
    disable: false,
    maxUses: 1,
    dmgBonus: 9,
    multiplier: 0.5,
    attacks: 1,
    maxAttacks: 1,
    lvlUnlock: 1,
    animation: "power-slash",
    disableTurns: 0,
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "Strike your opponent with all your strength, dealing extra damage."
  },
  {
    id: 7,
    name: "Shield Bash",
    gladiator: "Secutor",
    uses: 1,
    used: false,
    passive: false,
    buff: false,
    disable: true,
    maxUses: 1,
    dmgBonus: 0,
    multiplier: 0.3,
    attacks: 1,
    maxAttacks: 1,
    lvlUnlock: 2,
    animation: "shield-bash",
    disableTurns: 2,
    disableMessage: "Stunned!!!",
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "Slam your shield into your opponent, dealing increased damage based on your block value and stunning temporarily."
  },
  {
    id: 8,
    name: "Sever",
    gladiator: "Secutor",
    passive: true,
    buff: false,
    disable: false,
    passiveEffect: "sever",
    animation: "sever",
    lvlUnlock: 4,
    disableTurns: 0,
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "Passive Skill. Your strong arm and keen eye allow you to strike with strength and precision. Critical chance is increased and Critical hits may dismember your opponent, causing them to bleed."
  },
  {
    id: 9,
    name: "Rage",
    gladiator: "Secutor",
    uses: 1,
    used: false,
    passive: false,
    buff: true,
    disable: false,
    buffEffect: {
      name: "rage",
      duration: 8,
      maxDuration: 8
    },
    maxUses: 1,
    lvlUnlock: 6,
    animation: "rage-buff",
    disableTurns: 0,
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "Unleash your rage! For several turns, every time you block you feel a rush of adrenaline, increasing the strength of your attacks and your reaction time to block."
  },
  {
    id: 10,
    name: "Execute",
    gladiator: "Secutor",
    uses: 1,
    used: false,
    passive: false,
    buff: false,
    disable: false,
    maxUses: 1,
    dmgBonus: 5,
    multiplier: 0.5,
    executeBonus: function (maxHp, currHp, disabled) {
      let exeBonus = Math.ceil((maxHp/currHp)*5)
      if (disabled > 0) {exeBonus += 10}
      return exeBonus
    },
    attacks: 1,
    maxAttacks: 1,
    lvlUnlock: 8,
    animation: "execute",
    disableTurns: 0,
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "Give the crowd what they want. This decisive strike deals increased damage to wounded and stunned opponents, and has a chance to decapitate."
  },
  {
    id: 11,
    name: "Champion",
    gladiator: "Secutor",
    used: false,
    passive: false,
    buff: true,
    disable: false,
    buffEffect: {
      name: "champion",
      duration: 7,
      maxDuration: 7
    },
    uses: 1,
    maxUses: 1,
    lvlUnlock: 10,
    animation: "champion-buff",
    disableTurns: 0,
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "Your glorious victories have made you a champion of the arena. Call upon the crowd to gain their favor, increasing your prowess in battle."
  },

      /* RETIARIUS SKILLS */

  {
    id: 12,
    name: "Power Strike",
    gladiator: "Retiarius",
    uses: 1,
    used: false,
    passive: false,
    buff: false,
    disable: false,
    maxUses: 1,
    dmgBonus: 9,
    multiplier: 0.5,
    attacks: 1,
    maxAttacks: 1,
    lvlUnlock: 1,
    animation: "power-slash",
    disableTurns: 0,
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "Strike your opponent with all your strength, dealing extra damage."
  },
  {
    id: 13,
    name: "Throw Net",
    gladiator: "Retiarius",
    uses: 10,
    used: false,
    passive: false,
    buff: false,
    disable: true,
    maxUses: 1,
    dmgBonus: 0,
    multiplier: 0.01,
    attacks: 1,
    maxAttacks: 1,
    lvlUnlock: 2,
    animation: "throw-net",
    disableTurns: 3,
    disableMessage: "Trapped!!!",
    animContainer: "net-animation",
    skillGray: "grayscale",
    description: "Throw your net at your opponent, entangling and trapping them for several rounds."
  },
  {
    id: 14,
    name: "Prod",
    gladiator: "Retiarius",
    used: false,
    passive: true,
    buff: false,
    disable: false,
    passiveEffect: "prod",
    animation: "prod",
    lvlUnlock: 4,
    disableTurns: 0,
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "Passive Skill. Your skill with the trident allows you to stay at a distance, reducing the chance your enemy will hit you or land a critical strike."
  },
  {
    id: 15,
    name: "Poison Trident",
    gladiator: "Retiarius",
    used: false,
    passive: false,
    buff: true,
    disable: false,
    buffEffect: {
      name: "poisonTrident",
      duration: 7,
      maxDuration: 7
    },
    uses: 1,
    maxUses: 1,
    lvlUnlock: 6,
    animation: "poison-trident-buff",
    disableTurns: 0,
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "Rub a deadly poison on the tips of your trident, making your normal attacks infect your opponent. Don't worry, anything goes in the arena."
  },
  {
    id: 16,
    name: "Trident Rake",
    gladiator: "Retiarius",
    uses: 1,
    used: false,
    bleed: true,
    passive: false,
    buff: false,
    disable: false,
    maxUses: 1,
    dmgBonus: 9,
    multiplier: 0.5,
    attacks: 1,
    maxAttacks: 1,
    lvlUnlock: 8,
    animation: "trident-rake",
    disableTurns: 0,
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "Slash with the three prongs of your trident to cause a deep, gushing wound for heavy bleeding damage."
  },
  {
    id: 17,
    name: "Champion",
    gladiator: "Retiarius",
    used: false,
    passive: false,
    buff: true,
    disable: false,
    buffEffect: {
      name: "champion",
      duration: 6,
      maxDuration: 6
    },
    uses: 1,
    maxUses: 1,
    lvlUnlock: 10,
    animation: "champion-buff",
    disableTurns: 0,
    animContainer: "skill-animation",
    skillGray: "grayscale",
    description: "Your glorious victories have made you a champion of the arena. Call upon the crowd to gain their favor, increasing your prowess in battle."
  }
]




export default skillsData;