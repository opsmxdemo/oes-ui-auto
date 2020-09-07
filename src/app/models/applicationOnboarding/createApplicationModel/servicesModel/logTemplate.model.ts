import { LogErrorTopics } from './logErrorTopics.model'

export class CreateLogTemplate {
    templateName: string;
    monitoringProvider: string;
    sensitivity: string;
    accountName: string;
    namespace: string;
    index: string;
    kibanaIndex: string;
    regExFilter: boolean;
    regExResponseKey: string;
    regularExpression: string;
    errorTopics:LogErrorTopics[];
    
    constructor(data: any) {
        data = data || {};
        this.templateName = data.templateName;
        this.monitoringProvider = data.monitoringProvider;
        this.sensitivity = data.sensitivity;
        this.accountName = data.accountName;
        this.namespace = data.namespace;
        this.index = data.index;
        this.kibanaIndex = data.kibanaIndex;
        this.regExFilter = data.regExFilter;
        this.regExResponseKey = data.regExResponseKey;
        this.regularExpression = data.regularExpression;
        this.errorTopics=[];
        data.errorTopics.forEach(element => {
            this.errorTopics.push(new LogErrorTopics(element));
        });
       
    }
}
