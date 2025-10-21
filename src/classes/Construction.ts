import { v4 as uuidv4 } from 'uuid';

export class Construction {
    id: string;
    name: string;
    timeLeft: number;
    price: number;
    level: number;

    constructor(name: string, timeLeft: number, price: number, level: number, id: string = "") {
        if(id === "") {
            this.id = uuidv4();
        }
        else {
            this.id = id;
        }

        this.name = name;
        this.timeLeft = timeLeft;
        this.price = price;
        this.level = level;
    }

    removeTime() {
        if (this.timeLeft > 0) {
            this.timeLeft -= 60000;

            if (this.timeLeft < 0) {
                this.timeLeft = 0;
            }
        }
    }
}