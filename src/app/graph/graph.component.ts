import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { GraphService } from '../graph.service';
import { empty } from 'rxjs/Observer';
import { Journey } from '../journey';
import { DatePipe } from '@angular/common';
import {NgSelectizeModule} from 'ng-selectize';

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

    constructor(private graphDataService: GraphService) {
        this.loadingGraphData = false;
        this.noGraphData = true;

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
