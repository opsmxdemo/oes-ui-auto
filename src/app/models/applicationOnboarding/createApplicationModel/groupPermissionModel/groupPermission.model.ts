
export class GroupPermission {
    userGroupId: string;
    permissionId: any[];

    constructor(data: any) {
        data = data || {};
        this.userGroupId = data.userGroupId;
        this.permissionId=[];
        data.pipelines.forEach(element => {
            this.permissionId.push(element);
        });
    }
}
