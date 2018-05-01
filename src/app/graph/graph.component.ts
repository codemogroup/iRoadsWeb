import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { GraphService } from '../graph.service';

import { D3Service, D3, Selection } from 'd3-ng2-service'; 

@Component({
	selector: 'app-graph',
	templateUrl: './graph.component.html',
	styleUrls: ['./graph.component.css',
		'/graph.component.nvd3.css'
	],
	encapsulation: ViewEncapsulation.None
})

export class GraphComponent implements OnInit {

	options;
	data: Object;
	d3: D3;
	constructor(private graphDataService: GraphService) { }

	ngOnInit() {
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
				duration: 50,
				xAxis: {
					axisLabel: 'Time',
					tickFormat: function(d) {
						return d3.format(',f')(d);
					}
				},
				x2Axis: {
					tickFormat: function(d) {
						return d3.format(',f')(d);
					}
				},
				yAxis: {
					axisLabel: 'ms-2',
					tickFormat: function(d) {
						return d3.format(',.2f')(d);
					},
					rotateYLabel: false
				},
				y2Axis: {
					tickFormat: function(d) {
						return d3.format(',.2f')(d);
					}
				}

			}
		};


		this.getData();
	}

	getData(): void {
		this.graphDataService.getAllData()
			.subscribe(data => {
				this.data = data;
		});
	}
}
