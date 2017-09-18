import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Observer } from 'rxjs/Observer';
import { HttpErrorResponse } from "@angular/common/http";
declare var naver: any; // Naver Map API

@Injectable()
export class HttpNavermapV3ApiRequestService {

  constructor() { }

  // 사용자 지역 입력값에서 위경도 불러오기 (Naver Map API 사용)
  getLatLonObsevable(cityName : string, countyName : string) : Observable<any> {
    
    if(cityName == countyName) countyName = '';

    return new Observable((observer: Observer<any>) => {
      // 네이버 API
      naver.maps.Service.geocode({
          address: cityName + " " + countyName
      }, function(status, response) {        
          if (status === naver.maps.Service.Status.ERROR) {
            console.log('['+cityName + " " + countyName+' 이름으로 위경도 호출 API 요청 실패]');
            observer.error(status);
          }else {
            let item = response.result.items[0];
            console.log("--- " + cityName + " " + countyName+"의 위경도는 "+item.point.x +','+ item.point.y);
            observer.next({lat : item.point.y, lon : item.point.x});
            observer.complete();
          }        
      });
    });
  }

  // 사용자 지역 입력값에서 위경도 불러오기 (Naver Map API 사용)
  getLatLonPromise(cityName : string, countyName : string) : Promise<any> {
    
    if(cityName == countyName) countyName = '';

    return new Promise((resolve, reject) => {
      // 네이버 API
      naver.maps.Service.geocode({
          address: cityName + " " + countyName
      }, function(status, response) {        
          if (status === naver.maps.Service.Status.ERROR) {
            console.log('['+cityName + " " + countyName+' 이름으로 위경도 호출 API 요청 실패]');
          }else {
            let item = response.result.items[0];
            console.log("--- " + cityName + " " + countyName+"의 위경도는 "+item.point.x +','+ item.point.y);
            resolve({lat : item.point.y, lon : item.point.x});
          }        
      });
    });
  }

   // 공공데이터 OpenAPI 요청후 컴포넌트에서 에러처리
   handleHttpError(err : HttpErrorResponse, logTitle : string) {
    if (err.error instanceof Error) {
      // RxJS 연산자에서 예외가 발생하거나 네트워크 오류로 인해 요청이 성공적으로 완료되지 못하는 경우등 클라이언트 측에서 잘못된 것이 발생
      console.log('['+logTitle+' 요청 에러] : An error occurred:', err.error.message);
    } else {
      // The backend returned an unsuccessful response code. 백엔드가 실패한 응답 코드(404, 500 등)를 반환하면 오류로 반환
      console.log('['+logTitle+' 요청 에러] : Backend returned code ${err.status}, body was: ${err.error}');
    }
  }

}
