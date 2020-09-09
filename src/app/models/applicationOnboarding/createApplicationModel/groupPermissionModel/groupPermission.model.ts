
export class GroupPermission {
    userGroupId: string;
    permissionIds: any[];

    constructor(data: any) {
        data = data || {};
        this.userGroupId = data.userGroupId;
        this.permissionIds=[];
        data.pipelines.forEach(element => {
            this.permissionIds.push(element);
        });
    }
}
