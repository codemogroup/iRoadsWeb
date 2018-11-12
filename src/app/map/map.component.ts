import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';

import { Journey } from '../entities/journey'
import { MapService } from '../services/map.service';
import { SegmentWrapper } from '../entities/segment-wrapper';
import { ColorCode } from '../entities/color-code';
import { SegmentInfo } from '../entities/segment-info';
import { ColorRange } from '../entities/color-range';

declare let L: any;
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {

    public options;
    public locationData: Object;

    public journeyIDs: Object[];
    public selectedID;
    public colorRanges: ColorRange[];

    loadingIDs;
    loadingData;
    noLocationData;

    polyline;
    mymap;
    segmentLayerGroup;

    segmentData: any;
    loadingSegmentData: boolean;
    noSegmentData: boolean;

    colorCodes: ColorCode[];

    metadata_journey_starttime_full;
    metadata_journey_endtime_full;
    metadata_no_of_segments_full;
    metadata_colorcodes;

    threshold;

    constructor(private mapService: MapService, private elementRef: ElementRef) {
        this.metadata_journey_starttime_full = 0;
        this.metadata_journey_endtime_full = 0;
        this.metadata_no_of_segments_full = "";
        this.metadata_colorcodes = "";

        this.colorCodes = [];
    }

    ngOnInit() {
        this.getJourneyIDs();
        this.selectedID = 'select';
        this.noSegmentData = true;

        // to test only
        // this.addSegmentTest("avgSpeed");
        this.getColorRanges();
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

    selectID(): void {
        console.log('selected journey ID = ' + this.selectedID);
        if (this.selectedID === 'select') {
            this.locationData = null;
        } else {
            this.loadingData = true;
            this.noLocationData = true;
            this.getGpsData(this.selectedID);
        }

    }

    getGpsData(journeyID): void {
        if (this.polyline) {
            this.mymap.removeLayer(this.polyline);
        }
        if (this.segmentLayerGroup) {
            this.mymap.removeLayer(this.segmentLayerGroup);
            this.noSegmentData = true;
            this.segmentData = null;
        }

        this.mapService.getLocationData(journeyID)
            .subscribe(data => {
                this.locationData = data;
                this.loadingData = false;
                this.noLocationData = false;
                this.addLocationsToMap();
            });
    }

    addLocationsToMap(): void {

        this.polyline = L.polyline(this.locationData, {

            color: 'blue',
            weight: 7,
            opacity: 0.5,
            smoothFactor: 1

        })
            .addTo(this.mymap);
        this.mymap.fitBounds(this.polyline.getBounds());
        var map = this.mymap;

        this.polyline.on('click', (e) => this.addClickablePopup(e));
    }

    addClickablePopup(e) {
        var popup = L.popup();
        var content =
            '<div style="overflow:hidden">'
            + '<div class="">'
            + '<div class="row" style="padding:3px;padding-right:17px;">'
            + '<label class=" col-6"><b>Threhold aY</b></label>'
            + '<input id="inputbox" class="inputbox form-control col-6" type="number" placeholder="Threshold" value=0.15>'
            + '<label class=" col-6"><b>Segment size</b></label>'
            + '<select id="segmentSize" class="segmentSize form-control col-6">'
            + '<option value="100">100</option>'
            + '<option value="300">300</option>'
            + '<option value="500">500</option>'
            + '</select>'
            + '</div>'
            + '<button style="" class="startpointbutton btn .btn-success" lat="' + e.latlng.lat + '" lon="' + e.latlng.lng + '">'
            + 'start segmentation from here</button>'
            + '</div>'
            + '<div/>';
        popup.setLatLng(e.latlng)
            .setContent(content)
            .openOn(this.mymap);


        // add event listener to newly added a.merch-link element
        var startpointbutton = this.elementRef.nativeElement.querySelector(".startpointbutton");
        var inputbox = this.elementRef.nativeElement.querySelector(".inputbox");
        var selectbox = this.elementRef.nativeElement.querySelector(".segmentSize");
        if (startpointbutton) {

            startpointbutton.addEventListener('click', (e) => this.segmentRequest(e, inputbox.value, selectbox.value));
        }
    }

    segmentRequest(event, threshold, segmentSize): void {

        // console.log("threshold:" + threshold);
        // console.log("segment size:" + segmentSize);

        // get id from attribute
        var lat = event.target.getAttribute("lat");
        var lon = event.target.getAttribute("lon");

        this.mymap.closePopup();

        this.loadingSegmentData = true;
        this.loadingData = true;

        this.mapService.getJourneySegments(this.selectedID, lat, lon, threshold, segmentSize)
            .subscribe(data => {
                this.loadingData = false;
                this.segmentData = data;

                console.log("segement data" + this.segmentData)

                console.log(this.segmentData.noOfSegments)
                this.loadingSegmentData = false;
                this.noSegmentData = false;
                this.addSegmentsToMap("iri");

                // console.log("max iri:" + this.segmentData.maxIri);
                // console.log("min iri:" + this.segmentData.minIri);

            });
    }

    //to test only
    // addSegmentTest(colorBy) {
    //     this.loadingSegmentData = true;
    //     this.mapService.getJourneySegmentsDummy()
    //         .subscribe(data => {

    //             this.loadingData = false;
    //             this.segmentData = data;

    //             console.log("segement data" + this.segmentData)

    //             console.log(this.segmentData.noOfSegments)
    //             this.loadingSegmentData = false;
    //             this.noSegmentData = false;
    //             this.addSegmentsToMap(colorBy);
    //         });
    // }

    radioBtn(type) {
        switch (type) {
            case "avgSpeed":
                this.addSegmentsToMap("avgSpeed")
                break;
            case "avgAccelY":
                this.addSegmentsToMap("avgAccelY")
                break;
            case "standardDeviationFullMeanAccelY":
                this.addSegmentsToMap("standardDeviationFullMeanAccelY")
                break;
            case "standardDeviationSegmentMeanAccelY":
                this.addSegmentsToMap("standardDeviationSegmentMeanAccelY")
                break;
            case "avgRmsAccel":
                this.addSegmentsToMap("avgRmsAccel")
                break;
            case "thresholdAy":
                this.addSegmentsToMap("thresholdAy")
                break;
            case "iri":
                this.addSegmentsToMap("iri")
                break;
        }
    }



    addSegmentsToMap(colorBy): void {
        if (this.polyline) {
            this.mymap.removeLayer(this.polyline);
        }
        if (this.segmentLayerGroup) {
            this.mymap.removeLayer(this.segmentLayerGroup);
        }
        if (this.colorCodes.length > 0) {
            this.colorCodes = [];
        }


        var segmentData = this.segmentData;

        this.metadata_journey_starttime_full = segmentData.startTime;
        this.metadata_journey_endtime_full = segmentData.endTime;
        this.metadata_no_of_segments_full = segmentData.noOfSegments;


        this.showSegmentsBy(segmentData, colorBy);

    }

    showSegmentsBy(segmentData, colorBy) {
        this.segmentLayerGroup = L.featureGroup();
        segmentData.segmentInfoList.forEach(segmentInfo => {

            var colorcode = this.chooseColorBy(segmentInfo, segmentData, colorBy);

            var polyline = L.polyline(segmentInfo.coordinates, {
                color: colorcode,
                weight: 8,
                opacity: 1,
                smoothFactor: 10
            });

            polyline.addTo(this.segmentLayerGroup);

            polyline.on('click', (e) => this.addSegmentPopup(e, segmentInfo, colorcode, colorBy));

        });
        this.segmentLayerGroup.addTo(this.mymap);
        this.mymap.fitBounds(this.segmentLayerGroup.getBounds());
    }


    getColorRanges() {
        this.mapService.getColorRanges()
            .subscribe(data => {
                this.colorRanges = data;

                console.log(data);
            });
    }


    isContainInColorRanges(colorBy: string): boolean {
        var contain = false;
        this.colorRanges.forEach(element => {
            if (element.rangeFor === colorBy) {
                console.log(colorBy);
                console.log(element.rangeFor);
                contain = true;
            }
        });
        return contain;
    }

    getColorRange(colorBy): ColorRange {
        var colorRange = null;
        this.colorRanges.forEach(element => {
            if (element.rangeFor == colorBy) {
                colorRange = element;
            }
        });
        return colorRange;
    }

    chooseColorBy(segmentInfo: SegmentInfo, segmentData: SegmentWrapper, colorBy: string): any {
        var color = "";

        var isContain = this.isContainInColorRanges(colorBy);
        console.log(isContain);

        if (isContain) {
            console.log("true")
            var colorRange = this.getColorRange(colorBy);
            this.updateColorCodesForColorRange(colorRange);
            color = this.chooseColorByRange(colorRange, segmentInfo[colorBy]);

        }
        else {
            console.log("false")
            switch (colorBy) {

                case "avgSpeed":
                    color = this.chooseColor(segmentInfo.avgSpeed, segmentData.minAvgSpeed, segmentData.maxAvgSpeed);
                    break;
                case "avgAccelY":
                    color = this.chooseColor(segmentInfo.avgAccelY, segmentData.minAvgAccelY, segmentData.maxAvgAccelY);
                    break;
                case "standardDeviationFullMeanAccelY":
                    color = this.chooseColor(segmentInfo.standardDeviationFullMeanAccelY, segmentData.minStandardDeviationFullMeanAccelY, segmentData.maxStandardDeviationFullMeanAccelY);
                    break;
                case "standardDeviationSegmentMeanAccelY":
                    color = this.chooseColor(segmentInfo.standardDeviationSegmentMeanAccelY, segmentData.minStandardDeviationSegmentMeanAccelY, segmentData.maxStandardDeviationSegmentMeanAccelY);
                    break;
                case "avgRmsAccel":
                    color = this.chooseColor(segmentInfo.avgRmsAccel, segmentData.minAvgRmsAccel, segmentData.maxAvgRmsAccel);
                    break;
                case "thresholdAy":
                    color = this.chooseColor(segmentInfo.aboveThresholdPerMeter, segmentData.minAboveThresholdPerMeter, segmentData.maxAboveThresholdPerMeter);
                    break;
                case "iri":
                    // console.log("iri type:" + segmentData.minIri + ",max:" + segmentData.maxIri);
                    color = this.chooseColor(segmentInfo.iri, segmentData.minIri, segmentData.maxIri);
                    break;
            }
        }
        return color;

    }

    addSegmentPopup(e: any, segmentInfo: SegmentInfo, speedColor: string, colorBy: string): any {
        var popup = L.popup();
        var content = "";

        content = '<div>'
            + '<span><b> Time spent = </b>' + segmentInfo.timeSpent + ' s</span><br>'
            + '<span><b> Average speed = </b>' + segmentInfo.avgSpeed.toFixed(2) + ' km/h</span><br>'
            + '<span><b> Average accelY = </b>' + segmentInfo.avgAccelY.toFixed(4) + ' m/s2</span><br>'
            + '<span><b> Average rms accel = </b>' + segmentInfo.avgRmsAccel.toFixed(4) + ' m/s2</span><br>'
            + '<span><b> Above threshold = </b>' + segmentInfo.aboveThresholdPerMeter.toFixed(4) + ' per meter</span><br>'
            + '<span><b> Above threshold count= </b>' + segmentInfo.aboveThreshold + ' </span><br>'
            + '<span><b> SD full mean accelY = </b>' + segmentInfo.standardDeviationFullMeanAccelY.toFixed(4) + '</span><br>'
            + '<span><b> SD segment mean accelY = </b>' + segmentInfo.standardDeviationSegmentMeanAccelY.toFixed(4) + '</span><br>'
            + '<span><b> IRI = </b>' + segmentInfo.iri.toFixed(4) + '</span><br>'
            + '</div>'
        popup.setLatLng(e.latlng)
            .setContent(content)
            .openOn(this.mymap);
    }
    // todo implement this
    color5 = "#F5EE04";
    color4 = "#F7960A";
    color3 = "#DF2C2C";
    color2 = "#A93226";
    color1 = "#7B241C";

    colors = [this.color1, this.color2, this.color3, this.color4, this.color5];

    chooseColor(thisavg, allmin, allmax) {


        var range = allmax - allmin;
        var rangePart = range / this.colors.length;

        // console.log("range:" + range);
        // console.log("rangePart:" + rangePart);

        var colorIndex = Math.floor((thisavg - allmin) / rangePart);
        // console.log("colorIndex:" + colorIndex);

        if (colorIndex == this.colors.length) {
            colorIndex--;
        }

        var color = this.colors[colorIndex];

        //refresh color codes by last used type (avgspeed,vertical movement)
        if (this.colorCodes.length == 0) {
            this.colors.forEach((colorStr, index) => {

                var from = (rangePart * index) + allmin;
                var to = (rangePart * (index + 1)) + allmin;

                var desc = from.toFixed(2) + " to " + to.toFixed(2);
                this.colorCodes.push(new ColorCode(colorStr, desc));
            });
        }
        return color;
    }

    updateColorCodes(from, to, colorStr, last) {
        var desc = from.toFixed(2) + " to " + to.toFixed(2);
        if (last) {
            desc = from.toFixed(2)+"=<" ;
        }
        this.colorCodes.push(new ColorCode(colorStr, desc));
    }

    updateColorCodesForColorRange(colorRange: ColorRange) {
        if (this.colorCodes.length == 0) {
            this.updateColorCodes(colorRange.ranges.r0.from, colorRange.ranges.r0.to, this.color1, false);
            this.updateColorCodes(colorRange.ranges.r1.from, colorRange.ranges.r1.to, this.color2, false);
            this.updateColorCodes(colorRange.ranges.r2.from, colorRange.ranges.r2.to, this.color3, false);
            this.updateColorCodes(colorRange.ranges.r3.from, colorRange.ranges.r3.to, this.color4, false);
            this.updateColorCodes(colorRange.ranges.r4.from, colorRange.ranges.r4.to, this.color5, true);
        }
    }

    chooseColorByRange(colorRange: ColorRange, value) {
        if (value >= colorRange.ranges.r0.from && value < colorRange.ranges.r0.to) {
            return this.color1;
        }
        else if (value >= colorRange.ranges.r1.from && value < colorRange.ranges.r1.to) {
            return this.color2;
        }
        else if (value >= colorRange.ranges.r2.from && value < colorRange.ranges.r2.to) {
            return this.color3;
        }
        else if (value >= colorRange.ranges.r3.from && value < colorRange.ranges.r3.to) {
            return this.color4;
        }
        else if (value >= colorRange.ranges.r4.from) {
            return this.color5;
        }

    }



    // id selection box
    // selectize js
    placeholder: string = 'Select a journey...';
    config = {
        labelField: 'journeyName',
        valueField: 'journeyID',
        highlight: true,
        create: false,
        persist: true,
        searchField: 'journeyName',
        dropdownDirection: 'down',
        maxItems: 1,
        render: {
            option: function (item, escape) {
                var date = new Date(item.syncTime);
                var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                var monthWithout0strt = date.getMonth() + 1;
                var formatDate = date.getDate() + "/" + monthWithout0strt + "/" + date.getFullYear() + " " + hours + ":" + min;

                return '<div style="">' +
                    '<span class="name">' + escape(item.journeyName) + '</span>' + '<br>' +
                    '<span style="float:left; color:#808080">' + escape(formatDate) + '</span>' +
                    '</div>';
            }
        }

    };

    getSelectionDate(option: Journey) {
        var date = new Date(option.syncTime);
        var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var monthWithout0strt = date.getMonth() + 1;
        var formatDate = date.getDate() + "/" + monthWithout0strt + "/" + date.getFullYear() + " " + hours + ":" + min;
        return formatDate;
    }


}
