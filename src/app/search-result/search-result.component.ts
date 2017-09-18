import { Component, Inject, OnInit, NgZone } from '@angular/core';
// Route
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from "rxjs/Rx";
// material design
import { MdDialog } from '@angular/material';
// service
import { CommonServiceService, HttpTourApiRequestService, HttpWeatherplanetApiRequestService, HttpNavermapV3ApiRequestService } from '../shared';
// component
import { DialogTourPlaceInfoComponent } from '../shared';


@Component({
  selector: 'weato-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  // 사용자 입력값 
  private tourInputData = null;
  private subscription: Subscription;

  // 사용자 입력값에 따른 뷰값
  private weatherplanetAPIAddParam : string;
  private tourThemeStr : string;
  private startDateObj : Date;
  private endDateObj : Date;
  private tourDayWeatherArr : {}[];

  // 지역관광정보 API
  private areaBasedListArr;
  private moreAreaBasedList : boolean = false;
  private areaBasedPageInfo;
  private areaBasedAPIFixedParam : string;

  // 날씨 관련 API
  private skyList: {};
  private temperatureList: {}; 
  p: number = 1;

  constructor(private _location : Location, private route: ActivatedRoute, public dialog: MdDialog,
    private commonService : CommonServiceService, 
    private tourAPIService : HttpTourApiRequestService, private weatherplanetAPIService : HttpWeatherplanetApiRequestService,
    private navermapV3APIService : HttpNavermapV3ApiRequestService,
    lc: NgZone) 
  {
    window.onscroll = () => {
      let windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
      let body = document.body, html = document.documentElement;
      let docHeight = Math.max(body.scrollHeight,
          body.offsetHeight, html.clientHeight,
          html.scrollHeight, html.offsetHeight);
      let windowBottom = windowHeight + window.pageYOffset;
      if (windowBottom >= docHeight) {
        console.log('--- ScrollDown Event : 관광정보 더 불러오기 ');
        if(!this.moreAreaBasedList) this.getMoreAreaBasedListArr(); 
      }
      // lc.run(() => {
      //   console.log(status);
      // });
    };       
  }//end-constructor

  
    
  ngOnInit() {    
    // 사용자 입력값 받기
    // this.subscription = this.route.queryParams.subscribe(
    //   (queryParam: any) => {
    //     this.tourInputData = queryParam;
    //     this.areaBasedAPIFixedParam = '&areaCode='+this.tourInputData.areaCode+"&sigunguCode="+this.tourInputData.sigunguCode;
    //     console.log('---[사용자 입력값]---', this.tourInputData);
    //     // 화면에 보여질 값 정리
    //     this.setTourTheme();
    //     this.setTourDate();
    //   }
    // );

    // resolver
    this.subscription = 
    this.route.data
    .subscribe(
      (data: any) => {
        this.tourInputData = data.result;
        this.areaBasedAPIFixedParam = '&areaCode='+this.tourInputData.areaCode+"&sigunguCode="+this.tourInputData.sigunguCode;
        console.log('---[사용자 입력값]---', this.tourInputData);
        // 화면에 보여질 값 정리
        this.setTourTheme();
        this.setTourDate();
      }
    );

    // 1) 날짜값에 따른 날씨값 요청
    this.tourDayWeatherArr = [];  

    this.weatherplanetAPIService
    // 2017-09-06 : 동값(village값이 필수인데 관광지역API에서는 구군까지만 지원됨 - 그러므로 getVillageValue메서드에서 동값 얻어오는 조치 필요)
    .getWeatherplanetAPIPromise('6days', '?lat='+this.tourInputData.lat+'&lon='+this.tourInputData.lon+'&foretxt=N&version=1', '지역기반 관광정보')
    .subscribe(
        (data) => {
          console.log('-- [날씨 API 요청]', data);
          this.skyList = data.weather.forecast6days[0].sky;
          this.temperatureList = data.weather.forecast6days[0].temperature;
          this.showTourDate(); // 지원할 날짜 정보만 추출
        }, (err) => {
          this.weatherplanetAPIService.handleHttpError(err, '중기예보');
        }
    );

  // this.http.get<WeatherItemsResponse>(
    //   'http://apis.skplanetx.com/weather/forecast/6days?lon=&village=논현동&county=강남구&foretxt=N&lat=&city=서울&version=1',
    //   {headers}
    // )
    // .subscribe(
    //   data => {
    //     console.log('---[날씨 API 요청]---',data);
    //     this.skyList = data.weather.forecast6days[0].sky;
    //     console.log('this.skyList',this.skyList);
    //     this.temperatureList = data.weather.forecast6days[0].temperature;
    //     console.log('this.temperature',this.temperatureList);
    //     this.showTourDate(); // 지원할 날짜 정보만 추출
    //   },
    //   (err: HttpErrorResponse) => {
    //     if (err.error instanceof Error) {
    //       // RxJS 연산자에서 예외가 발생하거나 네트워크 오류로 인해 요청이 성공적으로 완료되지 못하는 경우등 클라이언트 측에서 잘못된 것이 발생
    //       console.log('[날씨 요청 에러] : An error occurred:', err.error.message);
    //     } else {
    //       // The backend returned an unsuccessful response code. 백엔드가 실패한 응답 코드(404, 500 등)를 반환하면 오류로 반환
    //       console.log(`[날씨 요청 에러] : Backend returned code ${err.status}, body was: ${err.error}`);          
    //     }        
    //   }
    // );    

    // 관광정보 초기값 설정
    this.areaBasedListArr = [];
    this.areaBasedPageInfo = {
      totalCount : -1,
      pageNo : -1,
      numOfRows : -1,
      totalPageCount : -1
    }

    // 2) 지역 및 여행테마에 따른 관광정보 요청
    this.tourAPIService
    .getTourAPIPromise('areaBasedList', this.areaBasedAPIFixedParam + this.addTourthemeParam(), '지역기반 관광정보')
    .subscribe(
        (resBody) => {
          console.log( '-- [지역기반 관광정보] resBodyData', resBody );
          this.areaBasedPageInfo.totalCount = resBody.totalCount;
          this.areaBasedPageInfo.pageNo = resBody.pageNo;
          this.areaBasedPageInfo.numOfRows = resBody.numOfRows;
          this.areaBasedPageInfo.totalPageCount = Math.ceil(this.areaBasedPageInfo.totalCount/this.areaBasedPageInfo.numOfRows);

          if(this.areaBasedPageInfo.totalCount == 0) return;
          
          console.log('-- [지역기반 관광정보]--- 페이지 정보', this.areaBasedPageInfo);
          let addedAreaBasedListArr = (this.areaBasedPageInfo.totalCount == 1) ? [resBody.items.item] : resBody.items.item;          
          this.areaBasedListArr = this.areaBasedListArr.concat(addedAreaBasedListArr);
        }, (err) => {
          this.tourAPIService.handleHttpError(err, '지역기반 관광정보');
        }
    );

    // this.http.get<ItemsResponse>(this.areaBasedAPIFixedParam)
    // .subscribe(
    //   data => {
    //     console.log('---[지역관광지 요청]---',data);        
    //     this.areaBasedPageInfo.totalCount = data.response.body.totalCount;
    //     this.areaBasedPageInfo.pageNo = data.response.body.pageNo;
    //     this.areaBasedPageInfo.numOfRows = data.response.body.numOfRows;
    //     this.areaBasedPageInfo.totalPageCount = Math.ceil(this.areaBasedPageInfo.totalCount/this.areaBasedPageInfo.numOfRows);
    //     console.log('---[지역관광지 요청]--- 페이지 정보', this.areaBasedPageInfo);

    //     if(data.response.header.resultCode ==='0000' &&  this.areaBasedPageInfo.totalCount>0){ // 타입체크는 위에서 ItemsResponse로 했으리라 믿음
    //       this.areaBasedListArr = ( this.areaBasedPageInfo.totalCount == 1) ? [data.response.body.items.item] : data.response.body.items.item;          
    //       console.log('areabasedList', this.areaBasedListArr);
    //     }else{
    //       console.log('[지역관광지 요청 에러] : resultCode = '+data.response.header.resultCode + ', resultMsg = '+data.response.header.resultMsg);
    //     }
    //   },
    //   (err: HttpErrorResponse) => {
    //     if (err.error instanceof Error) {
    //       // RxJS 연산자에서 예외가 발생하거나 네트워크 오류로 인해 요청이 성공적으로 완료되지 못하는 경우등 클라이언트 측에서 잘못된 것이 발생
    //       console.log('[지역관광지 요청 에러] : An error occurred:', err.error.message);
    //     } else {
    //       // The backend returned an unsuccessful response code. 백엔드가 실패한 응답 코드(404, 500 등)를 반환하면 오류로 반환
    //       console.log(`[지역관광지 요청 에러] : Backend returned code ${err.status}, body was: ${err.error}`);
    //     }
    //   }
    // );


  }// end-OnInit

/*** 지역 데이터 관련 ***/
  
  

/*** 지역기반 관광정보 데이터 관련 ***/

  // 스크롤다운시 관광정보 더 불러옴
  getMoreAreaBasedListArr() {
    this.moreAreaBasedList = true; // API 요청중
    let addPagenoParamAddr = this.areaBasedAPIFixedParam + this.addTourthemeParam() + '&pageNo='+(this.areaBasedPageInfo.pageNo+1);

    this.tourAPIService
    .getTourAPIPromise('areaBasedList', addPagenoParamAddr, '지역기반 관광정보-More')
    .subscribe(
        (resBody) => {
          console.log( '-- [지역기반 관광정보-More] resBodyData', resBody );
          this.moreAreaBasedList = false; // API 요청 완료

          if(resBody.items){ // 새로 가져온 데이터가 있는 경우, 
            this.areaBasedPageInfo.totalCount = resBody.totalCount;
            this.areaBasedPageInfo.pageNo = resBody.pageNo;
            this.areaBasedPageInfo.numOfRows = resBody.numOfRows;
            this.areaBasedPageInfo.totalPageCount = Math.ceil(this.areaBasedPageInfo.totalCount/this.areaBasedPageInfo.numOfRows);
            console.log('-- [지역기반 관광정보-More]--- 페이지 정보', this.areaBasedPageInfo);
  
            let addedAreaBasedListArr = (this.areaBasedPageInfo.totalCount == 1) ? [resBody.items.item] : resBody.items.item;          
            this.areaBasedListArr = this.areaBasedListArr.concat(addedAreaBasedListArr);          
            console.log('-- [지역기반 관광정보-More] areaBasedListArr', this.areaBasedListArr);
          }else {
            console.log('-- [지역기반 관광정보-More] : 더 이상 불러올 관광정보가 존재하지 않습니다.');
          }

        }, (err) => {
          this.tourAPIService.handleHttpError(err, '지역기반 관광정보-More');
          this.moreAreaBasedList = false; // API 요청 완료
        }
    );
  }

  // 관광정보 검색에 테마 파라미터값 추가
  addTourthemeParam() : string {
    let addedParamAddr = '';

    if(this.tourInputData.cat1){
      addedParamAddr = '&cat1='+this.tourInputData.cat1;
      if(this.tourInputData.cat2){
        addedParamAddr += '&cat2='+this.tourInputData.cat2;
        if(this.tourInputData.cat3){
          addedParamAddr += '&cat3='+this.tourInputData.cat3;
        } 
      }
    }
    return addedParamAddr;
  }
  
  getContenttypeNameForId(contenttypeId : number) : string { // 해당 API가 없음
    let typeName : string;
    switch(contenttypeId){
      case 14: typeName = "문화시설"; break;
      case 15: typeName = "행사/공연/축제"; break;
      case 25: typeName = "여행코스"; break;
      case 28: typeName = "레포츠"; break;
      case 32: typeName = "숙박"; break;
      case 38: typeName = "쇼핑"; break;
      case 39: typeName = "음식점"; break;
      case 12: 
      default:
      typeName = "관광지"; break;
    }
    return typeName;
  }

/*** 사용자 입력값 가공 ***/
  setTourTheme() {
    if(this.tourInputData.cat3Name) this.tourThemeStr = "'"+this.tourInputData.cat3Name+"'";
    else if(this.tourInputData.cat2Name) this.tourThemeStr = "'"+this.tourInputData.cat2Name+"'";
    else if(this.tourInputData.cat1Name) this.tourThemeStr = "'"+this.tourInputData.cat1Name+"'";
  }

  setTourDate() { // 사용자 입력 날짜값을 Date객체로 변환
    let startDateArr = this.tourInputData.startDateStr.split('-');
    let endDateArr = this.tourInputData.endDateStr.split('-');
    let tYear, tMonth, tDate : number;

    try {
      tYear =  Number(startDateArr[0].trim());
      tMonth = Number(startDateArr[1].trim())-1;
      tDate =  Number(startDateArr[2].trim());
      this.startDateObj = new Date(tYear, tMonth, tDate, 0,  0,  0, 0);

      tYear =  Number(endDateArr[0].trim());
      tMonth = Number(endDateArr[1].trim())-1;
      tDate =  Number(endDateArr[2].trim());
      this.endDateObj = new Date(tYear, tMonth, tDate, 0,  0,  0, 0);
    } catch (error) {
      console.log("[ERROR] 사용자 입력 날짜 -> Date 객체 변환 문제"+" Error Message: " + error.message);
    }
  }

  showTourDate() { // 지원할 날짜 정보만 추출
    // 사용자가 입력한 날짜가 현재날짜로부터 +3~+10일 일때 날씨를 보여줌
    let plus3Date = this.commonService.setDateTimeClear(new Date());
    plus3Date.setDate(plus3Date.getDate()+3);

    let plus10Date = this.commonService.setDateTimeClear(new Date());
    plus10Date.setDate(plus10Date.getDate()+10);

    let cond = (this.startDateObj<=plus10Date) && (this.endDateObj>=plus3Date);

    if(cond){
      this.tourDayWeatherArr = [];

      let len = (this.tourInputData.tourDay>15) ? 15 : this.tourInputData.tourDay;// 날씨 지원기간을 하루라도 포함한 경우, 최대 15일까지 날씨 보여줌      
      let todayD = this.commonService.setDateTimeClear(new Date());
      let thisDay = new Date(this.startDateObj.getFullYear(), this.startDateObj.getMonth(), this.startDateObj.getDate()); // Call by value
  
      for(let i=0; i < len; i++){

        thisDay.setDate(this.startDateObj.getDate()+i);  
        let item = {
          day : thisDay.getDate(),
          dweek : this.commonService.getDayOfWeek(thisDay.getDay()),
          amCodeday : '',
          amNameday : '',
          tmaxday : '',
          tminday : '',
          src : ""
        }

        if((thisDay<=plus10Date) && (thisDay>=plus3Date)){ // 날씨가 지원되는 날
          let diffToday = this.commonService.getDiffDay(todayD, thisDay);
          item.amCodeday = this.skyList['amCode'+diffToday+'day']; 
          item.amNameday = this.skyList['amName'+diffToday+'day'];
          item.tmaxday = '최고 : ' + this.temperatureList['tmax'+diffToday+'day'] + '°C';
          item.tminday = '최저 : ' + this.temperatureList['tmin'+diffToday+'day'] + '°C';
          item.src = "../../assets/img/"+this.skyList['amCode'+diffToday+'day']+".png";          
        }

        this.tourDayWeatherArr.push(item);
      }

      console.log('---출력할 날짜 정보 ---', this.tourDayWeatherArr);
    }else{
      console.log('---날씨가 지원되지 않는 여행기간입니다.--');
    }
  }  

  goBack() : void { this._location.back(); }

  showOverInfoDialog(idx){

    let dialogRef = this.dialog.open(DialogTourPlaceInfoComponent, {
      data: this.areaBasedListArr[idx]
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
  
}

