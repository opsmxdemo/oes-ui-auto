
export class ApplicationList {
    name: string;
    description:string
    status: string;

    constructor(data: any) {
        data = data || {};
        this.name = data.name;
        this.description = data.description;
        this.status = data.status;
    }
}
