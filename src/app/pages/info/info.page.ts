import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Photo } from '@capacitor/camera';
import { AuthService } from 'src/app/core/services/auth.service';
import { CameraService } from 'src/app/core/services/camera.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  credentials!: FormGroup;

  image: Photo;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private cameraService: CameraService,
  ) {}

  get name(): AbstractControl<string> {
    return this.credentials.get('name');
  }

  ngOnInit(): void {
    this.credentials = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  async takePicture(): Promise<void> {
    this.image = await this.cameraService.getPhoto();
  }

  async createUser(): Promise<void> {
    if (this.image) {
      const loading = await this.loadingController.create();
      await loading.present();

      await this.authService.createUser(this.image, this.name);
      await loading.dismiss();

      this.router.navigateByUrl('tabs/feed', { replaceUrl: true });
    }
  }

  async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
