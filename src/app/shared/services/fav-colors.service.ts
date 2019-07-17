import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { FavColor } from '../models';
@Injectable({
    providedIn: 'root'
})
export class FavColorsService {

    user: User = JSON.parse(localStorage.getItem('appUser'));

    constructor(private db: AngularFirestore) {}

    getAll() {
        return this.db.collection<FavColor>(`fav-colors`).ref.where('uid', '==', this.user.uid).get();
    }

    getById(id: string) {
        return this.db.collection(`fav-colors`).doc<FavColor>(id).valueChanges();
    }

    create(id, data) {
        return this.db.collection<FavColor>(`fav-colors`).doc(id).set({ ...data });
    }

    update(id: string, data) {
        return this.db.collection<FavColor>(`fav-colors`).doc(id).update(data);
    }

    delete(id: string) {
        return this.db.collection<FavColor>(`fav-colors`).doc(id).delete();
    }

}