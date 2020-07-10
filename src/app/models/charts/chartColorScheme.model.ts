export class ColorScheme {
    
    domain: string[]

    constructor(data: any) {
        data = data || {};
        this.domain = data.domain;
    }
}
