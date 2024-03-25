import { Injectable } from '@angular/core';
import { Firestore, Timestamp, collection, doc, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import {
  Observable,
  catchError,
  forkJoin,
  from,
  map,
  mergeMap,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { AuthService } from './auth.service';
import { Event } from '../models/event.model';
import { User } from '../models/user.model';
import { Photo } from '@capacitor/camera';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private fireStore: Firestore,
    private authService: AuthService,
    private fileService: FileService,
  ) {}

  getUser(id: string): Observable<User> {
    return from(getDoc(doc(this.fireStore, 'users', id))).pipe(map((d) => d.data() as User));
  }

  getAllEvents(): Observable<Event[]> {
    // Returns all the events from the events collection
    const eventsSnapshot$ = from(getDocs(collection(this.fireStore, 'events')));

    // Extracts the data from the snapshot
    const eventsData$ = eventsSnapshot$.pipe(map((snapshot) => snapshot.docs.map((doc) => doc.data() as Event)));

    // Fetches the creator of the event from the users collection and merges it with the event data
    const events$ = eventsData$.pipe(
      mergeMap((eventsData) =>
        forkJoin(
          eventsData.map((event) =>
            from(this.getUser(event.creatorUserID)).pipe(map((creator) => ({ ...event, creator }))),
          ),
        ),
      ),
    );

    // Sort the events by the createdAt timestamp
    return events$.pipe(
      map((events) => events.sort((a: Event, b: Event) => b.createdAt.toMillis() - a.createdAt.toMillis())),
      catchError((error) => throwError(error)),
    );
  }

  createEvent(creatorUserID: string, image: Photo, name: string, coordinates: number[], description: string): void {
    const eventId = `${creatorUserID}-${name}-${description}`;

    // Upload the image to Firebase Storage
    const image$ = from(this.fileService.uploadFile(image, `event/${eventId}`)).pipe(shareReplay(1));

    // Fetch the creator of the event to check the points
    this.getUser(creatorUserID)
      .pipe(
        tap((user) => {
          if (user.points < 10) {
            return throwError('Not enough points');
          } else {
            return user;
          }
        }),
        // Resolve the file upload here
        switchMap((user) =>
          forkJoin({
            user: of(user),
            image: image$,
          }),
        ),
        switchMap(({ user, image }) => {
          const event: Event = {
            banner: image,
            createdAt: Timestamp.now(),
            creatorUserID,
            description,
            name,
            location: coordinates,
            imageArray: [],
          };

          // Create the event in the events collection and also update the user details
          return from(setDoc(doc(this.fireStore, 'events', eventId), event)).pipe(
            switchMap(() => {
              user.points -= 10;
              user.events.push(eventId);
              return from(setDoc(doc(this.fireStore, 'users', creatorUserID), user));
            }),
            catchError((error) => throwError(error)),
          );
        }),
        catchError((error) => throwError(error)),
      )
      .subscribe();
  }

  getEvent(id: string): Observable<Event | null> {
    return from(getDoc(doc(this.fireStore, 'events', id))).pipe(
      mergeMap((eventSnapshot) => {
        const event = eventSnapshot.data() as Event;

        return from(this.getUser(event.creatorUserID)).pipe(
          // Attach creator ID to the event object
          mergeMap((creator) => {
            event.creator = creator;
            return of(event);
          }),
          catchError((error) => {
            console.error('Error fetching creator:', error);
            return throwError(error);
          }),
        );
      }),
      catchError((error) => {
        console.error('Error fetching event:', error);
        return of(null);
      }),
    );
  }

  participateEvent(image: Photo, userID: string, eventId: string): Observable<void> {
    return from(this.fileService.uploadFile(image, `event/${eventId}`)).pipe(
      switchMap((imageUrl) =>
        forkJoin({
          user: this.getUser(userID),
          event: this.getEvent(eventId),
          imageUrl: of(imageUrl),
        }),
      ),
      switchMap(({ user, event, imageUrl }) => {
        event.imageArray.push(imageUrl);
        user.images.push(imageUrl);
        user.points += 10;
        user.events.push(eventId);

        return from(setDoc(doc(this.fireStore, 'events', eventId), event)).pipe(
          switchMap(() => from(setDoc(doc(this.fireStore, 'users', userID), user))),
          catchError((error) => throwError(error)),
        );
      }),
      catchError((error) => throwError(error)),
    );
  }
}
