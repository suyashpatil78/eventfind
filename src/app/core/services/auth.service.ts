import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  Unsubscribe,
} from '@angular/fire/auth';
import { doc, Firestore, getDoc, onSnapshot, setDoc } from '@angular/fire/firestore';
import { Photo } from '@capacitor/camera';
import { catchError, from, map, noop, Observable, switchMap, throwError } from 'rxjs';
import { FileService } from './file.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  INITIAL_POINTS = 200;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private fileService: FileService,
  ) {}

  register({ email, password }: { email: string; password: string }): Observable<FirebaseUser> {
    // Returns the user details if the registration is successful
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredential) => userCredential.user),
      catchError((error) => {
        return throwError(error);
      }),
    );
  }

  /*
   * This call is made in the info page.
   * When user uploads an image using camera or gallery,
   * the image is uploaded to Firebase Storage and the URL is stored in the users document in the Firestore database.
   */
  createUser(image: Photo, name: string): Observable<void> {
    const user = this.auth.currentUser;

    if (user) {
      // Get the reference to the user document in Firestore
      const userDocRef = doc(this.firestore, 'users', user.uid);

      // Upload the image to Firebase Storage

      // uid is the unique identifier of the user
      return from(this.fileService.uploadFile(image, `profile/${user.uid}`)).pipe(
        switchMap((imgUrl) =>
          from(
            setDoc(userDocRef, {
              id: user.uid,
              email: user.email,
              name,
              points: this.INITIAL_POINTS,
              events: [],
              images: [],
              picture: imgUrl,
            }),
          ),
        ),
      );
    } else {
      // If user is null, sign out the user
      this.auth.signOut();
      return throwError('No user found!');
    }
  }

  login({ email, password }: { email: string; password: string }): Observable<FirebaseUser> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredential) => userCredential.user),
      catchError((error) => {
        return throwError(error);
      }),
    );
  }

  subscribeToUserUpdates(callback: (_: User) => void): Unsubscribe {
    const user = this.auth.currentUser;

    if (user) {
      // Get the reference to the user document in Firestore
      const userDocRef = doc(this.firestore, 'users', user.uid);

      // Whenever the user document changes, update the user property
      return onSnapshot(userDocRef, (d) => {
        const userData = d.data() as User;
        callback(userData);
      });
    } else {
      this.auth.signOut();
      return noop;
    }
  }

  getCurrentUser(): Observable<User> {
    const user = this.auth.currentUser;

    if (user) {
      // Get the reference to the user document in Firestore
      return from(getDoc(doc(this.firestore, 'users', user.uid))).pipe(map((d) => d.data() as User));
    } else {
      this.auth.signOut();
      return throwError('Authentication failed!');
    }
  }

  signOut(): Observable<void> {
    return from(this.auth.signOut());
  }
}
