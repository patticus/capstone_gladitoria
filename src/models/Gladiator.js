import { removeBuff } from "../actions";
import { Dimachaerus, Secutor } from "../data/gladiatorData";


import dimaWeapons from '../assets/images/weapons-Dimachaerus.png';
import secutorWeapons from '../assets/images/weapons-Secutor.png';
import retiWeapons from '../assets/images/weapons-Retiarius.png';

import dimaAttack from '../assets/images/attack-Dimachaerus.png';
import secutorAttack from '../assets/images/attack-Secutor.png';
import retiAttack from '../assets/images/attack-Retiarius.png';

import dimaAttackDW from '../assets/images/dwattack-Dimachaerus.png';

export default class Gladiator {
  dispatch;
  baseGladiator = null;
  name;

  activeBuffs;
  hp;
  ac;
  critChance;
  dmgBonus;
  maxDmg;
  toHitBonus;
  blockValue;

  passiveEffect;

  bleedTick;

  blocked;

  stack = 0;

  constructor(gladiator, activeBuffs, dispatch) {
    Object.assign(this, gladiator);

    this.weaponImage = gladiator.name === Dimachaerus ? dimaWeapons : Secutor ? secutorWeapons : retiWeapons;
    this.attackImage = gladiator.name === Dimachaerus ? dimaAttack : Secutor ? secutorAttack : retiAttack;
    this.dualWieldImage = gladiator.name === Dimachaerus ? dimaAttackDW : null

    this.dispatch = dispatch;
    this.baseGladiator = gladiator;
    this.hp = gladiator.hp;
    
    this.name = gladiator.name;
    this.passiveEffect = gladiator.level >= 4 ? gladiator.passiveEffect : null;

    // Each gladiator has a different bleed tick damage
    this.bleedTick =
      this.name === Dimachaerus
        ? 1
        : Secutor
        ? Math.ceil(gladiator.dmgBonus / 2)
        : Math.ceil(gladiator.dmgBonus / 2) + 3;

    // Initialize from activeBuffs
    this.applyBuffs(activeBuffs);
  }

  updateGladiator(gladiator) {
    this.blocked = gladiator.blocked;
    this.hp = gladiator.hp;
    this.maxDamage = gladiator.maxDmg;
  }

  setActiveBuffs(activeBuffs) {
    this.activeBuffs = activeBuffs;
  }

  resetStack() {
    this.stack = 0;
  }

  resetBase(gladiator) {
    this.resetStack();
    this.ac = gladiator.ac;
    this.critChance = gladiator.critChance;
    this.toHitBonus = gladiator.toHitBonus + (gladiator.dec - 15);
    this.dmgBonus = gladiator.dmgBonus + (gladiator.str - 15);
    this.blockValue = gladiator.blockValue;
  }

  applyBuffs(activeBuffs) {
    this.resetBase(this.baseGladiator);
    if ('rage' in activeBuffs) {
      this.dmgBonus += Math.min(5, this.stack);
    }

    if ('champion' in activeBuffs) {
      this.dmgBonus += 3;
      this.myAC += 3;
      this.critChance += 20;
      this.toHitBonus += 3;
      this.blockValue += 3;
    }
  }

  decrementBuffDuration() {
    for (let [buffName, buff] of Object.entries(this.activeBuffs)) {
      if (buff.duration === 1) {
        this.dispatch(removeBuff(buffName));
      }
    }
  }
}
