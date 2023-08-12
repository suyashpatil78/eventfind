import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, Auth, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, onSnapshot, setDoc } from '@angular/fire/firestore';
import { CameraService } from './camera.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private cameraService: CameraService,
  ) {}

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

  async createUser(image: any, name: any) {
    const user = this.auth.currentUser as User;
    const userDocRef = doc(this.firestore, 'users', user.uid);
    const picture = await this.cameraService.uploadImage(image, 'profile/' + user.uid);
    return setDoc(userDocRef, {
      id: user.uid,
      email: user.email,
      name: name.value,
      points: 200,
      events: [],
      images: [],
      picture,
    });
  }

  subscribeToUserUpdates(callback: any) {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, 'users', user.uid);
    return onSnapshot(userDocRef, (d) => {
      callback(d.data());
    });
  }

  async getCurrentUser() {
    const user = this.auth.currentUser;
    const docRef = await getDoc(doc(this.firestore, 'users', user.uid));
    return docRef.data();
  }
}
