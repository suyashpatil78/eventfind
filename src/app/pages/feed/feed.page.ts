import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoadingController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { EventService } from 'src/app/core/services/event.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  credentials: FormGroup;
  events: any = [];
  user: any = null;
  image: any = null;
  isLoading = false;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router,
    private loadingController: LoadingController,
    private authService: AuthService,
    private eventService: EventService,
  ) {}

  get name() {
    return this.credentials.get('name');
  }

  get description() {
    return this.credentials.get('description');
  }

  async ngOnInit() {
    this.isLoading = true;
    this.credentials = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.user = await this.authService.getCurrentUser();
    this.events = await this.eventService.getAllEvents();
    this.isLoading = false;
  }

  onEventClick(event: any) {
    this.router.navigateByUrl('tabs/eventpage/' + `${event.creatorPlayerID}-${event.name}-${event.description}`, {
      replaceUrl: true,
    });
    this.dataService.getCurrentID(event.creatorPlayerID);
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async doRefresh(event: any) {
    this.events = await this.eventService.getAllEvents();
    event.target.complete();
  }

  async takePicture() {
    this.image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
    });
  }

  async createEvent() {
    if (this.image) {
      const loading = await this.loadingController.create();
      await loading.present();

      try {
        const coordinates = await Geolocation.getCurrentPosition();
        const result = await this.eventService.createEvent(
          this.user.id,
          this.image,
          this.name.value,
          [coordinates.coords.latitude, coordinates.coords.longitude],
          this.description.value,
        );
      } catch (err) {
        const result = await this.eventService.createEvent(
          this.user.id,
          this.image,
          this.name.value,
          ['23.2323', '81.2323'],
          this.description.value,
        );
      }

      this.events = await this.eventService.getAllEvents();
      await loading.dismiss();

      this.image = null;
      this.credentials.reset();
      this.modal.dismiss(null, 'cancel');
    }
  }
}
