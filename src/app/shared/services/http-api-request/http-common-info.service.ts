import { Injectable } from '@angular/core';

const TOUR_API_COMMON_ADDR = "http://api.visitkorea.or.kr/openapi/service/rest/KorService/";
const API_KEY = 'm0IaUEhDAmP5V7bv4rScBSUaClWci3DaRF%2BbRpr%2Fqk4koGWJx3HlFCJf1%2F%2FYMcCr%2BHYZWn2PwAKw%2BsKdGaiU0g%3D%3D';
const MOBILEAPP = 'WeaTo';

const WEATHERPLANET_API_COMMON_ADDR = "http://apis.skplanetx.com/weather/forecast/";
const WEATHERPLANET_APP_KEY = "e872849a-8b80-355c-9f0f-cb97d094ad85"; //"897f727f-8762-330c-a937-d4a32c57091f";

@Injectable()
export class HttpCommonInfoService {

  private MobileOS = 'ETC';
  private _type = 'json';

  constructor() { }


  getWeatherplanetApiCommonAddr() : string {
    return WEATHERPLANET_API_COMMON_ADDR;
  }

  getWeatherplanetAppKey() : string {
    return WEATHERPLANET_APP_KEY;
  }

  getTourApiCommonAddr() : string{
    return TOUR_API_COMMON_ADDR;
  }

  getAPIKEY() : string{
    return API_KEY;
  }

  getMOBILEAPP() : string {
    return MOBILEAPP;
  }

  setMobileOS(mobileOS : string) {
    this.MobileOS = mobileOS;
  }

  getMobileOS() : string {
    return this.MobileOS;
  }

  setAPIRespType(type : string) {
    this._type = type;
  }

  getAPIRespType() : string {
    return this._type;
  }

}
