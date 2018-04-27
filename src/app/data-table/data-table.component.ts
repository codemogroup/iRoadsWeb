import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';
import { DatePipe } from '@angular/common';

import { DataItem } from '../data-item';
import { DataItemService } from '../data-item.service';
import { AfterContentInit } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {

  dataItems: DataItem[];
  loading;
  nodata;

  constructor(private dataItemService: DataItemService, private router: Router) {
    this.nodata = true;
    this.loading = false;
  }

  ngOnInit() {
    // this.getAllData();
  }

  getAllData(): void {
    if (!this.loading) {
      this.loading = true;
      this.dataItemService.getAllData()
        .subscribe(dataItems => {
          this.dataItems = dataItems;
          this.loading = false;
          this.nodata = false;
        });
    }
  }

  clearData(): void {
    this.dataItems = null;
    this.nodata = true;
  }
}

