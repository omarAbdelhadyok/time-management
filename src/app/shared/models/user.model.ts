export class User {
    constructor() {
        this.email = '';
        this.displayName = '';
    }

    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    password?: string;
}