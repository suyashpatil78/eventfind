import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';
import { Event } from 'src/app/core/models/event.model';
import { CameraService } from 'src/app/core/services/camera.service';
import { forkJoin, from, switchMap, tap } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { ToastType } from 'src/app/core/enums/ToastType.enum';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  pageEvent: Event;

  user: User = null;

  orderby: string;

  name: string;

  event: Event = null;

  blur = true;

  eventCreatorID = '';

  constructor(
    private router: Router,
    private eventService: EventService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cameraService: CameraService,
    private loaderService: LoaderService,
    private toastService: ToastService,
  ) {}

  get currentEventId(): string {
    return this.route.snapshot.params['id'] as string;
  }

  async ngOnInit(): Promise<void> {
    forkJoin({
      user: this.authService.getCurrentUser(),
      event: this.eventService.getEvent(this.currentEventId),
    }).subscribe(({ user, event }) => {
      this.eventCreatorID = user.id;
      if (user.id === event.creatorUserID || user.events.includes(this.currentEventId)) {
        this.blur = false;
      }
      this.user = user;
      this.event = event;
    });
  }

  goToMap(event: Event): Event {
    const latitude = event.location[0];
    const longitude = event.location[1];
    this.router.navigateByUrl(`tabs/map?lat=${latitude}&long=${longitude}`, {
      replaceUrl: true,
    });
    return event;
  }

  async takePicture(): Promise<void> {
    from(this.cameraService.getPhoto())
      .pipe(
        tap(() => this.loaderService.showLoader('Uploading your picture...')),
        switchMap((image) => this.eventService.participateEvent(image, this.user.id, this.currentEventId)),
      )
      .subscribe(() => {
        this.loaderService.hideLoader();
        this.toastService.showToast(ToastType.SUCCESS, 'You have successfully participated in the event');
        this.blur = false;
        this.doRefresh();
      });
  }

  doRefresh(evt?: Partial<CustomEvent>): void {
    from(this.eventService.getEvent(this.currentEventId)).subscribe((event) => {
      this.event = event;
      const eventTarget = evt?.target as HTMLIonRefresherElement;
      eventTarget?.complete?.();
    });
  }

  // Below logic is used to show the images in the form of grid
  getRowIndices(): number[] {
    const rowCount = Math.ceil(this.event.imageArray.length / 2);
    return Array.from({ length: rowCount }, (_, index) => index);
  }

  getColumnIndices(): number[] {
    return Array.from({ length: 2 }, (_, index) => index);
  }

  getIndex(rowIndex: number, colIndex: number): number {
    return rowIndex * 2 + colIndex;
  }
}
