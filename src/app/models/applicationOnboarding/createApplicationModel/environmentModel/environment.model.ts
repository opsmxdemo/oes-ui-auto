
export class Environment {
    key: string;
    value: string;

    constructor(data: any) {
        data = data || {};
        this.key = data.key;
        this.value = data.value;
    }
}
