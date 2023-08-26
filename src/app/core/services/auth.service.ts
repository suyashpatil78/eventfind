import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  Auth,
  signInWithEmailAndPassword,
  User,
  signOut,
  UserCredential,
  Unsubscribe,
} from '@angular/fire/auth';
import { DocumentData, Firestore, doc, getDoc, onSnapshot, setDoc } from '@angular/fire/firestore';
import { CameraService } from './camera.service';
import { Photo } from '@capacitor/camera';

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
      return null;
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      return null;
    }
  }

  /**
   * This call is made in the info page.
   * When user uploads an image using camera or gallery,
   * the image is uploaded to Firebase Storage and the URL is stored in the user's document in the Firestore database.
   */
  async createUser(image: Photo, name: any) {
    const user = this.auth.currentUser;
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

  /**
   * This call is made in the leaderboard page.
   * Whenever, there is a change in points, this function is called to update the points in the UI.
   */
  subscribeToUserUpdates(callback?: any) {
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

  async signOut() {
    try {
      await signOut(this.auth);
    } catch (e) {
      return;
    }
  }
}
