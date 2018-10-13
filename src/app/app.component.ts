import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit  {
  ngOnInit(): void {
    // let menuToggleBtn=document.getElementById('toggleMenuButtonNav') as HTMLElement;
    // menuToggleBtn.click();
  }
  ngAfterViewInit(): void {
    // toggleMenuButtonNav
    
  }
  title = 'iRoads';


}
