import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// material design
import { MdSnackBar} from '@angular/material';
// service
import { CommonServiceService } from '../shared';
import { HttpTourApiRequestService } from '../shared';

@Component({
  selector: 'weato-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  private tourInputData;

  private areaCodeArr;
  private sigunguCodeArr;

  private cat1Arr;
  private cat2Arr;
  private cat3Arr;
  private isShowCat2 : boolean = false;    
  private isShowCat3 : boolean = false;
  
  constructor(private router: Router, public snackBar: MdSnackBar, 
    private commonService : CommonServiceService, private tourAPIService : HttpTourApiRequestService) { }

  ngOnInit() {
    // [HttpRequest] : 지역코드(areaCode) 요청
    this.tourAPIService // #1
    .getTourAPIPromise('areaCode', '', '지역코드')
    .subscribe(
        (resBody) => {
          console.log( '-- [지역코드] resBodyData', resBody );
          this.areaCodeArr = (resBody.totalCount > 1) ? resBody.items.item : [resBody.items.item]; // item이 1개이면 배열이 아닌 json객체가 반환
        }, (err) => {
          this.tourAPIService.handleHttpError(err, '지역코드');
        }
    );
    
    // [HttpRequest] : 여행테마-대분류(cat1) 요청 
    this.tourAPIService
    .getTourAPIPromise('categoryCode', '', '여행테마-대분류')
    .subscribe(
        (resBody) => {
          console.log( '-- [여행테마-대분류] resBodyData', resBody );
          this.cat1Arr = (resBody.totalCount > 1) ? resBody.items.item : [resBody.items.item];
        }, (err) => {
          this.tourAPIService.handleHttpError(err, '여행테마-대분류');
        }
    );

    let todayDate = new Date();
    // 사용자 입력값 초기화
    this.tourInputData = {
      // 여행지역
      areaName:'', 
      areaCode: 0,
      sigunguName:'', 
      sigunguCode: 0,
      lat : 0,
      lon : 0,
      // 여행날짜
      startDate : this.commonService.setDateTimeClear(todayDate),   
      startDateStr : this.makeDateStr(todayDate),   
      endDate : this.commonService.setDateTimeClear(todayDate),
      endDateStr : this.makeDateStr(todayDate),     
      tourDay : 0,
      // 여행테마 : [대, 중, 소분류값]
      cat1Name:'', 
      cat1 : '',
      cat2Name:'', 
      cat2 : '',
      cat3Name:'', 
      cat3 : ''      
    };

    // #2) #3방법을 서비스단으로 분리  -> 컴포넌트로 응답결과를 못넘김
    // this.tourAPIService.reqOpenAPIService(this.areaCodeArr, 'areaCode', '지역코드', '');    

    /* #3) 컴포넌트에서 http 요청
    this.http.get<ItemsResponse>(this.getAPIAddress('areaCode'))
    .subscribe(
      data => {
        console.log('지역코드 요청',data);
        if(data.response.header.resultCode ==='0000'){ // 타입체크는 위에서 ItemsResponse로 했으리라 믿음
          this.areaCodeArr = (data.response.body.totalCount > 1) ? data.response.body.items.item : [data.response.body.items.item];
          this.onAreaChange(null);
        }else{
          console.log('[지역코드 요청 에러] : resultCode = '+data.response.header.resultCode + ', resultMsg = '+data.response.header.resultMsg);
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // RxJS 연산자에서 예외가 발생하거나 네트워크 오류로 인해 요청이 성공적으로 완료되지 못하는 경우등 클라이언트 측에서 잘못된 것이 발생
          console.log('[지역코드 요청 에러] : An error occurred:', err.error.message);
        } else {
          // The backend returned an unsuccessful response code. 백엔드가 실패한 응답 코드(404, 500 등)를 반환하면 오류로 반환
          console.log(`[지역코드 요청 에러] : Backend returned code ${err.status}, body was: ${err.error}`);
        }
      }
    );
    */
  } // end-OnInit

/*** 컴포넌틑 이동 관련 ***/
  // getSearchResult() { 
  //   if(this.checktourInputDataValidation()){ // 1) 유효성 검사
  //     // 1) 전달 데이터값 정리
  //     this.tourInputData.areaName = this.getAreaNameForCode(this.tourInputData.areaCode); 
  //     this.tourInputData.sigunguName = this.getSigunguNameForCode(this.tourInputData.sigunguCode); 
  //     this.tourInputData.cat1Name = this.getCatNameForCode(1, this.tourInputData.cat1);
  //     this.tourInputData.cat2Name = this.getCatNameForCode(2, this.tourInputData.cat2);
  //     this.tourInputData.cat3Name = this.getCatNameForCode(3, this.tourInputData.cat3);
  //     // 2) 지역&시구군값으로 위경도값 알아내어 같이 전송
  //     this.tourAPIService.getVillagePromise(this.tourInputData.areaName, this.tourInputData.sigunguName)
  //     .subscribe(
  //       (point) => {
  //         // 3) 전달 날짜 데이터값 정리 
  //         this.tourInputData.tourDay = this.commonService.getDiffDay(this.tourInputData.startDate, this.tourInputData.endDate)+1; // 차이가 아니라 기간이므로 마지막 날도 포함
  //         this.displayDateStr(); // Date객체를 get방식으로 저달시 문자열값을 가진 객체가 전달됨 
          
  //         console.log('-- [위경도 API 응답]', point);
  //         this.tourInputData.lat = point.lat;
  //         this.tourInputData.lon = point.lon;
  //         // 4) 결과 페이지로 이동
  //         // https://stackoverflow.com/questions/43014605/angular-route-does-not-navigate-to-route-until-data-is-resolved
  //         this.router.navigate(['/result'], {queryParams:this.tourInputData});
  //       }, 
  //       (err) => {
  //         this.tourAPIService.handleHttpError(err, '위경도 API');
  //       }
  //     );
  //   }
  // }

  getSearchResult() { 
    if(this.checktourInputDataValidation()){ // 1) 유효성 검사
      // 1) 전달 데이터값 정리
      this.tourInputData.areaName = this.getAreaNameForCode(this.tourInputData.areaCode); 
      this.tourInputData.sigunguName = this.getSigunguNameForCode(this.tourInputData.sigunguCode); 
      this.tourInputData.cat1Name = this.getCatNameForCode(1, this.tourInputData.cat1);
      this.tourInputData.cat2Name = this.getCatNameForCode(2, this.tourInputData.cat2);
      this.tourInputData.cat3Name = this.getCatNameForCode(3, this.tourInputData.cat3);
      // 3) 전달 날짜 데이터값 정리 
      this.tourInputData.tourDay = this.commonService.getDiffDay(this.tourInputData.startDate, this.tourInputData.endDate)+1; // 차이가 아니라 기간이므로 마지막 날도 포함
      // this.displayDateStr(); // Date객체를 get방식으로 저달시 문자열값을 가진 객체가 전달됨 
      // 4) 결과 페이지로 이동
      this.router.navigate(['/result'], {queryParams : this.tourInputData});
    }
  }

  checktourInputDataValidation() : boolean {
    let validitytourInputData = false;
    if(this.tourInputData.areaCode<=0){ // 지역코드 미입력
      this.snackBar.openFromComponent(SelectAreaCodeComponent, {
        duration: 1700,
      });
      return false;
    }else if(this.tourInputData.sigunguCode<=0){// 시군구코드 미입력 
      this.snackBar.openFromComponent(SelectSigunguCodeComponent, {
        duration: 1700,
      });
      return false;
    }else if(this.commonService.getDiffDay(this.tourInputData.startDate, this.tourInputData.endDate)<0){ 
      // 시작일이 종료일이후
      this.snackBar.openFromComponent(DateValidationComponent, {
        duration: 1700,
      });
      return false;
    }else{
      validitytourInputData = true;
    }
    return validitytourInputData;    
  }

/*** 여행 테마 관련 ***/
  getCatNameForCode(catNumber:number, code: number) : string {
    let arr;
    switch(catNumber){
      case 1 : arr = this.cat1Arr; break;
      case 2 : arr = this.cat2Arr; break;
      case 3 : arr = this.cat3Arr; break;
    }

    if(!arr) return;

    for(let i=0; i<arr.length; i++){
      if(arr[i].code == code){
        return arr[i].name;
      }
    }
  }

  // [HttpRequest] : 여행테마-중분류(cat2) 요청
  onCat1Change() {
    this.isShowCat2 = true;

    this.tourAPIService
    .getTourAPIPromise('categoryCode', '&cat1='+this.tourInputData.cat1, '여행테마-중분류')
    .subscribe(
        (resBody) => {
          console.log( '-- [여행테마-중분류] resBodyData', resBody );
          this.cat2Arr = (resBody.totalCount > 1) ? resBody.items.item : [resBody.items.item];
        }, (err) => {
          this.tourAPIService.handleHttpError(err, '여행테마-중분류');
        }
    );
  }

  // [HttpRequest] : 여행테마-소분류(cat3) 요청
  onCat2Change() {
    this.isShowCat3 = true;

    this.tourAPIService
    .getTourAPIPromise('categoryCode', '&cat1='+this.tourInputData.cat1+'&cat2='+this.tourInputData.cat2, '여행테마-소분류')
    .subscribe(
        (resBody) => {
          console.log( '-- [여행테마-소분류] resBodyData', resBody );
          this.cat3Arr = (resBody.totalCount > 1) ? resBody.items.item : [resBody.items.item];
        }, (err) => {
          this.tourAPIService.handleHttpError(err, '여행테마-소분류');
        }
    );
  }

/*** 여행 지역 관련 ***/
  // 지역코드 관련 메소드 
  getAreaNameForCode(code : number) : string{    
    for(let i=0; this.areaCodeArr.length>i; i++){
      // console.log(code, this.areaCodeArr[i].code);
      if(this.areaCodeArr[i].code == code){        
        return this.areaCodeArr[i].name; 
      }
    }     
    return '';
  }  

  getSigunguNameForCode(code : number) : string{
    for(let i=0; this.sigunguCodeArr.length>i; i++){
      // console.log(code, this.areaCodeArr[i].code);
      if(this.sigunguCodeArr[i].code == code){
        return this.sigunguCodeArr[i].name;
      }
    }
    return ''; 
  }

  // [HttpRequest] : 시군구코드(sigungu~) 요청
  onAreaChange(event){ 
    if(this.tourInputData.areaCode<=0) return;

    this.tourAPIService
    .getTourAPIPromise('areaCode', '&areaCode='+this.tourInputData.areaCode, '시군구코드')
    .subscribe(
        (resBody) => {
          console.log( '-- [시군구코드] resBodyData', resBody );
          this.sigunguCodeArr = (resBody.totalCount > 1) ? resBody.items.item : [resBody.items.item];
          // 기본값은 시구군코드의 첫번째값
        }, (err) => {
          this.tourAPIService.handleHttpError(err, '시군구코드');
        }
    );
  }

/*** 날짜 관련 메소드  ***/
  displayDateStr(isStartDate : boolean){
    let dYear, dMonth, dDay;
    if(isStartDate){
      dYear = this.tourInputData.startDate.getFullYear();
      dMonth = this.tourInputData.startDate.getMonth()+1;
      dDay = this.tourInputData.startDate.getDate();
      this.tourInputData.startDateStr = dYear + '-' + dMonth + '-' + dDay;      
    }else {
      dYear = this.tourInputData.endDate.getFullYear();
      dMonth = this.tourInputData.endDate.getMonth()+1;
      dDay = this.tourInputData.endDate.getDate();
      this.tourInputData.endDateStr = dYear + '-' + dMonth + '-' + dDay;
    }
  }

  makeDateStr(date : Date) : string {
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  }

  onDateChange(event, isStartDate) {
    let todayD = this.commonService.setDateTimeClear(new Date());
    let selectDate; 
    if(isStartDate) selectDate = this.tourInputData.startDate;
    else selectDate = this.tourInputData.endDate;
    
    let btDay = this.commonService.getDiffDay(todayD, selectDate);
    console.log('오늘과 '+btDay+'일 차이');

    if(btDay<3 || btDay>10){ // 사용자가 현재날짜로부터 10일 이후날짜를 선택한 경우 --> 날짜 미지원
      this.snackBar.openFromComponent(After10DayComponent, {
        duration: 1800,
      });
    }

    this.displayDateStr(isStartDate);
  }

  startDateFilter = (d: Date): boolean => {
    let todayD = this.commonService.setDateTimeClear(new Date());
    todayD.setDate(todayD.getDate());
    return todayD <= d;
  }

  endDateFilter = (d: Date): boolean => {
    if(!this.tourInputData.startDate){
      return; // 모든 날짜 막음
    } 
    return this.tourInputData.startDate <= d;
  }

}

/*** SnackBar Component ***/
@Component({
  selector: 'weato-main-snack-bar-after10day',
  template: "<div id='snackTextWeather'>※ <span id='snackText'>오늘로부터 3~10일 이후의 날씨만 지원됩니다</span> ※</div>",
  styleUrls: ['./snack-bar-validation.css']
})
export class After10DayComponent {}

@Component({
  selector: 'weato-main-snack-bar-after10day',
  template: "<div id='snackTextWeather'>※ <span id='snackText'>시작일은 종료일 이전이어야 합니다</span> ※</div>",
  styleUrls: ['./snack-bar-validation.css']
})
export class DateValidationComponent {}

@Component({
  selector: 'weato-main-snack-bar-selectAreaCode',
  template: "<div id='snackText'>※ 지역을 선택해주세요 ※</div>",
  styleUrls: ['./snack-bar-validation.css']
})
export class SelectAreaCodeComponent {}

@Component({
  selector: 'weato-main-snack-bar-selectAreaCode',
  template: "<div id='snackText'>※ 시군구를 선택해주세요 ※</div>",
  styleUrls: ['./snack-bar-validation.css']
})
export class SelectSigunguCodeComponent {}