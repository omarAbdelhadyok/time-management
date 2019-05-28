import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { Project } from '../models/project.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {

    constructor(private db: AngularFirestore) { }

    getAll() {
        return this.db.collection<Project>(`projects`).ref.orderBy('date', 'desc').get();
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

}