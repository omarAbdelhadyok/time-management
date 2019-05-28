import { Injectable } from "@angular/core";
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
    providedIn: 'root'
})
export class PhotosService {
    constructor(private storage: AngularFireStorage) {}

    uploadPhoto(path: string, photo: string) {
        return this.storage.upload(path, photo);
    }
    
    deleteItemImg(imgUrl) {
        return this.storage.storage.refFromURL(imgUrl).delete();
    }
}