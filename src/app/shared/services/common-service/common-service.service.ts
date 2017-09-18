import { Injectable } from '@angular/core';

@Injectable()
export class CommonServiceService {

  constructor() { }

  // 두 날짜의 일수 차이 반환 메소드
  getDiffDay(startD : Date, endD :Date ) : number { 
    let btMs = endD.getTime() - startD.getTime();
    let btDay = Math.round( btMs / (1000*60*60*24) );
    // console.log(startD+'와 '+endD+'는 '+btDay+'일 차이');
    return btDay;
  }

  // day(숫자요일)값을 보내면 한글요일값 반환
  getDayOfWeek(day) : string { 
    let week = new Array('일', '월', '화', '수', '목', '금', '토');
    return week[day];
  }

  setDateTimeClear(d : Date) : Date {
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  }


}
