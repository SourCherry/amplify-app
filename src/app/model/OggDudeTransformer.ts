import { Character, Defense, Attributes, Characteristic, Skill, DicePool } from './Character';

export class OggDudeTransformer {

    static to(input: any): Character {
        const character: Character = new Character();
        character.attributes = OggDudeTransformer.toAttributes(input.Character.Attributes);
        character.career = input.Character.Career.CareerKey;
        character.characterName = input.Character.Description.CharName;
        character.characteristics = OggDudeTransformer.toCharacteristics(input.Character.Characteristics);
        character.generalSkills = OggDudeTransformer.toGeneralSkills(input.Character.Skills, character.characteristics, character.attributes.forceRating);
        character.combatSkills = OggDudeTransformer.toCombatSkills(input.Character.Skills);

        return character;
    }
    static toGeneralSkills(input: any, characteristics: Characteristic[], forceRating : number): Skill[] {
        const skills: Skill[] = new Array<Skill>();

        const skillMap: SkillMap = new SkillMap();

        skillMap.map
            .filter(i => { return i.skillType == SkillType.GENERAL; })
            .forEach(i => {
                const charSkill: any = input.CharSkill.find(j => { return j.Key == i.oggDude; });
                const skill: Skill = new Skill();
                skill.attribute = i.attribute;
                if (charSkill.isCareer) {
                    skill.career = true;
                } else {
                    skill.career = false;
                }
                skill.name = i.name;
                skill.rank = this.nullToZero(charSkill.Rank);
                let dicePool: DicePool = new DicePool();

                let attributeRanks: number = 0;
                let careerRanks: number = 0;
                let nonCareerRanks: number = 0;
                let purchasedRanks: number = 0;
                let speciesRanks: number = 0;
                let forceRanks: number = 0;

                if (charSkill.CharKeyOverride) {
                    attributeRanks = characteristics.find(c => c.name = charSkill.CharKeyOverride).value;
                } else {
                    attributeRanks = characteristics.find(c => c.name = i.attribute).value;
                }

                let yellow: number = 0;
                let green: number = 0;

                if (typeof charSkill.Rank !== "string") {

                    const rank: any = charSkill.Rank;
                    if (rank) {
                        careerRanks = this.nullToZero(rank.CareerRanks);
                        nonCareerRanks = this.nullToZero(rank.NonCareerRanks);
                        purchasedRanks = this.nullToZero(rank.PurchasedRanks);
                        speciesRanks = this.nullToZero(rank.SpeciesRanks);
                    } else {
                        careerRanks = 0;
                        nonCareerRanks = 0;
                        purchasedRanks = 0;
                        speciesRanks = 0;
                        forceRanks = 0;
                    }
                    const totalRanks: number = careerRanks + nonCareerRanks + purchasedRanks + speciesRanks;

                    if (attributeRanks > totalRanks) {
                        green = attributeRanks - totalRanks;
                        yellow = totalRanks;
                    } else if (attributeRanks == totalRanks) {
                        yellow = attributeRanks;
                    } else {
                        yellow = attributeRanks;
                        green = totalRanks - attributeRanks;
                    }

                    dicePool = DicePool.create({ "yellow": yellow, "green": green, "blue": 0, "force": 0, "autoSuccess": 0 });

                } else {
                    green = attributeRanks;
                }

                dicePool = DicePool.create({ "yellow": yellow, "green": green, "blue": 0, "force": 0, "autoSuccess": 0 });
                skill.dicePool = dicePool;

                skills.push(skill);
            })

        return skills;
    }

    static toCombatSkills(input: any): Skill[] {
        const skills: Skill[] = new Array<Skill>();

        input.CharSkill.forEach(i => {
            if (i.Key == "BRAWL"
                || i.Key == "GUNN"
                || i.Key == "LTSABER"
                || i.Key == "MELEE"
                || i.Key == "RANGHVY") {
                const skill: Skill = new Skill();
                skill.name = i.Key;
                skills.push(skill);
            }
        })
        return skills;
    }

    static nullToZero(input: any): number {
        if (input === undefined || input == null || input.length == 0) return 0;
        return Number.parseInt(input);
    }

    static toCharacteristics(input: any): Characteristic[] {
        const characteristics: Characteristic[] = new Array<Characteristic>();
        input.CharCharacteristic.forEach(i => {
            const characteristic: Characteristic = new Characteristic();
            characteristic.name = i.Name;
            characteristic.value = this.nullToZero(i.Rank.PurchasedRanks) + this.nullToZero(i.Rank.SpeciesRanks) + this.nullToZero(i.Rank.TalentRanks);
            characteristics.push(characteristic);
        });
        return characteristics;
    }

    static toAttributes(input: any): Attributes {
        const attributes: Attributes = new Attributes();
        let defenseRanged : number = 0;
        if(input.DefenseRanged) {
            defenseRanged = this.nullToZero(input.DefenseRanged.PurchasedRanks) + this.nullToZero(input.DefenseRanged.TalentRanks);
        }
        let defenseMelee : number = 0;
        if(input.DefenseMelee) {
            defenseMelee = this.nullToZero(input.DefenseMelee.PurchasedRanks) + this.nullToZero(input.DefenseMelee.TalentRanks)
        }
        attributes.defense = new Defense(defenseRanged, defenseMelee);
        attributes.soak = this.nullToZero(input.SoakValue.StartingRanks)
            + this.nullToZero(input.SoakValue.PurchasedRanks);
        attributes.strain = Number.parseInt(input.StrainThreshold.SpeciesRanks)
            + this.nullToZero(input.StrainThreshold.StartingRanks)
            + this.nullToZero(input.StrainThreshold.TalentRanks)
            + this.nullToZero(input.StrainThreshold.AttachRanks);
        attributes.wound = this.nullToZero(input.WoundThreshold.SpeciesRanks)
            + this.nullToZero(input.WoundThreshold.StartingRanks)
            + this.nullToZero(input.WoundThreshold.TalentRanks);
        attributes.forceRating = this.nullToZero(input.ForceRating.TalentRanks);
        return attributes;
    }
}

export class SkillMap {
    map: SkillMapEntry[] = [
        SkillMapEntry.create("ASTRO", "Astrogation", "Int", SkillType.GENERAL)
        , SkillMapEntry.create("ATHL", "Athletics", "Br", SkillType.GENERAL)
        , SkillMapEntry.create("BRAWL", "Brawl", "Br", SkillType.COMBAT)
        , SkillMapEntry.create("CHARM", "Charm", "Pr", SkillType.GENERAL)
        , SkillMapEntry.create("COERC", "Coercion", "Wil", SkillType.GENERAL)
        , SkillMapEntry.create("COMP", "Computers", "Int", SkillType.GENERAL)
        , SkillMapEntry.create("COOL", "Cool", "Pr", SkillType.GENERAL)
        , SkillMapEntry.create("COORD", "Coordination", "Ag", SkillType.GENERAL)
        , SkillMapEntry.create("CORE", "Core Worlds", "Int", SkillType.KNOWLEDGE)
        , SkillMapEntry.create("DECEP", "Deception", "Cun", SkillType.GENERAL)
        , SkillMapEntry.create("DISC", "Discipline", "Wil", SkillType.GENERAL)
        , SkillMapEntry.create("EDU", "Education", "Int", SkillType.KNOWLEDGE)
        , SkillMapEntry.create("GUNN", "Gunnery", "Ag", SkillType.COMBAT)
        , SkillMapEntry.create("LEAD", "Leadership", "Pr", SkillType.GENERAL)
        , SkillMapEntry.create("LTSABER", "Lightsaber", "Br", SkillType.COMBAT)
        , SkillMapEntry.create("LORE", "Lore", "Int", SkillType.KNOWLEDGE)
        , SkillMapEntry.create("MECH", "Mechanics", "Int", SkillType.GENERAL)
        , SkillMapEntry.create("MED", "Medicine", "Int", SkillType.GENERAL)
        , SkillMapEntry.create("MELEE", "Melee", "Br", SkillType.COMBAT)
        , SkillMapEntry.create("NEG", "Negotiation", "Pr", SkillType.GENERAL)
        , SkillMapEntry.create("OUT", "Outer Rim", "Int", SkillType.KNOWLEDGE)
        , SkillMapEntry.create("PERC", "Perception", "Cun", SkillType.KNOWLEDGE)
        , SkillMapEntry.create("PILOTPL", "Piloting - Planetary", "Ag", SkillType.GENERAL)
        , SkillMapEntry.create("PILOTSP", "Piloting - Space", "Ag", SkillType.GENERAL)
        , SkillMapEntry.create("RANGHVY", "Ranged - Heavy", "Ag", SkillType.COMBAT)
        , SkillMapEntry.create("RANGLT", "Ranged - Light", "Ag", SkillType.COMBAT)
        , SkillMapEntry.create("RESIL", "Resiliance", "Br", SkillType.GENERAL)
        , SkillMapEntry.create("SKUL", "Skulduggery", "Cun", SkillType.GENERAL)
        , SkillMapEntry.create("STEAL", "Stealth", "Ag", SkillType.GENERAL)
        , SkillMapEntry.create("SW", "Streetwise", "Cun", SkillType.GENERAL)
        , SkillMapEntry.create("SURV", "Survival", "Cun", SkillType.GENERAL)
        , SkillMapEntry.create("UND", "Underworld", "Int", SkillType.KNOWLEDGE)
        , SkillMapEntry.create("VIGIL", "Vigilance", "Wil", SkillType.GENERAL)
        , SkillMapEntry.create("XEN", "Xenology", "Int", SkillType.KNOWLEDGE)
        , SkillMapEntry.create("WARF", "Warfare", "Int", SkillType.KNOWLEDGE)
    ];
}

export class SkillMapEntry {
    oggDude: string;
    name: string;
    attribute: string;
    skillType: SkillType

    static create(oggDude: string, name: string, attribute: string, skillType: SkillType): SkillMapEntry {
        return new SkillMapEntry(oggDude, name, attribute, skillType);
    }

    constructor(oggDude: string, name: string, attribute: string, skillType: SkillType) {
        this.name = name;
        this.oggDude = oggDude;
        this.attribute = attribute;
        this.skillType = skillType;
    }
}

export enum SkillType { GENERAL, COMBAT, KNOWLEDGE }