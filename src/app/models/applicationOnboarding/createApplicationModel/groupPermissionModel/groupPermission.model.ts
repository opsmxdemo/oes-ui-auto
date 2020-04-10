
export class GroupPermission {
    userGroup: string;
    permission: string;

    constructor(data: any) {
        data = data || {};
        this.userGroup = data.userGroup;
        this.permission = data.permission;
    }
}
