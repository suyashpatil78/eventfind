import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { User } from 'src/app/core/models/user.model';
import { Event } from 'src/app/core/models/event.model';

@Component({
  selector: 'app-eventpage',
  templateUrl: './eventpage.page.html',
  styleUrls: ['./eventpage.page.scss'],
})
export class EventpagePage implements OnInit {
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
    public dataService: DataService,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private authService: AuthService,
  ) {}

  get currentEventId(): string {
    return this.route.snapshot.params['id'] as string;
  }

  async ngOnInit(): Promise<void> {
    this.dataService.getID.subscribe(async (id) => {
      const user = await this.authService.getCurrentUser();
      if (id) {
        this.eventCreatorID = id;
        if (id === user?.id || user?.events?.includes(id)) {
          this.blur = false;
        }

        const ev = await this.eventService.getEvent(this.currentEventId);
        this.user = user;
        this.event = ev;
      }
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
    const loading = await this.loadingController.create();
    await loading.present();

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    const success = await this.eventService.participateEvent(
      image,
      this.event.creatorUserID,
      this.user.id,
      this.currentEventId,
    );

    if (success) {
      this.blur = false;
      this.event = await this.eventService.getEvent(this.currentEventId);
    }
    await loading.dismiss();
  }

  async doRefresh(event: Partial<CustomEvent>): Promise<void> {
    this.event = await this.eventService.getEvent(this.currentEventId);
    const eventTarget = event.target as HTMLIonRefresherElement;
    eventTarget.complete();
  }

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
