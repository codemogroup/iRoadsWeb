import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NvD3Module } from 'ng2-nvd3';
import {HttpModule} from '@angular/http';

import { AppComponent } from './app.component';
import { DataTableComponent } from './data-table/data-table.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DataItemService } from './data-item.service';
import { GraphService } from './graph.service';
import { CustomReuseStrategy } from './custom-reuse-strategy';
import { GraphComponent } from './graph/graph.component';
import { D3Service } from 'd3-ng2-service';


// d3 and nvd3 should be included somewhere
import 'd3';
import 'nvd3';

const appRoutes: Routes = [
  { path: 'seeAllData', component: DataTableComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'graph', component: GraphComponent },
  { path: '',
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
    GraphComponent
  ],
  imports: [
    BrowserModule,
    NvD3Module,
    HttpClientModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [
  D3Service,
    DataItemService,
    GraphService,
    DatePipe,
    {provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
