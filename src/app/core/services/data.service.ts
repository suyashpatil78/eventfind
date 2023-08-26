import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  imageArray: string[] = [];

  currentID = new BehaviorSubject<string>('');

  getID = this.currentID.asObservable();

  getCurrentID(message: string): void {
    this.currentID.next(message);
  }
}
