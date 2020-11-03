
export class GroupPermission {
    userGroupId: string;
    permissionIds: any[];
    userGroupName : any;

    constructor(data: any) {
        data = data || {};
        this.userGroupId = data.userGroupId;
        this.userGroupName = data.userGroupName;
        this.permissionIds=[];
        data.pipelines.forEach(element => {
            this.permissionIds.push(element);
        });
    }
}
