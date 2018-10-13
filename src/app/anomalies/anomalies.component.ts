import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { MapService } from '../services/map.service';
import { UploadService } from '../services/upload.service';
import { UiSwitchModule } from 'ngx-toggle-switch';

declare let L: any;


@Component({
  selector: 'app-anomalies',
  templateUrl: './anomalies.component.html',
  styleUrls: ['./anomalies.component.css']
})


export class AnomaliesComponent implements OnInit, AfterViewInit {



  public predictedData: Object[];

  public taggedData: any;
  public taggedDataShowing: any;

  public predictedCheckBox: boolean;
  public taggedCheckBox: boolean;


  loadingPredictionGroups;
  groupIds: Object[];


  selectedGroupId;
  loadingAnomalyData;

  polyline;
  mymap;

  enableAutoFocus=true;

  feathureGroups = new Object();

  public taggedGroup;

  constructor(private mapService: MapService, private elementRef: ElementRef, private uploadService: UploadService) {

  }

  ngOnInit() {
    this.getGroupIds();
    this.getTaggedData();

  }

  ngAfterViewInit(): void {
    this.configureMap();

  }

  configureMap(): void {
    this.mymap = L.map('mapid', { preferCanvas: true }).setView([6.799212, 79.901183], 15);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: '',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiY29kZW1vIiwiYSI6ImNqaWFuNDh2aTE5M2Mza3J4YWd6MWoxNmwifQ.Dp5h88FvHAfAHaSRl508jQ'
    }).addTo(this.mymap);

    var map = this.mymap;

    var element_ref = this.elementRef;
    this.mymap.on('click', function (e) {
      var popup = L.popup();
      var content =
        '<div style="overflow:hidden">' + e.latlng.lat + "," + e.latlng.lng + '<br>'
        + '<div class="">'
        + '<button style="float:left" class="startpointbutton btn .btn-success" data_piont="' + e.latlng.lat + "," + e.latlng.lng + '">'
        + 'start point</button>'
        + '<button style="float:right" class="endpointbutton btn" data_piont="' + e.latlng.lat + "," + e.latlng.lng + '">'
        + 'end point</button>'
        + '</div>'
        + '<div/>';
      popup.setLatLng(e.latlng)
        .setContent(content)
        .openOn(map);
      // add event listener to newly added a.merch-link element
      var startpointbutton = element_ref.nativeElement.querySelector(".startpointbutton");
      if (startpointbutton) {
        startpointbutton.addEventListener('click', (e) => {

          // get id from attribute
          var data_point = e.target.getAttribute("data_piont");

          console.log("start clicked" + data_point);

          map.closePopup();
        });
      }
      var endpointbutton = element_ref.nativeElement.querySelector(".endpointbutton");
      if (endpointbutton) {
        endpointbutton.addEventListener('click', (e) => {

          // get id from attribute
          var data_point = e.target.getAttribute("data_piont");

          console.log("end clicked" + data_point);

          map.closePopup();
        });
      }

    });

  }

  refreshIDs(): void {
    this.getGroupIds();
  }

  getGroupIds(): void {
    this.loadingPredictionGroups = true;
    this.uploadService.getGroups()
      .subscribe(data => {
        this.groupIds = data;
        this.loadingPredictionGroups = false;
      });
  }

  selectGroupId() {
    console.log('selected journey ID = ' + this.selectedGroupId);
    if (this.selectedGroupId === 'select') {
      this.selectedGroupId = null;
    } else {
      this.loadingAnomalyData = true;
      this.getPredictionData(this.selectedGroupId);
    }
  }

  getPredictionData(selectedGroupId) {
    this.getPredictedData(selectedGroupId);
  }

  getPredictedData(groupId) {
    this.mapService.getPredictedData(groupId)
      .subscribe(data => {
        this.predictedData = data;
        this.loadingAnomalyData = false;
      });
  }

  getTaggedData() {
    this.mapService.getTaggedData()
      .subscribe(data => {
        this.taggedData = data;
        this.loadingAnomalyData = false;
      });
  }


  taggedCheckBoxChanged(event) {
    var checked = event.target.checked;
    if (checked) { //add markers
      if (this.taggedGroup) {
        this.addLayerToMap(this.taggedGroup);
      } else {
        this.taggedGroup = L.featureGroup();

        this.taggedGroup = this.addPointsToLayer(this.taggedData, this.taggedGroup, 'blue');
        this.addLayerToMap(this.taggedGroup);
      }
    } else { //remove markers

      this.removeLayerFromMap(this.taggedGroup);
    }
  }


  predictedCheckBoxChanged(event, index) {
    var checked = event.target.checked;
    if (checked) { //check true
      if (this.feathureGroups[index]) {//there is the layerGroup
        var layerGroup = this.feathureGroups[index]; //get layer from dictionary
        this.addLayerToMap(layerGroup);
      } else {//there is no layer for index
        var data = this.predictedData[index]['data'];
        var layerGroup = L.featureGroup();
        layerGroup = this.addPointsToLayer(data, layerGroup, 'red')//adding points to layerGroup

        this.feathureGroups[index] = layerGroup; //add to dictionary
        this.addLayerToMap(layerGroup);
      }
    } else { //check false need to remove
      var layerGroup = this.feathureGroups[index]; //get layer from dictionary
      this.removeLayerFromMap(layerGroup);
    }
  }

  addPointsToLayer(data, layerGroup, markerColor) {
    data.forEach(element => {
      var circle = L.circle([element.lat, element.lon], {
        radius: 10,
        color: markerColor,
        transparency: 'true',
        opacity: (0.5)
      }).bindPopup("<b>Anomaly at (" + element.lat + "," + element.lon + ")</b>");
      layerGroup.addLayer(circle);
    });
    return layerGroup;
  }


  addLayerToMap(layerGroup) {
    layerGroup.addTo(this.mymap);
    if (this.enableAutoFocus) {
      this.mymap.fitBounds(layerGroup.getBounds());
    }
  }

  removeLayerFromMap(layerGroup) {
    this.mymap.removeLayer(layerGroup)
  }



  // id selection box
  // selectize js
  placeholder: string = 'Select a journey...';
  config = {
    labelField: 'predictionGroup',
    valueField: 'predictionGroup',
    highlight: true,
    create: false,
    persist: true,
    searchField: 'predictionGroup',
    dropdownDirection: 'down',
    maxItems: 1,
    render: {
      option: function (item, escape) {
        return '<div style="">' +
          '<span class="name">' + escape(item.predictionGroup) + '</span>' + '<br>' +
          '</div>';
      }
    }

  };

}
