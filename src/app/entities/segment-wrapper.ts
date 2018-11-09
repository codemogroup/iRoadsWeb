import { SegmentInfo } from "./segment-info";

export class SegmentWrapper {
    segmentInfoList:SegmentInfo[];
   
    journeyID:string;
    startTime:Date;
    endTime:Date;
    timeSpent:number;
    noOfSegments:number;

    minAvgSpeed:number;
    maxAvgSpeed:number;

    minAvgAccelY:number;
    maxAvgAccelY:number;

    minStandardDeviationFullMeanAccelY:number;
    maxStandardDeviationFullMeanAccelY:number;

    minStandardDeviationSegmentMeanAccelY:number;
    maxStandardDeviationSegmentMeanAccelY:number;

    minAvgRmsAccel:number;
    maxAvgRmsAccel:number;

    minAboveThresholdPerMeter;
    maxAboveThresholdPerMeter;

    minIri;
    maxIri;

    
}
