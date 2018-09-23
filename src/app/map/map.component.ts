import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
declare let L: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public options;
  public locationData: Object;

  public journeyIDs: Object[];
  public selectedID;

  loadingIDs;
  loadingLocationData;
  noLocationData;

  polyline;
  mymap;

  constructor(private mapService: MapService) { 

  }

  ngOnInit() {

    this.getJourneyIDs();
    this.selectedID = 'select';

    this.configureMap();
  }


  selectID(): void {
    console.log('selected journey ID = ' + this.selectedID);
    if (this.selectedID === 'select') {
        this.locationData = null;
    } else {
        this.loadingLocationData = true;
        this.noLocationData = true;
        this.getGraphData(this.selectedID);
    }

}


getJourneyIDs(): void {
    this.loadingIDs = true;
    this.mapService.getJourneyIDs()
        .subscribe(data => {
            this.journeyIDs = data;
            this.loadingIDs = false;
        });
}

refreshIDs(): void {
  this.getJourneyIDs();
}

getGraphData(journeyID): void {
  this.mapService.getLocationData(journeyID)
      .subscribe(data => {
          this.locationData = data;
          this.loadingLocationData = false;
          this.noLocationData = false;
          this.addLocationsToMap();
      });
}

addLocationsToMap():void{
  this.polyline = L.polyline(this.locationData, {color: 'red'}).addTo(this.mymap);
  this.mymap.fitBounds(this.polyline.getBounds());
}



onMapClick(e):void{
  console.log("clicked"+e);
  var popup = L.popup();
  popup.setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString())
      .openOn(this.mymap);
}
configureMap():void{
  this.mymap = L.map('mapid').setView([6.799212, 79.901183], 15);
  
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiY29kZW1vIiwiYSI6ImNqaWFuNDh2aTE5M2Mza3J4YWd6MWoxNmwifQ.Dp5h88FvHAfAHaSRl508jQ'
  }).addTo( this.mymap);

  var marker = L.marker([6.799212, 79.901183]).addTo( this.mymap);
  marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();


  var map=this.mymap;
  
  this.mymap.on('click', function(e){
    var popup = L.popup();
    popup.setLatLng(e.latlng)
      .setContent(e.latlng.toString())
      .openOn(map);
  });

  // this.locationData = [
  //   [6.794484, 79.901834],
  //   [6.797467, 79.888659],
  //   [6.790649, 79.886084]
  // ];
  // this.locationData=[{
  //     lon: "79.901834",
  //     lat: "6.794484"
  //   },
  //   {
  //     lon:"79.888659",
  //     lat: "6.797467"
  //   },
  //   {
  //     lon: "79.886084",
  //     lat: "6.790649"
  //   }];

  // this.polyline = L.polyline(this.locationData, {color: 'red'}).addTo( this.mymap);
  // this.mymap.fitBounds(this.polyline.getBounds());
}
// selectize js
placeholder: string = 'Select a journey...';
config = {
    labelField: 'journeyName',
    valueField: 'journeyID',
    highlight: true,
    create:false,
    persist:true,
    searchField:'journeyName',
    dropdownDirection: 'down',
    maxItems: 1,
    render: {
        option: function(item, escape) {
            var date= new Date(item.syncTime);
            var min= date.getMinutes()<10 ? "0"+date.getMinutes() :date.getMinutes();
            var hours= date.getHours()<10 ? "0"+date.getHours() :date.getHours();
            var formatDate=date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()+" "+hours+":"+min;
            return '<div style="padding:10px">'+'<span class="title">' +
                        '<span class="name">' + escape(item.journeyName) + '</span>' +
                    '</span>' +
                    '<span style="float:right; color:#808080">' + escape(formatDate) + '</span>'+
                    '</div>';
        }
    }

};

}
