import { Component, Inject, OnInit } from '@angular/core';
// service
import { HttpNavermapV3ApiRequestService } from '../../services';
// material design
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

// Naver Map API
declare var naver: any;

@Component({
    selector: 'weato-result-snack-bar-showOverInfoDialog',
    templateUrl: "dialog-tour-place-info.html",
    styleUrls: ['./dialog-tour-place-info.css', '../../../search-result/search-result.component.css']
  })
  export class DialogTourPlaceInfoComponent implements OnInit{
  
    private isShowMap : boolean;
    private isFirstLoaded : boolean;
    private map;
    private marker;
    private infoWindow;
  
    constructor(
      public dialogRef: MdDialogRef<DialogTourPlaceInfoComponent>,
      private navermapV3APIService : HttpNavermapV3ApiRequestService,
      @Inject(MD_DIALOG_DATA) public data: any) {     }
  
    ngOnInit() {   
      this.isShowMap = false;
      this.isFirstLoaded = false;    
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    toggleMap(title : string, address : string){
        this.isShowMap = !this.isShowMap; 
  
        if(!this.isFirstLoaded){      
            // 관광지 주소로 네이버 위경도값 불러오기
            this.navermapV3APIService.getLatLonObsevable(address, '')
            .subscribe(
              (point) => {          
                console.log('-- [지도 출력을 위한 위경도 API 응답]', point);

                // 1) 해당 위치의 지도 생성 (onInit에서 생성시 typescript와 네이버 API 충돌)
                this.map = new naver.maps.Map("map", {
                    center: new naver.maps.LatLng(point.lat, point.lon),
                    zoom: 10,
                    mapTypeControl: true
                });

                // 2) 마커 표시
                this.marker = new naver.maps.Marker({
                  position: new naver.maps.LatLng(point.lat, point.lon),
                  map: this.map
                });

                // 3) 인포 윈도우 표시 
                this.infoWindow = new naver.maps.InfoWindow({
                    anchorSkew: true
                });
                this.infoWindow.setContent('<div style="width:150px;text-align:center;padding:10px;"><b>"'+ title +'"</b></div>');
                this.infoWindow.open(this.map, this.marker);

              }, 
              (err) => {
                this.navermapV3APIService.handleHttpError(err, '지도 출력을 위한 위경도 API');
              }
            );

            this.isFirstLoaded = true;
        }  
    }  
  
  }