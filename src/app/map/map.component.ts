import { Component, OnInit } from '@angular/core';
declare let L: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var mymap = L.map('mapid').setView([51.505, -0.09], 13);
    var marker = L.marker([51.5, -0.09]).addTo(mymap);
  }

}
