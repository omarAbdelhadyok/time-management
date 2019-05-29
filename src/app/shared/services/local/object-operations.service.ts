import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ObjectsOperationsService {

  constructor() { }

  public areEqualObjects(obj1, obj2, ...skip): boolean {
    if( !obj1 && typeof obj1 == 'object') { // Handle null
      return (!obj2 && typeof obj1 == 'object');
    }
    let keys = Object.keys(obj1);
    for(let i = 0; i < keys.length; i++) {
      if(skip.findIndex(key => key == keys[i])!=-1) 
        continue;
      // console.log("key", keys[i]);
      if(typeof obj1[keys[i]] == "object") {
        // console.log("Object", obj1[keys[i]]);
        if(obj1[keys[i]] instanceof Array) {
          if(!obj2[keys[i]] || !(obj2[keys[i]] instanceof Array) || obj1[keys[i]].length != obj2[keys[i]].length)
            return false; // Else loop over the array and apply recursion
        }
        if(!this.areEqualObjects(obj1[keys[i]], obj2[keys[i]]))
          return false;
      } else {
        if(!obj2)
          return false;
        // console.log(keys[i], obj1[keys[i]]);
        // console.log(keys[i], obj2[keys[i]]);
        if(!(obj1[keys[i]]==obj2[keys[i]]))
          return false;
      }
    }
    return true;
  }
  public isEmptyObject(obj, ...skip) {
    let keys = Object.keys(obj);
    for(let i = 0; i < keys.length; i++) {
      if(skip.findIndex(key => key == keys[i])!=-1) 
        continue;
      if(obj[keys[i]] && typeof obj[keys[i]] == "object") {
        if(!this.isEmptyObject(obj[keys[i]]))
          return false;
      } else {
        if(obj[keys[i]])
          return false;
      }
    }
    return true;
  }
  public haveAnyValidFormControl(form: FormGroup, ...skip): boolean {
    let keys = Object.keys(form.value);
    for(let i = 0; i < keys.length; i++) {
      if(skip.find(item => item == keys[i]))
        continue;
      if(form.get(keys[i]).valid)
        return true;
    }
    return false;
  }
  public copyArrayOfObjects(arr) {
    arr = arr || [];
    let arrCopy = [];
    for(let i = 0; i < arr.length; i++) {
      arrCopy.push(Object.assign({}, arr[i]))
    }
    return arrCopy;
  }

}