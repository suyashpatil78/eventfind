import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  getLocationCoordinates(): Observable<Position> {
    return from(Geolocation.getCurrentPosition());
  }
}
