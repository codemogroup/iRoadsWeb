import { Component, OnInit } from '@angular/core';
import { Journey } from '../entities/journey';
import { MapService } from '../services/map.service';
import { RequestOptions } from '@angular/http';
import { UploadService } from '../services/upload.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-upload-prediction',
  templateUrl: './upload-prediction.component.html',
  styleUrls: ['./upload-prediction.component.css']
})
export class UploadPredictionComponent implements OnInit {

  public filename;

  fileList: FileList
  file: File;
  predictionGroup: string;
  subName: string;

  uploading;
  loadingGroups;

  groupIds: Object[];

  constructor(private mapService: MapService, private uploadService: UploadService) {
    this.uploading = false;
  }

  ngOnInit() {
    this.getGroupIds();

  }

  getGroupIds(): void {
    this.loadingGroups = true;
    this.uploadService.getGroups()
      .subscribe(data => {
        this.groupIds = data;
        this.loadingGroups = false;
      });
  }

  fileChange(event) {
    console.log("fileChangeEvent")
    this.fileList = event.target.files;
    if (this.fileList.length > 0) {
      this.file = this.fileList[0];

      this.filename = this.file.name;
    }
  }

  submitFile() {
    if (this.file) {
      console.log(this.file.name);
    }
    if (this.predictionGroup) {

      this.uploading = true;

      this.uploadService.pushFileToServer(this.file, this.predictionGroup, this.subName)
        .subscribe(event => {
          this.uploading = false;
          if (event instanceof HttpResponse) {

            this.filename = undefined;
            this.predictionGroup = undefined;
            this.subName = undefined;

            this.file = undefined;
            console.log('File is completely uploaded!');
            this.openUploadCompleteAlert();

          }
        });
      this.file = undefined;
    }
  }

  openUploadCompleteAlert() {
    alert("File is completely uploaded!");
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
