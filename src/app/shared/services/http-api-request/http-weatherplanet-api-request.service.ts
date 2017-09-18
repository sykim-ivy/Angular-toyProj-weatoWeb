import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpCommonInfoService } from './http-common-info.service'; // service
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";

interface WeatherItemsResponse {
  weather : {  
    forecast6days : [{
        gred : {},
        location : {},
        sky : {},
        temperature : {},
        timeRelease : string
    }]
  },
  common : {
  },
  result : {
    code : number,
    message : string,
    requestUrl : string
  }
};

@Injectable()
export class HttpWeatherplanetApiRequestService {

  constructor(private apiInfo : HttpCommonInfoService, private httpClient : HttpClient) 
  { }
  
  //  Weatherplnet API 주소생성
  getWeatherplanetAPIAddress(serviceName : string, addParam : string) : string { 
    return this.apiInfo.getWeatherplanetApiCommonAddr()+serviceName+addParam;
  }

  // Weatherplnet API 요청
  getWeatherplanetAPIPromise(serviceName : string, addParam : string, logTitle : string):Observable<any> {
    let headers = new HttpHeaders().set("appKey", this.apiInfo.getWeatherplanetAppKey());
    let someObservable = 
        this.httpClient.get<WeatherItemsResponse>
        (this.getWeatherplanetAPIAddress(serviceName, addParam), {headers})
        .mergeMap((data) => {
            console.log( logTitle + ' 요청', data );
            return new Promise(resolve => resolve(data));
        });
      return someObservable;
  }

   // OpenAPI 요청후 컴포넌트에서 에러처리
   handleHttpError(err : HttpErrorResponse, logTitle : string) {
    if (err.error instanceof Error) {
      // RxJS 연산자에서 예외가 발생하거나 네트워크 오류로 인해 요청이 성공적으로 완료되지 못하는 경우등 클라이언트 측에서 잘못된 것이 발생
      console.log('[날씨 API '+logTitle+' 요청 에러] : An error occurred:', err.error.message);
    } else {
      // The backend returned an unsuccessful response code. 백엔드가 실패한 응답 코드(404, 500 등)를 반환하면 오류로 반환
      console.log('[날씨 API '+logTitle+` 요청 에러] : Backend returned code ${err.status}, body was: ${err.error}`);
    }
  }

}
