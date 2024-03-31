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

  //has read permission
  async hasReadPermission(): Promise<boolean> {
    return Geolocation.checkPermissions().then((result) => {
      if (result.location === 'granted') {
        return true;
      }
      return false;
    });
  }

  //request permission
  async requestPermission(): Promise<boolean> {
    return Geolocation.requestPermissions().then((result) => {
      if (result.location === 'granted') {
        return true;
      }
      return false;
    });
  }
}
