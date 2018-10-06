import { Component, OnInit } from '@angular/core';
import { MapService } from '../services/map.service';

declare let L: any;


@Component({
  selector: 'app-anomalies',
  templateUrl: './anomalies.component.html',
  styleUrls: ['./anomalies.component.css']
})


export class AnomaliesComponent implements OnInit {


  public predictedData: any;
  public predictedDataShowing: any;


  public taggedData: any;
  public taggedDataShowing: any;

  public predictedCheckBox: boolean;
  public taggedCheckBox: boolean;

  loadingAnomalyData;

  polyline;
  mymap;

  public predictedGroup = L.featureGroup();
  public taggedGroup = L.featureGroup();



  constructor(private mapService: MapService) {

  }

  ngOnInit() {

    this.predictedDataShowing=null;
    this.predictedCheckBox = false;
    this.taggedCheckBox = false;
    this.getPredictedData();

    this.configureMap();
    this.getTaggedData();

  }

  configureMap(): void {
    this.mymap = L.map('mapid', { preferCanvas: true }).setView([6.799212, 79.901183], 15);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiY29kZW1vIiwiYSI6ImNqaWFuNDh2aTE5M2Mza3J4YWd6MWoxNmwifQ.Dp5h88FvHAfAHaSRl508jQ'
    }).addTo(this.mymap);

    var map = this.mymap;
    this.mymap.on('click', function (e) {
      var popup = L.popup();
      popup.setLatLng(e.latlng)
        .setContent(e.latlng.lat + "," + e.latlng.lng)
        .openOn(map);
    });

  }


  refreshPredictedLayerGroup(){
    this.addAllMarkersToPredictedGroup();
    this.predictedGroup.addTo(this.mymap);
    if (this.predictedDataShowing!=null) {
      this.mymap.fitBounds(this.predictedGroup.getBounds());
    }
  }

  addAllMarkersToPredictedGroup() {
    if (this.predictedDataShowing != null) {
      this.predictedDataShowing.forEach(element => {
        var circle = L.circle([element.lat, element.lon], {
          radius: 10,
          color: 'red',
          transparency: 'true',
          opacity:(0.5)
        }).bindPopup("<b>Anomaly at (" + element.lat + "," + element.lon + ")</b>");
        this.predictedGroup.addLayer(circle);
      });
    }else{
      this.predictedGroup.clearLayers();
    }
  }

 
  refreshTaggedLayerGroup(){
    this.addAllMarkersToTaggedGroup();
    this.taggedGroup.addTo(this.mymap);
    if (this.taggedDataShowing!=null) {
      this.mymap.fitBounds(this.taggedGroup.getBounds());
    }
  }

  addAllMarkersToTaggedGroup() {
    if (this.taggedDataShowing != null) {
      this.taggedDataShowing.forEach(element => {
        var circle = L.circle([element.lat, element.lon], {
          radius: 10,
          color: 'blue',
          transparency: 'true',
          opacity:(0.5)
        }).bindPopup("<b>Anomaly at (" + element.lat + "," + element.lon + ")</b>");
        this.taggedGroup.addLayer(circle);
      });
    }else{
      this.taggedGroup.clearLayers();
    }
  }


  taggedCheckBoxChanged() {
    this.taggedGroup.clearLayers();
    this.taggedCheckBox = !this.taggedCheckBox;

    if (this.taggedCheckBox == true) {
      this.taggedDataShowing=this.taggedData;
      this.refreshTaggedLayerGroup()
    }else{
      this.taggedDataShowing=null;
    }

  }

  predictedCheckBoxChanged() {
    this.predictedGroup.clearLayers();
    this.predictedCheckBox = !this.predictedCheckBox;
    if (this.predictedCheckBox == true) {
      this.predictedDataShowing = this.predictedData;
      this.refreshPredictedLayerGroup();
    }else{
      this.predictedDataShowing=null;
    }
  }


  getPredictedData() {
    this.mapService.getPredictedData()
      .subscribe(data => {
        this.predictedData = data;
        this.loadingAnomalyData = false;
        this.refreshPredictedLayerGroup()
      });
  }

  getTaggedData() {
    this.mapService.getTaggedData()
      .subscribe(data => {
        this.taggedData = data;
        this.loadingAnomalyData = false;
        this.refreshTaggedLayerGroup()
      });
  }

}
