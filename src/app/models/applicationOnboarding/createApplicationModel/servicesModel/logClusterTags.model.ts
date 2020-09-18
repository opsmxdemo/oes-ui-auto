
export class LogClusterTags {
    string: string;
    tag: string;

    constructor(data: any) {
        data = data || {};
        this.string = data.string;
        this.tag = data.tag;
    }
}
