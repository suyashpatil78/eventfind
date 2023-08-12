import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventpagePageRoutingModule } from './eventpage-routing.module';

import { EventpagePage } from './eventpage.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, EventpagePageRoutingModule],
  declarations: [EventpagePage],
})
export class EventpagePageModule {}
