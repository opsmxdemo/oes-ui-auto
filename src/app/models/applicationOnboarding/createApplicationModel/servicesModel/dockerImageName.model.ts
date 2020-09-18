
export class DockerImageName {
    accountName: string;
    imageName: string;

    constructor(data: any) {
        data = data || {};
        this.accountName = data.accountName;
        this.imageName = data.imageName;
    }
}
