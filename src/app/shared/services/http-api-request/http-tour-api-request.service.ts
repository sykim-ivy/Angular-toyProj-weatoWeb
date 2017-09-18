import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpCommonInfoService } from './http-common-info.service'; 
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

interface ItemsResponse {
  response: {
    header : {
      resultCode : string,
      resultMsg : string
    },
    body :{
    }
  };
};

// interface MyResponseType {
//   items : {
//     item : any[]
//   },
//   numOfRows : number,
//   pageNo  :  number,
//   totalCount  :  number
// };

@Injectable()
export class HttpTourApiRequestService {
  private apiAddressInfo;

  constructor(private apiInfo : HttpCommonInfoService, private httpClient : HttpClient) { 
    // API URL & Param
    this.apiAddressInfo = {
      CommonAddr : this.apiInfo.getTourApiCommonAddr(),
      ServiceKey : this.apiInfo.getAPIKEY(),
      MobileOS : this.apiInfo.getMobileOS(),
      MobileApp : this.apiInfo.getMOBILEAPP(),
      _type : this.apiInfo.getAPIRespType()
    };
  }

  // 공공데이터 OpenAPI 주소생성
  getAPIAddress(serviceName : string, addParam : string) : string{ // 서비스명으로 주소 리턴
    let addr = this.apiAddressInfo.CommonAddr + serviceName 
                +'?ServiceKey=' + this.apiAddressInfo.ServiceKey
                +'&MobileOS=' + this.apiAddressInfo.MobileOS
                +'&MobileApp=' + this.apiAddressInfo.MobileApp
                +'&_type='+ this.apiAddressInfo._type;

    if(addParam) addr += addParam;

    return addr;
  }

  // 공공데이터 OpenAPI 요청
  // 원리를 모르겟다.  - 마지막 답변 : https://stackoverflow.com/questions/44488779/angular-2-passing-value-from-service-to-component
  // Observable<any>  ==> Observable<MyResponseType> 왜 에러나는건지 모르겠다. 
  getTourAPIPromise(serviceName : string, addParam : string, logTitle : string):Observable<any> {
    let someObservable = 
        this.httpClient.get<ItemsResponse>(this.getAPIAddress(serviceName, addParam))
        .mergeMap((data) => {
            //you can process the response data here before components use it
            console.log( logTitle + ' 요청', data );
            let resultArr = data.response.body;
            return new Promise(resolve => resolve(resultArr));
        });
     return someObservable;
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


  // 공공데이터 OpenAPI 요청 -> 컴포넌트로 응답결과를 못넘김
  // reqOpenAPIService(resultArr, serviceName : string, logTitle : string, addParam : string){
  //   // Request
  //   let whatReturen = this.httpClient.get<ItemsResponse>(this.getAPIAddress(serviceName, addParam))
  //   .subscribe(
  //     data => {
  //       console.log( logTitle + ' 요청', data );
  //       if(data.response.header.resultCode ==='0000'){ // 타입체크는 위에서 ItemsResponse로 했으리라 믿음
  //         resultArr = (data.response.body.totalCount > 1) ? data.response.body.items.item : [data.response.body.items.item]; // item이 1개이면 배열이 아닌 json객체가 반환
  //         this.areaCodeArr = (data.response.body.totalCount > 1) ? data.response.body.items.item : [data.response.body.items.item]; // item이 1개이면 배열이 아닌 json객체가 반환
  //         console.log('서비스 요청후 저장 ', resultArr);
  //         return resultArr;
  //       }else{
  //         console.log('['+logTitle+' 요청 에러] : resultCode = '+data.response.header.resultCode + ', resultMsg = '+data.response.header.resultMsg);
  //         console.log('서비스 에러 ', resultArr);
  //       }
  //       console.log('서비스 요청종료 ', resultArr);
  //       return resultArr;
  //     },
  //     (err: HttpErrorResponse) => {
  //       if (err.error instanceof Error) {
  //         // RxJS 연산자에서 예외가 발생하거나 네트워크 오류로 인해 요청이 성공적으로 완료되지 못하는 경우등 클라이언트 측에서 잘못된 것이 발생
  //         console.log('['+logTitle+' 요청 에러] : An error occurred:', err.error.message);
  //         console.log('서비스 에러 1', resultArr);
  //       } else {
  //         // The backend returned an unsuccessful response code. 백엔드가 실패한 응답 코드(404, 500 등)를 반환하면 오류로 반환
  //         console.log(`['+logTitle+' 요청 에러] : Backend returned code ${err.status}, body was: ${err.error}`);
  //         console.log('서비스 에러 2', resultArr);
  //       }
  //       console.log('서비스 에러종료', resultArr);
        
  //     }
  //   ); 
  // }





}
