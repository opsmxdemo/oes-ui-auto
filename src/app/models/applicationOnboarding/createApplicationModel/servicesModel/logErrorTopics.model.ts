
export class LogErrorTopics {
    topic: string;
    string: string;
    type: string;

    constructor(data: any) {
        data = data || {};
        this.topic = data.topic;
        this.string = data.string;
        this.type = data.type;
    }
}
