export class Note {
    constructor() {
        this.note = '';
        this.bgColor = '';
        this.txtColor = '';
        this.date = 0;
    }

    note: string;
    date: number;
    bgColor: string;
    txtColor: string;
    id?: string;
    uid?: string;
}
