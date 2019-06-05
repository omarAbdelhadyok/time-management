import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { AngularFireAuth } from  "@angular/fire/auth";
import { auth } from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )

    this.user$.subscribe(res => {
      localStorage.setItem('appUser', JSON.stringify(res));
    })
  }

  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user)
  }

  signInWithMail(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  registerWithEmail(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(['/']);
  }

  updateUserData({uid, email, displayName, photoURL}: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);

    const data = {
      uid,
      email,
      displayName,
      photoURL
    };

    return userRef.set(data, {merge: true});
  }

  updateUser(id, displayName, photoURL) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${id}`);
    return userRef.update({displayName, photoURL})
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('appUser'));
    return user !== null;
  }

  getById(id: string) {
    return this.afs.collection(`users`).doc<User>(id).valueChanges();
  }

  
}
