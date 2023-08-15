import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  where,
  query,
  Timestamp,
  setDoc,
  QueryConstraint,
} from '@angular/fire/firestore';
import { CameraService } from './camera.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private cameraService: CameraService,
  ) {}

  async getPlayer(id: any) {
    try {
      const user = await getDoc(doc(this.firestore, 'users', id));
      return user.data();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getAllEvents() {
    try {
      const eventsSnapshot = await getDocs(collection(this.firestore, 'events'));
      const eventsData = eventsSnapshot.docs.map((d) => d.data());
      const events = await Promise.all(
        eventsData.map(async (e: any) => {
          const creator = await this.getPlayer(e.creatorPlayerID);
          return { ...e, creator };
        }),
      );
      events.sort((a: any, b: any) => b.createdAt - a.createdAt);
      return events;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getEvent(id: any) {
    try {
      const conditions: QueryConstraint[] = [
        where('creatorPlayerID', '==', id.split('-')[0]),
        where('name', '==', id.split('-')[1]),
        where('description', '==', id.split('-')[2]),
      ];
      const q = query(collection(this.firestore, 'events'), ...conditions);
      const querySnapshot = await getDocs(q);

      const event: any = querySnapshot.docs.map((d) => d.data())[0];
      const creator = await this.getPlayer(event.creatorPlayerID);
      event.creator = creator;

      return event;
    } catch (e) {
      console.error(e);
    }
  }

  async createEvent(creatorPlayerID: any, rawImage: any, name: any, coordinates: any, description: any) {
    try {
      const player: any = await this.getPlayer(creatorPlayerID);
      if (player.points >= 10) {
        const image = await this.cameraService.uploadImage(rawImage, 'event/' + creatorPlayerID);
        await setDoc(doc(this.firestore, 'events', `${creatorPlayerID}-${name.value}-${description.value}`), {
          name: name.value,
          location: coordinates,
          description: description.value,
          banner: image,
          imageArray: [image],
          creatorPlayerID,
          createdAt: Timestamp.now(),
        });

        player.events.push(creatorPlayerID);
        player.images.push(image);
        // 10 points will be deducted for creating an event
        player.points -= 10;
        await setDoc(doc(this.firestore, 'users', creatorPlayerID), player);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async participateEvent(rawImage: any, creatorPlayerID: any, playerID: any, id: any) {
    try {
      const image = await this.cameraService.uploadImage(rawImage, 'event/' + creatorPlayerID + '/' + playerID);

      const event = await this.getEvent(id);
      event.imageArray.push(image);
      await setDoc(doc(this.firestore, 'events', creatorPlayerID), event);

      const player: any = await this.getPlayer(playerID);
      player.events.push(creatorPlayerID);
      player.images.push(image);
      player.points += 10;
      await setDoc(doc(this.firestore, 'users', playerID), player);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async getAllPlayers() {
    try {
      const users = await getDocs(collection(this.firestore, 'users'));
      return users.docs.map((d) => d.data());
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
