import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapService } from './map.service';
import { DataItemService } from './data-item.service';
import { GraphService } from './graph.service';
import { DashboardService } from './dashboard.service';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers:[
    MapService,
    DataItemService,
    GraphService,
    DashboardService
  ]
})
export class ServicesModule { }
