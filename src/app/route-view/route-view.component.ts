import { Component, OnInit, AfterViewInit } from '@angular/core';

declare let L: any;
@Component({
  selector: 'app-route-view',
  templateUrl: './route-view.component.html',
  styleUrls: ['./route-view.component.css']
})
export class RouteViewComponent implements OnInit {

  mymap;

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {

    this.configureMap();

  }

  configureMap(): void {
    this.mymap = L.map('map_id', { preferCanvas: true }).setView([6.799212, 79.901183], 15);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: '',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiY29kZW1vIiwiYSI6ImNqaWFuNDh2aTE5M2Mza3J4YWd6MWoxNmwifQ.Dp5h88FvHAfAHaSRl508jQ'
    }).addTo(this.mymap);

    var control = L.Routing.control({
        router: L.routing.mapbox('pk.eyJ1IjoiY29kZW1vIiwiYSI6ImNqaWFuNDh2aTE5M2Mza3J4YWd6MWoxNmwifQ.Dp5h88FvHAfAHaSRl508jQ'),
        waypoints: [
            L.latLng(7.008838, 79.965075),
            L.latLng(6.096558,80.2183068)
        ],
        routeWhileDragging: true

    }).addTo(this.mymap);

  }


}
