import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  /*
   * This function is called whenever a user clicks on the camera icon to take a picture.
   */
  getPhoto(): Observable<Photo> {
    return from(
      Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
      }),
    );
  }
}
