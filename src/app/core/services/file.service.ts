import { Injectable } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadString } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private storage: Storage) {}

  /*
   * This function is called whenever a user uploads an image using camera or gallery.
   * The image is uploaded to Firebase Storage and the URL is stored in the corresponding document in the Firestore database.
   */
  uploadFile(photo: Photo, id: string): Observable<string> {
    const path = `uploads/${id}/pic.webp`;
    const storageRef = ref(this.storage, path);

    // This method is used to upload the image to Firebase Storage. base64 is the format of the encoded image.
    return from(uploadString(storageRef, photo.base64String!, 'base64')).pipe(
      // This method is used to get the download URL for a file by calling the getDownloadURL() method on a Cloud Storage reference.
      switchMap(() => from(getDownloadURL(storageRef))),
      catchError((error) => {
        return throwError(error);
      }),
    );
  }
}
