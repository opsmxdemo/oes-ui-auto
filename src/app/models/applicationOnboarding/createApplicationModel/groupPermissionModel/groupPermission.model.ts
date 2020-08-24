
export class GroupPermission {
    userGroupId: string;
    permissionId: string;

    constructor(data: any) {
        data = data || {};
        this.userGroupId = data.userGroupId;
        this.permissionId = data.permissionId;
    }
}
