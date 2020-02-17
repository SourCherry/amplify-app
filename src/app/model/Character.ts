import { ICharacter, ISpecialisation, IWeapon, IDicePool, ISkill, ICharacteristic, IDefense, IAttributes } from './ICharacter';
import { ProfiencyDice, AbilityDice, BoostDice, ChallengeDice, AutoSuccessDice, DiceRoller, Dice, RollResult, NetRollResult, DifficultyDice, SetbackDice, ForceDice } from './DiceRoller';

export class Character {
    characterName: string;
    playerName: string;
    species: string;
    career: string;
    specialisations: Specialisation[];
    characteristics: Characteristic[];
    attributes: Attributes;
    generalSkills: Skill[];
    combatSkills: Skill[];
    knowledgeSkills: Skill[];
    weapons: Weapon[];

    public static create(that: ICharacter): Character {
        const character: Character = new Character();
        character.characterName = that.characterName;
        character.playerName = that.playerName;
        character.species = that.species;
        character.career = that.career;
        character.specialisations = new Array();
        that.specialisations
            .map(i => Specialisation.create(i))
            .forEach(i => character.specialisations.push(i));
        character.characteristics = new Array();
        that.characteristics
            .map(i => Characteristic.create(i))
            .forEach(i => character.characteristics.push(i));
        character.attributes = Attributes.create(that.attributes);
        character.generalSkills = new Array();
        that.generalSkills
            .map(i => Skill.create(i))
            .forEach(i => character.generalSkills.push(i));
        character.knowledgeSkills = new Array();
        that.knowledgeSkills
            .map(i => Skill.create(i))
            .forEach(i => character.knowledgeSkills.push(i));
        character.weapons = new Array();
        that.weapons
            .map(i => Weapon.create(i))
            .forEach(i => character.weapons.push(i));
        return character;
    }

}

export class Attributes {
    static create(that: IAttributes): Attributes {
        const attributes: Attributes = new Attributes();
        attributes.defense = that.defense;
        attributes.soak = that.soak;
        attributes.strain = that.strain;
        attributes.wound = that.wound;
        return attributes;
    }
    wound: number;
    strain: number;
    soak: number;
    defense: Defense;
}

export class Defense {
    ranged: number;
    melee: number;

    constructor(ranged : number, melee : number) {
        this.ranged = ranged;
        this.melee = melee;
    }
}

export class Characteristic {
    static create(that: ICharacteristic): any {
        const characteristic: Characteristic = new Characteristic();
        characteristic.name = that.name;
        characteristic.value = that.value;
        return characteristic;
    }
    name: string;
    value: number;
}

export class Skill {

    name: string;
    attribute: string;
    dicePool: DicePool;
    career: boolean;
    rank: number;
    result? : NetRollResult;

    static create(that: ISkill): any {
        const skill: Skill = new Skill();
        skill.name = that.name;
        skill.attribute = that.attribute;
        skill.dicePool = DicePool.create(that.dicePool);
        skill.career = that.career;
        skill.rank = that.rank;
        skill.result = null;
        return skill
    }

    rollDice() : void {
        this.result = this.dicePool.rollDice();
    }
}

export class DicePool {

    proficiency: ProfiencyDice[];
    ability: AbilityDice[];
    boost: BoostDice[];
    autoSuccess: AutoSuccessDice[];
    force: ForceDice[];

    adjProficiency: number;
    adjAbility: number;
    adjBoost: number;
    adjAutoSuccess: number;
    
    difficulty: number;
    challenge: number;
    setback: number;

    adjForce: number;

    constructor() {
        this.autoSuccess = new Array<AutoSuccessDice>();
        this.adjAutoSuccess = 0;
        this.boost = new Array<BoostDice>();
        this.adjBoost = 0;
        this.ability = new Array<AbilityDice>();
        this.adjAbility = 0;
        this.proficiency = new Array<ProfiencyDice>();
        this.adjProficiency = 0;
        this.difficulty = 0;
        this.challenge = 0;
        this.setback = 0;
        this.force = new Array<ForceDice>();
        this.adjForce = 0;
    }

    static create(that: IDicePool): DicePool {
        const dicePool: DicePool = new DicePool();
        for (let i = 0; i < that.autoSuccess; i++) {
            dicePool.autoSuccess.push(new AutoSuccessDice());
        }
        for (let i = 0; i < that.blue; i++) {
            dicePool.boost.push(new BoostDice());
        }
        for (let i = 0; i < that.green; i++) {
            dicePool.ability.push(new AbilityDice());
        }
        for (let i = 0; i < that.yellow; i++) {
            dicePool.proficiency.push(new ProfiencyDice());
        }
        for (let i = 0; i < that.force; i++) {
            dicePool.force.push(new ForceDice());
        }
        return dicePool
    }

    rollDice(): NetRollResult {

        let pool: Dice[] = new Array<Dice>();

        this.proficiency.forEach(i => pool.push(i));
        this.ability.forEach(i => pool.push(i));
        this.boost.forEach(i => pool.push(i));
        this.force.forEach(i => pool.push(i));

        for (let i = 0; i < this.adjProficiency; i++) {
            pool.push(new ProfiencyDice());
        }

        for (let i = 0; i < this.adjAbility; i++) {
            pool.push(new AbilityDice());
        }

        for (let i = 0; i < this.adjBoost; i++) {
            pool.push(new BoostDice());
        }

        for (let i = 0; i < this.adjAutoSuccess; i++) {
            pool.push(new AutoSuccessDice());
        }
        
        for (let i = 0; i < this.adjForce; i++) {
            pool.push(new ForceDice());
        }

        for (let i = 0; i < this.difficulty; i++) {
            pool.push(new DifficultyDice());
        }

        for (let i = 0; i < this.challenge; i++) {
            pool.push(new ChallengeDice());
        }

        for (let i = 0; i < this.setback; i++) {
            pool.push(new SetbackDice());
        }

        for (let i = 0; i < this.adjForce; i++) {
            pool.push(new ForceDice());
        }

        return DiceRoller.roll(pool);
    }

    addDifficulty() : void {
        if (this.difficulty == 5) {
            this.difficulty = 0;
        } else {
            this.difficulty = this.difficulty + 1;
        }
    }

    addSetback() : void {
        if (this.setback == 5) {
            this.setback = 0;
        } else {
            this.setback = this.setback + 1;
        }
    }

    addChallenge() : void {
        if (this.challenge == 5) {
            this.challenge = 0;
        } else {
            this.challenge = this.challenge + 1;
        }
    }

    addProficiency() : void {
        if (this.adjProficiency == 5) {
            this.adjProficiency = 0;
        } else {
            this.adjProficiency = this.adjProficiency + 1;
        }
    }

    addAbility() : void {
        if (this.adjAbility == 5) {
            this.adjAbility = 0;
        } else {
            this.adjAbility = this.adjAbility + 1;
        }
    }

    addBoost() : void {
        if (this.adjBoost == 5) {
            this.adjBoost = 0;
        } else {
            this.adjBoost = this.adjBoost + 1;
        }
    }

    addAutoSuccess() : void {
        if (this.adjAutoSuccess == 5) {
            this.adjAutoSuccess = 0;
        } else {
            this.adjAutoSuccess = this.adjAutoSuccess + 1;
        }
    }

    addForce() : void {
        if (this.adjForce == 5) {
            this.adjForce = 0;
        } else {
            this.adjForce = this.adjForce + 1;
        }
    }
}

export class Specialisation {
    name: string;

    public static create(that: ISpecialisation): Specialisation {
        const specialisation: Specialisation = new Specialisation();
        specialisation.name = that.name;
        return specialisation;
    }
}

export class Weapon {
    static create(that: IWeapon): any {
        const weapon: Weapon = new Weapon;
        weapon.name = that.name;
        weapon.skill = that.skill;
        weapon.range = that.range;
        weapon.damage = that.damage;
        weapon.critical = that.critical;
        weapon.dicePool = DicePool.create(that.dicePool);
        weapon.special = that.special;
        return weapon;
    }
    name: string;
    skill: string;
    range: string;
    damage: number;
    critical: number;
    dicePool: DicePool;
    special: string;
}