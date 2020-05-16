export default class Opponent {
    toHitBonus;

    constructor(opponent){
        // Copy over all values that don't need computed
        Object.assign(this, opponent);
        this.toHitBonus = opponent.toHitBonus + (opponent.dec - 15);
    }
}