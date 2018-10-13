import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { SummaryObj } from '../entities/summary-obj';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  public summary:any;

  constructor(private dashboardService:DashboardService) { }

  ngOnInit() {
    this.getSummary();
    this.summary=new SummaryObj();
  }


  getSummary(){
    this.dashboardService.getSummary()
      .subscribe(data => {
        this.summary=data;
        console.log(data);
    });
  }

}
