import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { catchError, from, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
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
}
