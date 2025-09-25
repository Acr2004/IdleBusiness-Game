import { Business } from "./Business";
import { Car } from "./Car";

export class TaxiBusiness extends Business {
    activeCars: Car[];
    maxSpace: number;
    incomePerHour: number;

    constructor(
        name: string,
        type: number,
        activeCars: Car[] = [],
        maxSpace: number,
        id: string = ""
    ) {
        super(name, type, id);

        this.activeCars = activeCars;
        this.maxSpace = maxSpace;
        this.incomePerHour = this.calculateIncomePerHour();
    }

    addSpace(spaceToAdd: number) {
        this.maxSpace += spaceToAdd;
    }

    addCar(name: string, category: string, kilometers: number, incomePerHour: number) {
        let newCar = new Car(name, category, kilometers, incomePerHour);
        this.activeCars = [...this.activeCars, newCar];
        this.incomePerHour = this.calculateIncomePerHour();
    }

    calculateIncomePerHour() {
        return this.activeCars.reduce((total, car) => total + car.incomePerHour, 0);
    }
}