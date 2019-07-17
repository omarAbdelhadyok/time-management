import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-deactivate',
  templateUrl: './confirm-deactivate.component.html',
  styleUrls: ['./confirm-deactivate.component.scss']
})
export class ConfirmDeactivateComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmDeactivateComponent>) { }

  ngOnInit() {
  }

  discardChanges() {
    this.dialogRef.close(true);
  }

  cancelDeactivate() {
    this.dialogRef.close(false);
  }

  

}
