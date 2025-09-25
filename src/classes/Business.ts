import { v4 as uuidv4 } from 'uuid';

export class Business {
    id: string;
    name: string;
    type: number;

    constructor(name: string, type: number, id: string = "") {
        if(id === "") {
            this.id = uuidv4();
        }
        else {
            this.id = id;
        }

        this.name = name;
        this.type = type;
    }

    setName(newName: string) {
        this.name = newName;
    }

    calculateIncomePerHour() {
        return 0;
    }
}