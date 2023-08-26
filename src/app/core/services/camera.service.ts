import { Injectable } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadString } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  constructor(private storage: Storage) {}

  /**
   * This function is called whenever a user uploads an image using camera or gallery.
   * The image is uploaded to Firebase Storage and the URL is stored in the corresponding document in the Firestore database.
   */
  async uploadImage(cameraFile: Photo, id: string): Promise<string> {
    const path = `uploads/${id}/pic.webp`;
    const storageRef = ref(this.storage, path);

    try {
      // This method is used to upload the image to Firebase Storage. base64 is the format of the encoded image.
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      // This method is used to get the download URL for a file by calling the getDownloadURL() method on a Cloud Storage reference.
      return await getDownloadURL(storageRef);
    } catch (e) {
      return null;
    }
  }
}
