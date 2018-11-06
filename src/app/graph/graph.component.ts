import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

import { GraphService } from '../services/graph.service';
import { Journey } from '../entities/journey';

declare let d3: any;
declare let L: any;


@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: [
        './graph.component.css',
        // './../../assets/nv.d3.min.css',
        './../../../node_modules/nvd3/build/nv.d3.min.css'
    ],
    encapsulation: ViewEncapsulation.None
})

export class GraphComponent implements OnInit {

    public options;
    public graphData: Object[];

    public graphDataPart: any;
    public dataItemDensityOfPart:number;
    public graphDataPartObj:any;

    private part: number;
    private partLimit: number;
    public disablePrevious: boolean;
    public disableNext: boolean;

    public graphPart: string;
    private noOfParts: number;

    public journeyIDs: Journey[];
    public selectedID;

    loadingIDs;
    loadingGraphData;
    noGraphData;
    loaded;


    polyline;
    mymap;

    public selectControl = new FormControl();

    constructor(private graphDataService: GraphService) {

        this.disablePrevious = true;
        this.disableNext = true;

        this.part = 0;
        this.partLimit = 1000000;
        this.loadingGraphData = false;
        this.noGraphData = true;

        this.selectControl.valueChanges.subscribe(value => console.log(value));


    }

    ngOnInit() {
        this.getJourneyIDs();
        this.setGraphConfig();
        this.selectedID = 'select';
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

    addLocationsToMap(): void {
        if (this.polyline) {
            this.mymap.removeLayer(this.polyline);
        }
        this.polyline = L.polyline(this.graphDataPartObj.gps, {

            color: 'blue',
            weight: 7,
            opacity: 0.5,
            smoothFactor: 1,

        })
            .addTo(this.mymap);
        this.mymap.fitBounds(this.polyline.getBounds());
        var map = this.mymap;

        // this.polyline.on('click', (e) => this.addClickablePopup(e));
    }

    selectID(): void {
        console.log('selected journey ID = ' + this.selectedID);
        if (this.selectedID === 'select') {
            this.graphData = null;
        } else {
            this.loadingGraphData = true;
            this.noGraphData = true;
            this.getGraphData(this.selectedID);
        }

    }

    getJourneyIDs(): void {
        this.loadingIDs = true;
        this.graphDataService.getJourneyIDs()
            .subscribe(data => {
                this.journeyIDs = data;
                this.loadingIDs = false;
            });
    }

    refreshIDs(): void {
        this.getJourneyIDs();
    }

    getGraphData(journeyID): void {
        this.graphDataService.getGraphData(journeyID)
            .subscribe(data => {
                console.log(data.length)
                this.noOfParts = data.length;

                this.part = 0;
                this.disableNext = false;
                this.disablePrevious = true;

                this.loaded = true;

                this.graphData = data;
                this.loadingGraphData = false;
                this.noGraphData = false;
                this.loadGraphPartByPart();
                this.graphPart = this.part + 1 + "/" + this.noOfParts;

                if (this.noOfParts == 1) {
                    this.disableNext=true;
                    this.disablePrevious=true;
                }
            });

    }

    nextPart() {
        this.part++;
        this.loadGraphPartByPart();
        if (this.part > 0) {
            this.disablePrevious = false;
        }
        if (this.graphData.length == this.part + 1) {
            this.disableNext = true;
        }
        this.graphPart = this.part + 1 + "/" + this.noOfParts;
        console.log("part:" + this.part)
    }

    previousPart() {
        if (this.part > 0) {
            this.part--;
            this.loadGraphPartByPart()
            this.disableNext = false;
            if (this.part == 0) {
                this.disablePrevious = true;
            }
        } else {
            this.disablePrevious = true;
        }
        this.graphPart = this.part + 1 + "/" + this.noOfParts;
        console.log("part:" + this.part)
    }

    loadGraphPartByPart() {
        this.graphDataPartObj = this.graphData[this.part];
        this.graphDataPart = this.graphDataPartObj.values;
        this.dataItemDensityOfPart= this.graphDataPartObj.dataItemDensity;
        console.log("part length:"+this.dataItemDensityOfPart);
        this.setGraphConfig();
        this.addLocationsToMap();
    }



    setGraphConfig() {
        this.options = {
            chart: {
                type: 'lineWithFocusChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 40
                },
                transitionDuration: 500,
                xAxis: {
                    axisLabel: 'time (s)',
                    tickFormat: function (d) {
                        return d3.format(',f')(d/1000);
                    }
                },
                x2Axis: {
                    tickFormat: function (d) {
                        return d3.format(',f')(d/1000);
                    }
                },
                yAxis: {
                    axisLabel: '(ms-2)',
                    tickFormat: function (d) {
                        return d3.format(',.2f')(d);
                    },
                    rotateYLabel: false
                },
                y2Axis: {
                    tickFormat: function (d) {
                        return d3.format(',.2f')(d);
                    }
                }

            }
        };
    }


    getSelectionDate(option: Journey) {
        var date = new Date(option.syncTime);
        var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var monthWithout0strt = date.getMonth() + 1;
        var formatDate = date.getDate() + "/" + monthWithout0strt + "/" + date.getFullYear() + " " + hours + ":" + min;
        return formatDate;
    }


}
