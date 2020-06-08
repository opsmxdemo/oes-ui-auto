export class TreeView {

    configId: string;
    name: string;
    childOf: string;
    user: string;
    applicationName: string;
    status: string;
    child: TreeView[];


    constructor(data: any) {
        data = data || {};
        this.configId = data.configId;
        this.name = data.name;
        this.childOf = data.childOf;
        this.user = data.user;
        this.applicationName = data.applicationName;
        this.status = data.status;
        this.child=[];
        data.child.forEach(element => {
            this.child.push(new TreeView(element));
        });
    }
}
