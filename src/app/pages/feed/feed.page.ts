import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { EventService } from 'src/app/core/services/event.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Event } from 'src/app/core/models/event.model';
import { User } from 'src/app/core/models/user.model';
import { CameraService } from 'src/app/core/services/camera.service';
import { Photo } from '@capacitor/camera';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  credentials: FormGroup;

  events: Event[] = [];

  user: User = null;

  image: Photo = null;

  isLoading = false;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router,
    private loadingController: LoadingController,
    private authService: AuthService,
    private eventService: EventService,
    private cameraService: CameraService,
  ) {}

  get name(): AbstractControl<string> {
    return this.credentials.get('name');
  }

  get description(): AbstractControl<string> {
    return this.credentials.get('description');
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.credentials = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.user = await this.authService.getCurrentUser();
    this.events = await this.eventService.getAllEvents();
    this.isLoading = false;
  }

  onEventClick(event: Event): void {
    this.router.navigateByUrl('tabs/eventpage/' + `${event.creatorUserID}-${event.name}-${event.description}`, {
      replaceUrl: true,
    });
    this.dataService.getCurrentID(event.creatorUserID);
  }

  cancel(): void {
    this.modal.dismiss(null, 'cancel');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async doRefresh(event: Partial<CustomEvent>): Promise<void> {
    this.events = await this.eventService.getAllEvents();
    const eventTarget = event.target as HTMLIonRefresherElement;
    eventTarget.complete();
  }

  async takePicture(): Promise<void> {
    this.image = await this.cameraService.getPhoto();
  }

  async createEvent(): Promise<void> {
    if (this.image) {
      const loading = await this.loadingController.create();
      await loading.present();

      try {
        const coordinates = await Geolocation.getCurrentPosition();
        await this.eventService.createEvent(
          this.user.id,
          this.image,
          this.name.value,
          [coordinates.coords.latitude, coordinates.coords.longitude],
          this.description.value,
        );
      } catch (err) {
        await this.eventService.createEvent(
          this.user.id,
          this.image,
          this.name.value,
          [23.2323, 81.2323],
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
