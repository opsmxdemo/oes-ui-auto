
export class Environment {
    key: string;
    value: string;
    id: number; 

    constructor(data: any) {
        data = data || {};
        this.key = data.key;
        this.value = data.value;
        this.id = data.id;
    }
}
