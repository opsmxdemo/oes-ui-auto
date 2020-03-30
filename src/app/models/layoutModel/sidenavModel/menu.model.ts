import { SubMenu } from './subMenu.model';

export class Menu {
    name: string;
    id: number;
    link:string;
    subMenu:SubMenu[];

    constructor(data: any) {
        data = data || {};
        this.name = data.name;
        this.id = data.id;
        this.link = this.link;
        this.subMenu=[];
        data.subMenu.forEach(element => {
            this.subMenu.push(new SubMenu(element));
        });
    }
}
