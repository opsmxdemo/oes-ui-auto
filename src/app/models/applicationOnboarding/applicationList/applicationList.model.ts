
export class ApplicationList {
    name: string;
    description:string
    email: string;

    constructor(data: any) {
        data = data || {};
        this.name = data.name;
        this.description = data.description;
        this.email = data.status;
    }
}
