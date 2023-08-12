import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { CameraService } from 'src/app/core/services/camera.service';
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
    private cameraService: CameraService,
    private alertController: AlertController,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    this.dataService.getID.subscribe(async (message: any) => {
      const user: any = await this.authService.getCurrentUser();
      if (message) {
        this.eventCreatorID = message;
        if (message === user?.id || user?.events?.includes(message)) {
          this.blur = false;
        }

        const ev = await this.eventService.getEvent(message);
        this.user = user;
        this.event = ev;
        console.log(this.event);
        console.log(ev);
      }
    });
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  goToMap(event: any) {
    this.router.navigateByUrl('tabs/map', {
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
      source: CameraSource.Camera,
    });

    const success = await this.eventService.participateEvent(image, this.event.creatorPlayerID, this.user.id);

    if (success) {
      this.blur = false;
      this.event = await this.eventService.getEvent(this.eventCreatorID);
    }
    await loading.dismiss();
  }

  async doRefresh(event: any) {
    this.event = await this.eventService.getEvent(this.eventCreatorID);
    event.target.complete();
  }
}
