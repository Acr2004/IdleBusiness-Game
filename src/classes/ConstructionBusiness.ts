import { Business } from "./Business";
import { Construction } from "./Construction";

export class ConstructionBusiness extends Business {
    constructions: Construction[];
    metal: number;
    workers: number;
    wood: number;
    concrete: number;
    salesMap: Record<number, number>;

    constructor(
        name: string,
        type: number,
        constructions: Construction[] = [],
        salesMap: Record<number, number> = {},
        metal: number = 0,
        workers: number = 0,
        wood: number = 0,
        concrete: number = 0,
        id: string = ""
    ) {
        super(name, type, id);

        this.constructions = constructions;
        this.salesMap = salesMap;
        this.metal = metal;
        this.workers = workers;
        this.wood = wood;
        this.concrete = concrete;
    }

    addConstruction(name: string, time: number, price: number, level: number) {
        const newConstruction = new Construction(name, time, price, level);
        this.constructions = [...this.constructions, newConstruction];
    }

    addMaterial(materialName: string, quantity: number) {
        switch(materialName) {
            case "Metal": {
                this.metal += quantity;
                break;
            }
            case "Workers": {
                this.workers += quantity;
                break;
            }
            case "Wood": {
                this.wood += quantity;
                break;
            }
            case "Concrete": {
                this.concrete += quantity;
                break;
            }
            default: {
                break;
            }
        }
    }

    useMaterial(materialName: string, quantity: number) {
        switch(materialName) {
            case "Metal": {
                this.metal -= quantity;
                break;
            }
            case "Workers": {
                this.workers -= quantity;
                break;
            }
            case "Wood": {
                this.wood -= quantity;
                break;
            }
            case "Concrete": {
                this.concrete -= quantity;
                break;
            }
            default: {
                break;
            }
        }
    }

    getMaterialAmount(materialName: string) {
        switch(materialName) {
            case "Metal": {
                return this.metal;
            }
            case "Workers": {
                return this.workers;
            }
            case "Wood": {
                return this.wood;
            }
            case "Concrete": {
                return this.concrete;
            }
            default: {
                return 0;
            }
        }
    }

    sellConstruction(id: string) {
        const sold = this.constructions.find((c) => c.id === id);

        if (sold) {
            const currentCount = this.salesMap[sold.level] || 0;
            this.salesMap[sold.level] = currentCount + 1;

            this.constructions = this.constructions.filter((c) => c.id !== id);
        }
    }

    getSoldCountByLevel(level: number): number {
        return this.salesMap[level] || 0;
    }

    calculateIncomePerHour() {
        return 0;
    }

    calculateFinishedProjectsIncome() {
        let income = 0;

        this.constructions.map((c) => {
            if (c.timeLeft === 0) {
                income += c.price;
            }
        })

        return income;
    }
}