import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { catchError, finalize, from, switchMap, throwError } from 'rxjs';
import { CameraService } from '../../services/camera.service';
import { Photo } from '@capacitor/camera';
import { LoaderService } from '../../services/loader.service';
import { LocationService } from '../../services/location.service';
import { EventService } from '../../services/event.service';
import { User } from '../../models/user.model';
import { ToastService } from '../../services/toast.service';
import { ToastType } from '../../enums/ToastType.enum';

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
    private toastService: ToastService,
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

  async takePicture(): Promise<void> {
    this.image = await this.cameraService.getPhoto();
  }

  createEvent(): void {
    from(this.locationService.requestPermission()).subscribe((permission) => {
      if (permission) {
        return from(this.loaderService.showLoader('Creating your event...', 20 * 1000))
          .pipe(
            switchMap(() => this.locationService.getLocationCoordinates()),
            switchMap((coordinates) => {
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
                this.toastService.showToast(ToastType.FAILURE, 'Please attach an image');
                return throwError('User or image not found');
              }
            }),
            catchError((error) => throwError(error)),
            finalize(() => from(this.loaderService.hideLoader())),
          )
          .subscribe(() => {
            this.toastService.showToast(ToastType.SUCCESS, 'Event created successfully');
            this.modalController.dismiss({ action: 'save' });
          });
      } else {
        return this.createEvent();
      }
    });
  }
}
