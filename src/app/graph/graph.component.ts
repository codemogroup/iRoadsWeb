import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { GraphService } from '../graph.service';


declare let d3:any;


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
	public data: Object;
	constructor(private graphDataService: GraphService) {
	}

	ngOnInit() {
		
		this.options = {
			chart: {
                type: 'lineWithFocusChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 40
                },
                transitionDuration: 500,
                xAxis: {
                    axisLabel: '(time s)',
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    }
                },
                x2Axis: {
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    }
                },
                yAxis: {
                    axisLabel: '(ms-2)',
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    },
                    rotateYLabel: false
                },
                y2Axis: {
                    tickFormat: function(d){
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
