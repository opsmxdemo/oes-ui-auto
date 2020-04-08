
export class Pipeline {
    value: string;
    id: number;

    constructor(data: any) {
        data = data || {};
        this.value = data.value;
        this.id = data.id;
    }
}
