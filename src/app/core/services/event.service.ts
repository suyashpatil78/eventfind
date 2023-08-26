import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, Timestamp, setDoc } from '@angular/fire/firestore';
import { CameraService } from './camera.service';
import { Event } from '../models/event.model';
import { User } from '../models/user.model';
import { Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private firestore: Firestore,
    private cameraService: CameraService,
  ) {}

  async getUser(id: string): Promise<User> {
    try {
      const user = await getDoc(doc(this.firestore, 'users', id));
      return user.data() as User;
    } catch (e) {
      return null;
    }
  }

  async getAllEvents(): Promise<Event[]> {
    try {
      const eventsSnapshot = await getDocs(collection(this.firestore, 'events'));
      const eventsData = eventsSnapshot.docs.map((d) => d.data()) as Event[];
      const events = await Promise.all(
        eventsData.map(async (e: Event) => {
          const creator = await this.getUser(e.creatorUserID);
          return { ...e, creator };
        }),
      );
      events.sort((a: Event, b: Event) => b.createdAt.toMillis() - a.createdAt.toMillis());
      return events;
    } catch (e) {
      return null;
    }
  }

  async getEvent(id: string): Promise<Event> {
    try {
      // Fetching event with the given id
      const event: Event = (await getDoc(doc(this.firestore, 'events', id))).data() as Event;
      const creator = await this.getUser(event.creatorUserID);
      event.creator = creator;

      return event;
    } catch (e) {
      return null;
    }
  }

  async createEvent(
    creatorUserID: string,
    rawImage: Photo,
    name: string,
    coordinates: number[],
    description: string,
  ): Promise<void> {
    try {
      const user = await this.getUser(creatorUserID);
      // We give a special ID based on creatorUserID, name and description
      const eventId = `${creatorUserID}-${name}-${description}`;
      if (user.points >= 10) {
        const image = await this.cameraService.uploadImage(rawImage, 'event/' + eventId);
        await setDoc(doc(this.firestore, 'events', eventId), {
          name: name,
          location: coordinates,
          description: description,
          banner: image,
          imageArray: [image],
          creatorUserID,
          createdAt: Timestamp.now(),
        });

        user.events.push(eventId);
        user.images.push(image);
        // 10 points will be deducted for creating an event
        user.points -= 10;
        await setDoc(doc(this.firestore, 'users', creatorUserID), user);
      }
    } catch (e) {
      return;
    }
  }

  async participateEvent(rawImage: Photo, creatorUserID: string, userID: string, eventId: string): Promise<boolean> {
    try {
      const image = await this.cameraService.uploadImage(rawImage, 'event/' + eventId + '/' + userID);

      const event = await this.getEvent(eventId);
      event.imageArray.push(image);
      await setDoc(doc(this.firestore, 'events', eventId), event);

      const user = await this.getUser(userID);
      user.events.push(eventId);
      user.images.push(image);
      user.points += 10;
      await setDoc(doc(this.firestore, 'users', userID), user);

      return true;
    } catch (e) {
      return false;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await getDocs(collection(this.firestore, 'users'));
      return users.docs.map((d) => d.data()) as User[];
    } catch (e) {
      return null;
    }
  }
}
