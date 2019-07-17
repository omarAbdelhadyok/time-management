import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { Note, User } from '../models';

@Injectable({
    providedIn: 'root'
})
export class NotesService {

    user: User = JSON.parse(localStorage.getItem('appUser'));

    constructor(private db: AngularFirestore) {}

    getAll() {
        return this.db.collection<Note>(`notes`).ref.where('uid', '==', this.user.uid).get();
    }

    getById(id: string) {
        return this.db.collection(`notes`).doc<Note>(id).valueChanges();
    }

    create(id, data) {
        return this.db.collection<Note>(`notes`).doc(id).set({ ...data });
    }

    update(id: string, data) {
        return this.db.collection<Note>(`notes`).doc(id).update(data);
    }

    delete(id: string) {
        return this.db.collection<Note>(`notes`).doc(id).delete();
    }

}