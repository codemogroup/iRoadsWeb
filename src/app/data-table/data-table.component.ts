import { Component, OnInit} from '@angular/core';

import { DataItem } from '../entities/data-item';
import { DataItemService } from '../services/data-item.service';



@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {

  dataItems: DataItem[];
  loading;
  nodata;

  constructor(private dataItemService: DataItemService) {
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

