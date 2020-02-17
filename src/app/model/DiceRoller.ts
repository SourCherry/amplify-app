
export class DiceRoller {
    static roll(die: Dice[]): NetRollResult {
        let result: RollResult = RollResult.createEmpty();

        die.forEach(i => {
            const rollResult: RollResult = i.roll();
            result = result.add(rollResult);
        });
        return NetRollResult.create(result);
    }
}

export abstract class Dice {

    sideCount: number;
    rollResults: RollResult[];

    constructor(sideCount: number, rollResults: RollResult[]) {
        if (sideCount != rollResults.length) {
            throw new Error("the dice is misconfigured, side count and roll result lengths are not equal");
        }
        this.sideCount = sideCount;
        this.rollResults = rollResults;
    }

    roll(): RollResult {
        let face: number = Math.floor(Math.random() * this.sideCount);
        return this.rollResults[face];
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export class ProfiencyDice extends Dice {
    constructor() {
        super(12,
            [
                new RollResult(0, 0, 0, 0, 0, 0, 0, 0),
                new RollResult(1, 0, 0, 0, 0, 0, 0, 0),
                new RollResult(1, 0, 0, 0, 0, 0, 0, 0),
                new RollResult(2, 0, 0, 0, 0, 0, 0, 0),
                new RollResult(2, 0, 0, 0, 0, 0, 0, 0),
                new RollResult(0, 1, 0, 0, 0, 0, 0, 0),
                new RollResult(1, 1, 0, 0, 0, 0, 0, 0),
                new RollResult(1, 1, 0, 0, 0, 0, 0, 0),
                new RollResult(1, 1, 0, 0, 0, 0, 0, 0),
                new RollResult(0, 2, 0, 0, 0, 0, 0, 0),
                new RollResult(0, 2, 0, 0, 0, 0, 0, 0),
                new RollResult(0, 0, 1, 0, 0, 0, 0, 0)
            ]);
    }
}

export class AbilityDice extends Dice {
    constructor() {
        super(8,
            [
                new RollResult(0, 0, 0, 0, 0, 0, 0, 0),
                new RollResult(1, 0, 0, 0, 0, 0, 0, 0),
                new RollResult(1, 0, 0, 0, 0, 0, 0, 0),
                new RollResult(2, 0, 0, 0, 0, 0, 0, 0),
                new RollResult(0, 1, 0, 0, 0, 0, 0, 0),
                new RollResult(0, 1, 0, 0, 0, 0, 0, 0),
                new RollResult(1, 1, 0, 0, 0, 0, 0, 0),
                new RollResult(0, 2, 0, 0, 0, 0, 0, 0)
            ]);
    }
}

export class BoostDice extends Dice {
    constructor() {
        super(6,
            [
                new RollResult(0, 0, 0, 0, 0, 0, 0, 0),
                new RollResult(0, 0, 0, 0, 0, 0, 0, 0),
                new RollResult(0, 2, 0, 0, 0, 0, 0, 0),
                new RollResult(0, 1, 0, 0, 0, 0, 0, 0),
                new RollResult(1, 1, 0, 0, 0, 0, 0, 0),
                new RollResult(1, 0, 0, 0, 0, 0, 0, 0)
            ]);
    }
}

export class AutoSuccessDice extends Dice {
    constructor() {
        super(1,
            [
                new RollResult(1, 0, 0, 0, 0, 0, 0, 0)
            ]);
    }
}

export class DifficultyDice extends Dice {
    constructor() {
        super(8,
            [
                new RollResult(0, 0, 0, 0, 0, 0, 0, 0),
                new RollResult(0, 0, 0, -1, 0, 0, 0, 0),
                new RollResult(0, 0, 0, -2, 0, 0, 0, 0),
                new RollResult(0, 0, 0, 0, 0, -1, 0, 0),
                new RollResult(0, 0, 0, 0, 0, -1, 0, 0),
                new RollResult(0, 0, 0, 0, 0, -1, 0, 0),
                new RollResult(0, 0, 0, 0, 0, -2, 0, 0),
                new RollResult(0, 0, 0, 0, -1, -1, 0, 0)
            ]);
    }
}

export class ChallengeDice extends Dice {
    constructor() {
        super(12,
            [
                new RollResult(0, 0, 0, 0, 0, 0, 0, 0),
                new RollResult(0, 0, 0, -1, 0, 0, 0, 0),
                new RollResult(0, 0, 0, -1, 0, 0, 0, 0),
                new RollResult(0, 0, 0, -2, 0, 0, 0, 0),
                new RollResult(0, 0, 0, -2, 0, 0, 0, 0),
                new RollResult(0, 0, 0, 0, -1, 0, 0, 0),
                new RollResult(0, 0, 0, 0, -1, 0, 0, 0),
                new RollResult(0, 0, 0, -1, -1, 0, 0, 0),
                new RollResult(0, 0, 0, -1, -1, 0, 0, 0),
                new RollResult(0, 0, 0, 0, -2, 0, 0, 0),
                new RollResult(0, 0, 0, 0, -2, 0, 0, 0),
                new RollResult(0, 0, 0, 0, 0, -1, 0, 0),
            ]);
    }
}

export class SetbackDice extends Dice {
    constructor() {
        super(6,
            [
                new RollResult(0, 0, 0, 0, 0, 0, 0, 0),
                new RollResult(0, 0, 0, 0, 0, 0, 0, 0),
                new RollResult(0, 0, 0, -1, 0, 0, 0, 0),
                new RollResult(0, 0, 0, -1, 0, 0, 0, 0),
                new RollResult(0, 0, 0, 0, 0, -1, 0, 0),
                new RollResult(0, 0, 0, 0, 0, -1, 0, 0)
            ]);
    }
}

export class ForceDice extends Dice {
    constructor() {
        super(12,
            [
                new RollResult(0, 0, 0, 0, 0, 0, 0, 1),
                new RollResult(0, 0, 0, 0, 0, 0, 0, 1),
                new RollResult(0, 0, 0, 0, 0, 0, 0, 1),
                new RollResult(0, 0, 0, 0, 0, 0, 0, 1),
                new RollResult(0, 0, 0, 0, 0, 0, 0, 1),
                new RollResult(0, 0, 0, 0, 0, 0, 0, 1),
                new RollResult(0, 0, 0, 0, 0, 0, 0, 2),
                new RollResult(0, 0, 0, 0, 0, 0, 1, 0),
                new RollResult(0, 0, 0, 0, 0, 0, 1, 0),
                new RollResult(0, 0, 0, 0, 0, 0, 2, 0),
                new RollResult(0, 0, 0, 0, 0, 0, 2, 0),
                new RollResult(0, 0, 0, 0, 0, 0, 2, 0)
            ]);
    }
}

export class RollResult {
    static createEmpty(): RollResult {
        return new RollResult(0, 0, 0, 0, 0, 0, 0, 0);
    }
    success: number;
    advantage: number;
    triumph: number;
    fail: number;
    despair: number;
    threat: number;
    lightside: number;
    darkside: number;

    constructor(success: number, advantage: number, triumph: number, fail: number, threat: number, despair: number, lightside: number, darkside: number) {
        this.success = success;
        this.advantage = advantage;
        this.triumph = triumph;
        this.fail = fail;
        this.despair = despair;
        this.threat = threat;
        this.lightside = lightside;
        this.darkside = darkside;
    }

    add(that: RollResult): RollResult {
        return new RollResult(this.success + that.success, this.advantage + that.advantage, this.triumph + that.triumph, this.fail + that.fail, this.threat + that.threat, this.despair + that.despair, this.lightside + that.lightside, this.darkside + that.darkside);
    }

}

export class NetRollResult extends RollResult {
    netSuccess: number;
    netFail: number;
    netAdvantage: number;
    netThreat: number;

    static create(rollResult : RollResult): NetRollResult {
        let netSuccess: number = 0;
        let netFail: number = 0;

        if(rollResult.success + rollResult.fail + rollResult.despair + rollResult.triumph > 0) {
            netSuccess = rollResult.success + rollResult.fail + rollResult.despair + rollResult.triumph;
        } else {
            netFail = rollResult.success + rollResult.fail + rollResult.despair + rollResult.triumph;
        }

        let netAdvantage: number = 0;
        let netThreat: number = 0;

        if(rollResult.advantage + rollResult.threat > 0) {
            netAdvantage = rollResult.advantage + rollResult.threat;
        } else {
            netThreat = rollResult.advantage + rollResult.threat;
        }

        return new NetRollResult(rollResult.success, netSuccess, rollResult.advantage, netAdvantage, rollResult.triumph, rollResult.fail, netFail, rollResult.threat, netThreat, rollResult.despair, rollResult.lightside, rollResult.darkside);
    }

    constructor(success: number, netSuccess: number, advantage: number, netAdvantage: number, triumph: number, fail: number, netFail: number, threat: number, netThreat: number, despair: number, lightside: number, darkside: number) {
        super(success, advantage, triumph, Math.abs(fail), Math.abs(threat), Math.abs(despair), lightside, darkside);
        this.netSuccess = Math.abs(netSuccess);
        this.netFail = Math.abs(netFail);
        this.netAdvantage = Math.abs(netAdvantage);
        this.netThreat = Math.abs(netThreat);
    }

}