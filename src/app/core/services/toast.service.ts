import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastType } from '../enums/ToastType.enum';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  getToastIcon(type: ToastType): string {
    return type === ToastType.SUCCESS ? 'checkmark-circle-outline' : 'alert-circle-outline';
  }

  async showToast(type: ToastType, message: string, duration = 2000): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      cssClass: `toast-${type}`,
      icon: this.getToastIcon(type),
    });

    return await toast.present();
  }
}
