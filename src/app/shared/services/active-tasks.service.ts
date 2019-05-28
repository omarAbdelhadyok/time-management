import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { ActiveTask } from '../models/active-task.model';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class ActiveTasksService {

    constructor(private db: AngularFirestore) { }

    getAll() {
        return this.db.collection<ActiveTask>(`activeTasks`).ref.orderBy('date', 'desc').get();
    }

    // getById(id: string) {
    //     return this.db.collection(`projects`).doc<Project>(id).valueChanges();
    // }

    create(id, data) {
        return this.db.collection<ActiveTask>(`activeTasks`).doc(id).set({ ...data });
    }

    // update(id: string, data) {
    //     return this.db.collection<Project>(`projects`).doc(id).update(data);
    // }

    delete(id: string) {
        return this.db.collection<ActiveTask>(`activeTasks`).doc(id).delete();
    }

    //delete field from firebase
    // let userId = "this-is-my-user-id"
    // let groupId = "this-is-my-group-id"

    // db.collection('groups').doc(groupId).update({
    // ['members.' + userId]: firebase.firestore.FieldValue.delete()
    // })
    // deleteField() {
    //     this.db.collection('currentTasks').doc('current').update({
    //         ['']: firebase.firestore.FieldValue.delete()
    //     })
    // }

    //update field
    // var usersUpdate = {};
    // usersUpdate[`favorites.${key}.color`] = true;

    // db.collection("users").doc("frank").update(usersUpdate);

}