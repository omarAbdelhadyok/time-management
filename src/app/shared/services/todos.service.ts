import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { User, Todo } from '../models';

@Injectable({
    providedIn: 'root'
})
export class TodosService {

    user: User = JSON.parse(localStorage.getItem('appUser'));

    constructor(private db: AngularFirestore) {}

    getAll() {
        return this.db.collection<Todo>(`todos`).ref.doc(this.user.uid).get();
    }

    getById(id: string) {
        return this.db.collection(`todos`).doc<Todo>(id).valueChanges();
    }

    create(id, data) {
        return this.db.collection<Todo>(`todos`).doc(id).set({ ...data });
    }

    update(id: string, data) {
        return this.db.collection<Todo>(`todos`).doc(id).update(data);
    }

    delete(id: string) {
        return this.db.collection<Todo>(`todos`).doc(id).delete();
    }

    // updateTodos(todos) {
    //     let batch = this.db.firestore.batch();
    //     let docRef = this.db.collection(`projects`).ref.doc;
    //     batch.set(docRef, {tasks: todos});
    //     return batch.commit();
    // }

}