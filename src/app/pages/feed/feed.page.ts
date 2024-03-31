import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { EventService } from 'src/app/core/services/event.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Event } from 'src/app/core/models/event.model';
import { User } from 'src/app/core/models/user.model';
import { CameraService } from 'src/app/core/services/camera.service';
import { Photo } from '@capacitor/camera';
import { forkJoin, from, switchMap, tap } from 'rxjs';
import { EventModalComponent } from 'src/app/core/components/event-modal/event-modal.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  eventForm: FormGroup;

  events: Event[] = [];

  user: User = null;

  image: Photo = null;

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalController: ModalController,
    private authService: AuthService,
    private eventService: EventService,
    private cameraService: CameraService,
  ) {}

  get name(): string {
    return this.eventForm.controls.name.value as string;
  }

  get description(): string {
    return this.eventForm.controls.description.value as string;
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;

    this.eventForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    forkJoin({
      user: from(this.authService.getCurrentUser()),
      events: from(this.eventService.getAllEvents()),
    }).subscribe(({ user, events }) => {
      this.user = user;
      this.events = events;
      this.isLoading = false;
    });
  }

  onEventClick(event: Event): void {
    this.router.navigateByUrl('tabs/event/' + `${event.creatorUserID}-${event.name}-${event.description}`, {
      replaceUrl: true,
    });
  }

  doRefresh(event?: Partial<CustomEvent>): void {
    from(this.eventService.getAllEvents()).subscribe((events) => {
      this.events = events;
      const eventTarget = event?.target as HTMLIonRefresherElement;
      eventTarget?.complete?.();
    });
  }

  takePicture(): void {
    from(this.cameraService.getPhoto()).pipe(tap((image) => (this.image = image)));
  }

  openEventModal(): void {
    from(
      this.modalController.create({
        component: EventModalComponent,
        componentProps: {
          user: this.user,
        },
        mode: 'ios',
      }),
    )
      .pipe(
        tap((modal) => modal.present()),
        switchMap((modal) => modal.onWillDismiss() as Promise<{ data: { action: string } }>),
      )
      .subscribe((modalResponse) => {
        if (modalResponse?.data?.action === 'save') {
          this.doRefresh();
        }
      });
  }
}
