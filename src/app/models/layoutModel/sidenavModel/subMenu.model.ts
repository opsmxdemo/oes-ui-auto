export class SubMenu {
    name: string;
    id: number;
    link:string;

    constructor(data: any) {
        data = data || {};
        this.name = data.name;
        this.id = data.id;
        this.link = this.link;
    }
}
