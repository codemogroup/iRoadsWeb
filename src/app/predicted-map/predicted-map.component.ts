import { Component, OnInit } from '@angular/core';
import { MapService } from '../services/map.service';

declare let L: any;


@Component({
	selector: 'app-predicted-map',
	templateUrl: './predicted-map.component.html',
	styleUrls: ['./predicted-map.component.css']
})


export class PredictedMapComponent implements OnInit {


	public predictedData:any;

	loadingAnomalyData;

	polyline;
	mymap;

	constructor(private mapService: MapService) {

	}

	ngOnInit() {
		this.getPredictedData();
		
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
				.setContent(e.latlng.lat+","+e.latlng.lng)
				.openOn(map);
		});

		var anomaliesGroup=this.addAllMarkersToGroup().addTo(this.mymap);
		this.mymap.fitBounds(anomaliesGroup.getBounds());
	}

	addAllMarkersToGroup(){
		var group = L.featureGroup();
		this.predictedData.forEach(element => {
			var circle=L.circle([element.lat, element.lon], { 
				radius: 10, 
				color: 'red', 
				fillOpacity: true 
			}).bindPopup("<b>Anomaly at ("+element.lat+","+element.lon+")</b>");
			group.addLayer(circle);
		});

		return group;
	}

	getPredictedData(){
		this.mapService.getPredictedData()
		.subscribe(data => {
			this.predictedData = data;
				this.loadingAnomalyData = false;
				this.configureMap();
		});
	}

}
