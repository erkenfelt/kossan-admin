import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import * as firebase from 'firebase';

export const USER_SESSION_KEY = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<User>;

  constructor(
    private readonly afAuth: AngularFireAuth,
    private readonly afs: AngularFirestore,
    private readonly router: Router,
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(auth => {
        if (auth) {
          return this.afs
            .collection<User>(`users`, ref => ref.where('uid', '==', auth.uid))
            .valueChanges()
            .pipe(
              tap(user => {
                sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user[0]));
              }),
            );
        } else {
          return of(null);
        }
      }),
    );
  }

  async signInAsync(email: string, password: string): Promise<boolean> {
    const result = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    return result.user !== undefined;
  }

  async signInWithGoogleAsync(): Promise<boolean> {
    const credential = await this.afAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider(),
    );
    this.updateUserData(credential.user);
    return credential.user !== undefined;
  }

  async signInWithFacebookAsync(): Promise<boolean> {
    const credential = await this.afAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider(),
    );
    this.updateUserData(credential.user);
    return credential.user !== undefined;
  }

  logout() {
    sessionStorage.clear();
    this.afAuth.auth.signOut().then(() => this.router.navigate(['/login']));
  }

  getCurrentUser(): User {
    return JSON.parse(sessionStorage.getItem(USER_SESSION_KEY));
  }

  private updateUserData(user: firebase.User) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      avatarUrl: user.photoURL,
    };

    userRef.update(data);
  }
}
