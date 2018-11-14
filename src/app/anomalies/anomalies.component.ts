import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { MapService } from '../services/map.service';
import { UploadService } from '../services/upload.service';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { TaggedDataWithName } from '../entities/tagged-data-with-name';
import { TaggedPoint } from '../entities/tagged-point';
import { ColorRange } from '../entities/color-range';

declare let L: any;


@Component({
  selector: 'app-anomalies',
  templateUrl: './anomalies.component.html',
  styleUrls: ['./anomalies.component.css']
})


export class AnomaliesComponent implements OnInit, AfterViewInit {



  public predictedData: Object[];

  public predictedDataShowning: Object[];

  public taggedData: any;
  public taggedDataWithNames: TaggedDataWithName[];
  
  public taggedDataShowing: any;

  public predictedCheckBox: boolean;
  public taggedCheckBox: boolean;

  public allTags: TaggedPoint[];

  loadingPredictionGroups;
  groupIds: Object[];


  selectedGroupId;
  loadingAnomalyData;

  polyline;
  mymap;

  enableAutoFocus = true;
  allcheckboxes;

  featureGroups: any[] = new Array;

  public taggedGroup;


  public predictionGroup;

  constructor(private mapService: MapService, private elementRef: ElementRef, private uploadService: UploadService) {

  }

  ngOnInit() {
    this.getGroupIds();
    // this.getTaggedData();
    this.getTaggedDataWithNames();

    

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
    console.log('selected group ID = ' + this.selectedGroupId);

    this.removeAllLayers();

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
        this.predictedDataShowning = this.predictedData;
      });
  }

  getTaggedData() {
    this.mapService.getTaggedData()
      .subscribe(data => {
        this.taggedData = data;
        this.loadingAnomalyData = false;
        this.clearAll();
      });
  }

  getTaggedDataWithNames() {
    this.mapService.getTaggedDataWithNames()
      .subscribe(data => {
        this.taggedDataWithNames = data;
        this.loadingAnomalyData = false;
        this.clearAll();
      });
  }



  //all tags

  taggedAllChanged(event) {
    console.log("...came...")
    var checked = event.target.checked;
    if (checked) { //add markers
      if (this.taggedGroup) {
        this.removeLayerFromMap(this.taggedGroup);
      }
      this.taggedGroup = L.featureGroup();

      if (!this.allTags) {
        this.allTags = new Array;
        this.taggedDataWithNames.forEach(element => {
          element.tags.forEach(tagPoint => {
            this.allTags.push(tagPoint);
          });
        });
      }
      this.taggedGroup = this.addPointsToLayer(this.allTags, this.taggedGroup, 'blue');
      this.addLayerToMap(this.taggedGroup);

    } else { //remove markers

      this.removeLayerFromMap(this.taggedGroup);
    }
  }


  taggedColors=["#00FF00","#0000FF","	#FFFF00","#00FFFF","#FF00FF","#808080","#808000","#008080","#D2691E","#2F4F4F"];

  taggedList={};

  taggedDataWithNamesChanged(event, i) {
    var checked = event.target.checked;
    if (checked) {
      // if (this.taggedGroup) {
      //   this.removeLayerFromMap(this.taggedGroup);
      // }
      this.taggedGroup = L.featureGroup();

      this.taggedGroup = this.addPointsToLayer(this.taggedDataWithNames[i].tags, this.taggedGroup, this.taggedColors[i]);
      this.taggedList[i]=this.taggedGroup;
      this.addLayerToMap(this.taggedGroup);

    }else{
      this.removeLayerFromMap(this.taggedList[i]);
    }
  }

  predictedRadioChanged(event, i) {
    var checked = event.target.checked;
    if (checked) {
      if (this.predictedDataShowning) {
        this.predictedDataShowning = this.predictedData;
      }
      if (this.predictionGroup) {
        this.removeLayerFromMap(this.predictionGroup);
      }
      this.predictionGroup = L.featureGroup();
      var data = this.predictedDataShowning[i]['data'];
      this.predictionGroup = this.addPointsToLayer(data, this.predictionGroup, 'red');
      this.addLayerToMap(this.predictionGroup);

    }
  }
  // predictedCheckBoxChanged(event, index) {
  //   var checked = event.target.checked;
  //   if (checked) { //check true

  //     if (this.predictedDataShowning) {
  //       this.predictedDataShowning = this.predictedData;
  //     }

  //     if (this.featureGroups[index]) {//there is the layerGroup
  //       var layerGroup = this.featureGroups[index]; //get layer from dictionary
  //       this.addLayerToMap(layerGroup);

  //     } else {//there is no layer for index
  //       var data = this.predictedDataShowning[index]['data'];
  //       var layerGroup = L.featureGroup();
  //       layerGroup = this.addPointsToLayer(data, layerGroup, 'red')//adding points to layerGroup

  //       this.featureGroups[index] = layerGroup; //add to dictionary
  //       this.addLayerToMap(layerGroup);
  //     }
  //   } else { //check false need to remove
  //     var layerGroup = this.featureGroups[index]; //get layer from dictionary
  //     this.removeLayerFromMap(layerGroup);
  //   }
  // }

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

  removeAllLayers() {
    if (this.predictionGroup) {
      this.mymap.removeLayer(this.predictionGroup)
    }
    if (this.taggedGroup) {
      this.mymap.removeLayer(this.taggedGroup)
    }
  }

  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  taggedcheckbox;

  clearAll() {
    this.removeAllLayers();
    // if (this.taggedList) {
    //   this.mymap.removeLayer(this.taggedGroup)
    // }

    for (var i in this.taggedList) {
      if (this.taggedList.hasOwnProperty(i)) {
        this.removeLayerFromMap(this.taggedList[i]);
      }
    }

    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });

    this.taggedcheckbox = false;

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
