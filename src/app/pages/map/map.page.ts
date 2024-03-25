import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { Event } from 'src/app/core/models/event.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterViewInit {
  events: Event[] = [];

  private map: L.Map;

  constructor(
    private router: Router,
    private eventService: EventService,
    private route: ActivatedRoute,
  ) {
    const iconUrl = 'assets/marker-icon-2x.png';
    const shadowUrl = 'assets/marker-shadow.png';

    // L.icon() is a method provided by Leaflet to create a new icon object for markers
    const iconDefault = L.icon({
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });

    // This line sets the default icon for all new marker instances
    L.Marker.prototype.options.icon = iconDefault;
  }

  get latitude(): string {
    return this.route.snapshot.queryParams.lat as string;
  }

  get longitude(): string {
    return this.route.snapshot.queryParams.long as string;
  }

  async ngAfterViewInit(): Promise<void> {
    this.eventService.getAllEvents().subscribe((events) => {
      this.events = events;
      this.initMap();
    });
  }

  ionViewWillEnter(): void {
    if (this.map && this.latitude && this.longitude) {
      const lat = parseFloat(this.latitude);
      const long = parseFloat(this.longitude);

      // Pans the map to the given center
      this.map.panTo([lat, long]);
    }
  }

  private onPopupClick(e: Event): void {
    const eventId = `${e.creatorUserID}-${e.name}-${e.description}`;

    this.router.navigateByUrl('tabs/event/' + eventId, {
      replaceUrl: true,
    });
  }

  getEventDetailsHTML(event: Event): string {
    return `
      <div
        style="width: max-content;display:flex;flex-direction:column;justify-content:center;gap:10px;padding-top:20px;">
        <img 
          width="150px" height="200px" 
          style="object-fit:cover;" 
          src="${event.banner}">
          <center style="font-size:1rem;"> 
            ${event.name} 
          </center>
      </div>
    `;
  }

  private initMap(): void {
    this.map = L.map('map', {
      // Uses HTML5 Canvas to render map layers and features.
      renderer: L.canvas(),
      // If latitude and longitude are provided, the map will be centered on those coordinates
      center: this.latitude ? [parseFloat(this.latitude), parseFloat(this.longitude)] : [22.7196, 75.8577],
      zoom: this.latitude ? 15 : 12,
      zoomControl: true,
    });

    const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      minZoom: 5,
    });

    tiles.addTo(this.map);

    for (const e of this.events) {
      const popup = L.DomUtil.create('div');
      popup.innerHTML = this.getEventDetailsHTML(e);
      const marker = new L.Marker(e.location as L.LatLngExpression);
      marker.bindPopup(popup);
      L.DomEvent.addListener(popup, 'click', () => {
        this.onPopupClick(e);
      });
      marker.addTo(this.map);
    }
  }
}
