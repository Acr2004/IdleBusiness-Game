import { Business } from "./Business";

export class ShopBusiness extends Business {
    subtype: number;
    incomePerHour: number;
    incomeMultiplier: number;
    levelUpCost: number;
    levelUpCostMultiplier: number;
    level: number;
    maxLevel: number;

    constructor(
        name: string,
        type: number,
        subtype: number,
        incomePerHour: number,
        incomeMultiplier: number,
        levelUpCost: number,
        levelUpCostMultiplier: number,
        maxLevel: number,
        level: number = 1,
        id: string = ""
    ) {
        super(name, type, id);

        this.subtype = subtype;
        this.incomePerHour = incomePerHour;
        this.incomeMultiplier = incomeMultiplier;
        this.levelUpCost = levelUpCost;
        this.levelUpCostMultiplier = levelUpCostMultiplier;
        this.maxLevel = maxLevel;
        this.level = level;
    }

    canLevelUp() {
        return this.level < this.maxLevel;
    }

    levelUp() {
        if(this.canLevelUp()) {
            this.level++;
            this.incomePerHour = Number((this.incomePerHour * this.incomeMultiplier).toFixed(2));
            this.levelUpCost = Number((this.levelUpCost * this.levelUpCostMultiplier).toFixed(2));
        }
    }

    calculateIncomePerHour() {
        return this.incomePerHour;
    }

    getLevelUpCost() {
        return this.levelUpCost;
    }

    getNextBaseIncome() {
        return Number((this.incomePerHour * this.incomeMultiplier).toFixed(2));
    }
}