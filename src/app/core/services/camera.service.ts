import { Injectable } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadString } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  constructor(private storage: Storage) {}

  async uploadImage(cameraFile: any, id: string) {
    const path = `uploads/${id}/pic.webp`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      return await getDownloadURL(storageRef);
    } catch (e) {
      return null;
    }
  }
}
