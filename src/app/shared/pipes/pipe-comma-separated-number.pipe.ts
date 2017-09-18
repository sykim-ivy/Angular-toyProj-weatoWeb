import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeCommaSeparatedNumber'
})
export class PipeCommaSeparatedNumberPipe implements PipeTransform {

  transform(value:number, args:string[]) : any {
    let reg = /(^[+-]?\d+)(\d{3})/;
    let n = value.toString()
 
    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
    return n;
  }

}
