import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { noop } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor(private loadingController: LoadingController) {}

  async showLoader(message = 'Please wait...', duration = 10000): Promise<void> {
    const loading = await this.loadingController.create({
      message,
      duration,
    });
    return await loading.present();
  }

  async hideLoader(): Promise<boolean | void> {
    return this.loadingController.dismiss().catch(noop);
  }
}
