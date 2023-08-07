import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  async register({ email, password }: { email: string; password: string }) {
    try {
      const { user } = await createUserWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
