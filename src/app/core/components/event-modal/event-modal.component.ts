import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { catchError, finalize, from, switchMap, tap, throwError } from 'rxjs';
import { CameraService } from '../../services/camera.service';
import { Photo } from '@capacitor/camera';
import { LoaderService } from '../../services/loader.service';
import { LocationService } from '../../services/location.service';
import { EventService } from '../../services/event.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss'],
})
export class EventModalComponent implements OnInit {
  eventForm: FormGroup;

  image: Photo = null;

  @Input() user: User = null;

  constructor(
    private modalController: ModalController,
    private cameraService: CameraService,
    private loaderService: LoaderService,
    private locationService: LocationService,
    private eventService: EventService,
  ) {}

  get eventName(): string {
    return this.eventForm.controls.name.value as string;
  }

  get eventDescription(): string {
    return this.eventForm.controls.description.value as string;
  }

  ngOnInit(): void {
    this.eventForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  closeModal(): void {
    this.modalController.dismiss();
  }

  takePicture(): void {
    from(this.cameraService.getPhoto()).pipe(tap((image) => (this.image = image)));
  }

  createEvent(): void {
    from(this.loaderService.showLoader())
      .pipe(
        switchMap(() => this.locationService.getLocationCoordinates()),
        catchError((error) => throwError(error)),
        finalize(() => this.loaderService.hideLoader()),
      )
      .subscribe((coordinates) => {
        if (this.user && this.image) {
          const location = [coordinates.coords.latitude, coordinates.coords.longitude];

          return this.eventService.createEvent(
            this.user.id,
            this.image,
            this.eventName,
            location,
            this.eventDescription,
          );
        } else {
          return throwError('User or image not found');
        }
      });
  }
}
