import { Injectable } from '@angular/core';
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
    private firestore: Firestore,
    private cameraService: CameraService,
  ) {}

  async getPlayer(id: any) {
    try {
      const user = await getDoc(doc(this.firestore, 'users', id));
      return user.data();
    } catch (e) {
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
      return null;
    }
  }

  async getEvent(id: any) {
    try {
      // Fetching event with the given id
      const event: any = (await getDoc(doc(this.firestore, 'events', id))).data();
      const creator = await this.getPlayer(event.creatorPlayerID);
      event.creator = creator;

      return event;
    } catch (e) {
      return null;
    }
  }

  async createEvent(creatorPlayerID: any, rawImage: any, name: any, coordinates: any, description: any) {
    try {
      const player: any = await this.getPlayer(creatorPlayerID);
      // We give a special ID based on creatorPlayerID, name and description
      const eventId = `${creatorPlayerID}-${name}-${description}`;
      if (player.points >= 10) {
        const image = await this.cameraService.uploadImage(rawImage, 'event/' + eventId);
        await setDoc(doc(this.firestore, 'events', eventId), {
          name: name,
          location: coordinates,
          description: description,
          banner: image,
          imageArray: [image],
          creatorPlayerID,
          createdAt: Timestamp.now(),
        });

        player.events.push(eventId);
        player.images.push(image);
        // 10 points will be deducted for creating an event
        player.points -= 10;
        await setDoc(doc(this.firestore, 'users', creatorPlayerID), player);
      }
    } catch (e) {
      return;
    }
  }

  async participateEvent(rawImage: any, creatorPlayerID: any, playerID: any, eventId: any) {
    try {
      const image = await this.cameraService.uploadImage(rawImage, 'event/' + eventId + '/' + playerID);

      const event = await this.getEvent(eventId);
      event.imageArray.push(image);
      await setDoc(doc(this.firestore, 'events', eventId), event);

      const player: any = await this.getPlayer(playerID);
      player.events.push(eventId);
      player.images.push(image);
      player.points += 10;
      await setDoc(doc(this.firestore, 'users', playerID), player);

      return true;
    } catch (e) {
      return false;
    }
  }

  async getAllPlayers() {
    try {
      const users = await getDocs(collection(this.firestore, 'users'));
      return users.docs.map((d) => d.data());
    } catch (e) {
      return null;
    }
  }
}
