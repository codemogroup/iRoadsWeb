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
    var mymap = L.map('mapid').setView([6.799212, 79.901183], 15);
    
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiY29kZW1vIiwiYSI6ImNqaWFuNDh2aTE5M2Mza3J4YWd6MWoxNmwifQ.Dp5h88FvHAfAHaSRl508jQ'
    }).addTo(mymap);

    var marker = L.marker([6.799212, 79.901183]).addTo(mymap);
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

    var popup = L.popup();

    function onMapClick(e) {
      popup
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(mymap);
    }

    mymap.on('click', onMapClick);

    var latlngs = [
      [6.794484, 79.901834],
      [6.797467, 79.888659],
      [6.790649, 79.886084]
    ];

    var polyline = L.polyline(latlngs, {color: 'red'}).addTo(mymap);
    mymap.fitBounds(polyline.getBounds());

  }

}
