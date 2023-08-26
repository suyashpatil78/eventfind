import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-eventpage',
  templateUrl: './eventpage.page.html',
  styleUrls: ['./eventpage.page.scss'],
})
export class EventpagePage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  pageEvent: Event;
  user: any = null;
  orderby: string;
  name: string;
  event: any = null;
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

  get currentEventId() {
    return this.route.snapshot.params['id'];
  }

  async ngOnInit() {
    this.dataService.getID.subscribe(async (id: any) => {
      const user: any = await this.authService.getCurrentUser();
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

  goToMap(event: any) {
    const latitude = event.location[0];
    const longitude = event.location[1];
    this.router.navigateByUrl(`tabs/map?lat=${latitude}&long=${longitude}`, {
      replaceUrl: true,
    });
    return event;
  }

  async takePicture() {
    const loading = await this.loadingController.create();
    await loading.present();

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
    });

    const success = await this.eventService.participateEvent(
      image,
      this.event.creatorPlayerID,
      this.user.id,
      this.currentEventId,
    );

    if (success) {
      this.blur = false;
      this.event = await this.eventService.getEvent(this.currentEventId);
    }
    await loading.dismiss();
  }

  async doRefresh(event: any) {
    this.event = await this.eventService.getEvent(this.currentEventId);
    event.target.complete();
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
