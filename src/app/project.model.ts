export class Project {
    public id: number;
    constructor(public name: string) {
        this.id = new Date().getTime();
    }

}
