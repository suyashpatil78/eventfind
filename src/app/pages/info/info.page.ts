import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { from, switchMap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { CameraService } from 'src/app/core/services/camera.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  profileDetails: FormGroup;

  image: Photo;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cameraService: CameraService,
    private loaderService: LoaderService,
    private platform: Platform,
  ) {}

  get name(): string {
    return this.profileDetails.controls.name.value as string;
  }

  ngOnInit(): void {
    this.profileDetails = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  async takePicture(): Promise<void> {
    this.image = await this.cameraService.getPhoto();
  }

  createUser(): void {
    if (this.image) {
      from(this.loaderService.showLoader('Signing you up...', 15 * 1000))
        .pipe(switchMap(() => this.authService.createUser(this.image, this.name)))
        .subscribe(() => {
          this.loaderService.hideLoader();
          this.router.navigateByUrl('tabs/feed', { replaceUrl: true });
        });
    }
  }
}
