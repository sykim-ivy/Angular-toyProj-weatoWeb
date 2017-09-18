import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
// service
import { CommonServiceService } from '../shared';
import { HttpNavermapV3ApiRequestService } from '../shared';

@Injectable()
export class MoveResultpageResolver implements Resolve<any> {
  private tourInputData_resolver;

  constructor(private commonService : CommonServiceService, private navermapV3APIService : HttpNavermapV3ApiRequestService) {
    this.tourInputData_resolver = {
      // 여행지역
      areaName:'', 
      areaCode: 0,
      sigunguName:'', 
      sigunguCode: 0,
      lat : 0,
      lon : 0,
      // 여행날짜
      startDate : this.commonService.setDateTimeClear(new Date()),   
      startDateStr : '',   
      endDate : this.commonService.setDateTimeClear(new Date()),
      endDateStr : '',   
      tourDay : 0,
      // 여행테마 : [대, 중, 소분류값]
      cat1Name:'', 
      cat1 : '',
      cat2Name:'', 
      cat2 : '',
      cat3Name:'', 
      cat3 : ''      
    };
  }

  resolve(route: ActivatedRouteSnapshot): Promise<any> {
      let tourInputData = route.queryParams;

      // 지역변수에 call by value 안먹힘 & route.queryParams readonly Object
      this.tourInputData_resolver.areaName = tourInputData.areaName; 
      this.tourInputData_resolver.areaCode = tourInputData.areaCode; 
      this.tourInputData_resolver.sigunguName = tourInputData.sigunguName; 
      this.tourInputData_resolver.sigunguCode = tourInputData.sigunguCode; 
      this.tourInputData_resolver.startDate = tourInputData.startDate; 
      this.tourInputData_resolver.endDate = tourInputData.endDate; 
      this.tourInputData_resolver.startDateStr = tourInputData.startDateStr; 
      this.tourInputData_resolver.endDateStr = tourInputData.endDateStr; 
      this.tourInputData_resolver.tourDay = tourInputData.tourDay; 
      this.tourInputData_resolver.cat1Name = tourInputData.cat1Name; 
      this.tourInputData_resolver.cat1 = tourInputData.cat1; 
      this.tourInputData_resolver.cat2Name = tourInputData.cat2Name; 
      this.tourInputData_resolver.cat2 = tourInputData.cat2; 
      this.tourInputData_resolver.cat3Name = tourInputData.cat3Name; 
      this.tourInputData_resolver.cat3 = tourInputData.cat3; 


      // 지역&시구군값으로 위경도값 알아내어 같이 전송
      // https://stackoverflow.com/questions/43014605/angular-route-does-not-navigate-to-route-until-data-is-resolved
      return this.navermapV3APIService.getLatLonPromise(this.tourInputData_resolver.areaName, this.tourInputData_resolver.sigunguName)
      .then(
        (point) => {          
          console.log('-- [위경도 API 응답]', point);
          this.tourInputData_resolver.lat = point.lat;
          this.tourInputData_resolver.lon = point.lon;
          return this.tourInputData_resolver;
        }, 
        (err) => {
          this.navermapV3APIService.handleHttpError(err, '위경도 API');
          return this.tourInputData_resolver;
        }
      );
      
      
      
  }
}