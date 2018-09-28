import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormControl} from '@angular/forms';

import { GraphService } from '../graph.service';
import { empty } from 'rxjs/Observer';
import { Journey } from '../journey';
import { DatePipe } from '@angular/common';

declare let d3: any;


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
    public graphData: Object;

    public journeyIDs: Journey[];
    public selectedID;

    loadingIDs;
    loadingGraphData;
    noGraphData;
    public selectControl = new FormControl();

    constructor(private graphDataService: GraphService) {
        this.loadingGraphData = false;
        this.noGraphData = true;

        this.selectControl.valueChanges.subscribe(value => console.log(value));


    }

    ngOnInit() {
        this.getJourneyIDs();
        this.setGraphConfig();
        this.selectedID = 'select';
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
                this.graphData = data;
                this.loadingGraphData = false;
                this.noGraphData = false;
                this.setGraphConfig();
            });

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
                    axisLabel: 'time (ms)',
                    tickFormat: function (d) {
                        return d3.format(',f')(d);
                    }
                },
                x2Axis: {
                    tickFormat: function (d) {
                        return d3.format(',f')(d);
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
