import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  imageArray: any[] = [];

  currentID = new BehaviorSubject('');
  getID = this.currentID.asObservable();

  constructor() {}

  getCurrentID(message: string) {
    this.currentID.next(message);
  }
}
