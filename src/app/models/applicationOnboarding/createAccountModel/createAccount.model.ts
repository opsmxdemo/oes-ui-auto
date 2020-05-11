export class CreateAccount {
    name: string;
    accountType: string;
    namespaces: [];
    read: [];
    write: [];
    execute: [];

    constructor(data: any) {
        data = data || {};
        this.name = data.name;
        this.accountType = data.description;
        this.namespaces=data.namespaces;
        this.read = data.read;
        this.write = data.write;
        this.execute = data.execute;
        // data.namespaces.forEach(element => {
        //     this.namespaces.push();
        // });
    }
}
