import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  weeks = [];
  weeksBackup = [];
  connectedTo = [];
  
  constructor(){
    this.weeks = [
      {
        id:'week-1',
        weeklist:[
          "item 1",
          "item 2",
          "item 3",
          "item 4",
          "item 5"
        ]
      },{
        id:'week-2',
        weeklist:[
          "item 1",
          "item 2",
          "item 3",
          "item 4",
          "item 5"
        ]
      },{
        id:'week-3',
        weeklist:[
          "item 1",
          "item 2",
          "item 3",
          "item 4",
          "item 5"
        ]
      },{
        id:'week-4',
        weeklist:[
          "item 1",
          "item 2",
          "item 3",
          "item 4",
          "item 5"
        ]
      },
    ];
    for (let week of this.weeks) {
      this.connectedTo.push(week.id);
    };

    this.weeksBackup = JSON.parse(JSON.stringify(this.weeks));
  }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.weeks.forEach((week, index) => {
        if(!this.arraysEquality(week.weeklist, this.weeksBackup[index].weeklist)) {
          console.log('not equal')
        }
      })

    }
  }

  arraysEquality(array1, array2) {
    // if the other array is a falsy value, return
    if (!array1 || !array2) return false;
  
    // compare lengths - can save a lot of time 
    if (array1.length != array2.length) return false;
  
    for (let i = 0; i < array1.length; i++) {
      // Check if we have nested arrays
      if (array1[i] instanceof Array && array2[i] instanceof Array) {
        // recurse into the nested arrays
        if (!array1[i].equals(array2[i]))
          return false;       
      }           
      else if (array1[i] != array2[i]) { 
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;   
      }           
    }       
    return true;
  }

}
