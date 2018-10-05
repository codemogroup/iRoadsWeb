import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NvD3Module } from 'ng2-nvd3';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgxSelectModule  } from 'ngx-select-ex';

import { AppComponent } from './app.component';
import { DataTableComponent } from './data-table/data-table.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DataItemService } from './data-item.service';
import { GraphService } from './graph.service';
import { CustomReuseStrategy } from './custom-reuse-strategy';
import { GraphComponent } from './graph/graph.component';
import { MapComponent } from './map/map.component';
import { MapService } from './map.service';

// d3 and nvd3 should be included somewhere
import 'd3';
import 'nvd3';
import { GlobalSharingService } from './global-sharing.service';
import { DashboardService } from './dashboard.service';
import { PredictedMapComponent } from './predicted-map/predicted-map.component';


const appRoutes: Routes = [
  { path: 'seeAllData', component: DataTableComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'graph', component: GraphComponent },
  { path: 'journeyMap', component: MapComponent },
  { path: 'predictedMap', component: PredictedMapComponent },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];



@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent,
    DashboardComponent,
    PageNotFoundComponent,
    GraphComponent,
    MapComponent,
    PredictedMapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NvD3Module,
    HttpClientModule,
    HttpModule,
    NgxSelectModule,
    RouterModule.forRoot(
      appRoutes,
      { useHash: true }
    )
  ],
  providers: [
    // D3Service,
    DataItemService,
    GraphService,
    MapService,
    DashboardService,
    GlobalSharingService,
    DatePipe,
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
