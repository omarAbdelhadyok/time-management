import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'filter'
})
@Injectable()
export class FilterPipe implements PipeTransform {

  constructor() {}

  transform(value: any, filterString: string, propName: string): any {
    if(!value || !filterString || value.length === 0 || filterString === ' ') {
      return value;
    }
    const resultArray = [];
    for(const item of value) {
      let array = item[propName];
      if(array.toLowerCase().includes(filterString.toLowerCase())) {
        resultArray.push(item);
      }
    }
    return resultArray; 
  }

}
