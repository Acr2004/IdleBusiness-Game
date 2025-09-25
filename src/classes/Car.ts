import { v4 as uuidv4 } from 'uuid';

export class Car {
    id: string;
    name: string;
    category: string;
    kilometers: number;
    incomePerHour: number;

    constructor(name: string, category: string, kilometers: number, incomePerHour: number, id: string = "") {
        if(id === "") {
            this.id = uuidv4();
        }
        else {
            this.id = id;
        }

        this.name = name;
        this.category = category;
        this.kilometers = kilometers;
        this.incomePerHour = incomePerHour;
    }
}