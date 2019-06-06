import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Project } from '../models/project.model';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {

    user: User = JSON.parse(localStorage.getItem('appUser'));

    constructor(private db: AngularFirestore) {}

    getAll(option) {
        if(option == 'all') {
            return this.db.collection<Project>(`projects`).ref.orderBy('date', 'desc').where('uid', '==', this.user.uid).limit(50).get();
        } else if(option == 'active') {
            return this.db.collection<Project>(`projects`).ref.orderBy('date', 'desc').where('uid', '==', this.user.uid).where('closed', '==', false).limit(50).get(); 
        } else if(option == 'closed') {
            return this.db.collection<Project>(`projects`).ref.orderBy('date', 'desc').where('uid', '==', this.user.uid).where('closed', '==', true).limit(50).get(); 
        }
    }

    getById(id: string) {
        return this.db.collection(`projects`).doc<Project>(id).valueChanges();
    }

    create(id, data) {
        return this.db.collection<Project>(`projects`).doc(id).set({ ...data });
    }

    update(id: string, data) {
        return this.db.collection<Project>(`projects`).doc(id).update(data);
    }

    delete(id: string) {
        return this.db.collection<Project>(`projects`).doc(id).delete();
    }

    updateTasks(id, tasks) {
        let batch = this.db.firestore.batch();
        let docRef = this.db.collection(`projects`).doc(id).ref as DocumentReference;
        batch.update(docRef, {tasks: tasks});
        return batch.commit();
    }

    toggleProject(id: string, status: boolean) {
        return this.db.collection<Project>(`projects`).doc(id).update({closed: status})
    }

}