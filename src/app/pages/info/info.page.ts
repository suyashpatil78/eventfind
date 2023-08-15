import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  credentials!: FormGroup;
  image: any;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
  ) {}

  get name() {
    return this.credentials.get('name');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  async takePicture() {
    this.image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
    });
  }

  async createUser() {
    if (this.image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.authService.createUser(this.image, this.name);
      await loading.dismiss();

      this.router.navigateByUrl('tabs/feed', { replaceUrl: true });
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
