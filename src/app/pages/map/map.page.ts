import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { DataService } from 'src/app/core/services/data.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterViewInit {
  events: any = [];
  private map: any;

  constructor(
    private router: Router,
    private eventService: EventService,
    private dataService: DataService,
    private route: ActivatedRoute,
  ) {}

  async ngAfterViewInit() {
    this.events = await this.eventService.getAllEvents();
    this.initMap();
  }

  ionViewWillEnter() {
    if (
      this.map &&
      (this.route.snapshot.queryParams as { lat: string }).lat &&
      (this.route.snapshot.queryParams as { long: string }).long
    ) {
      const lat = parseFloat((this.route.snapshot.queryParams as { lat: string }).lat);
      const long = parseFloat((this.route.snapshot.queryParams as { long: string }).long);
      this.map.panTo([lat, long]);
    }
  }

  private onPopupClick(e: any) {
    console.log(e);
    this.router.navigateByUrl('tabs/eventpage/' + e, {
      replaceUrl: true,
    });
    this.dataService.getCurrentID(e);
  }
  private initMap(): void {
    if (
      (this.route.snapshot.queryParams as { lat: string }).lat &&
      (this.route.snapshot.queryParams as { long: string }).long
    ) {
      const lat = (this.route.snapshot.queryParams as { lat: string }).lat;
      const long = (this.route.snapshot.queryParams as { long: string }).long;
      this.map = L.map('map', {
        renderer: L.canvas(),
        // This is dummy location to be removed later
        center: [parseFloat(lat), parseFloat(long)],
        zoom: 12,
        zoomControl: true,
      });
    } else {
      this.map = L.map('map', {
        renderer: L.canvas(),
        // This is dummy location to be removed later
        center: [23.128806, 75.63022],
        zoom: 12,
        zoomControl: true,
      });
    }

    const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      minZoom: 5,
    });

    tiles.addTo(this.map);
    for (const e of this.events) {
      const popup = L.DomUtil.create('div', 'infoWindow');
      popup.innerHTML = `<div style="width:max-content;display:flex;flex-direction:column;justify-content:center;gap:10px;padding-top:20px;"><img width="150px" height="200px" style="object-fit:cover;" src="${e.banner}"><center style="font-size:1rem;"> ${e.name} </center></div>`;
      const marker = new L.Marker(e.location);
      marker.bindPopup(popup);
      L.DomEvent.addListener(popup, 'click', () => {
        this.onPopupClick(e.creatorPlayerID);
      });
      marker.addTo(this.map);
    }
    setTimeout(() => {
      this.map.invalidateSize();
    }, 500);
  }
}
