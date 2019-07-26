import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Note } from 'src/app/shared/models/note.model';
import { NgForm } from '@angular/forms';
import tinycolor from "tinycolor2";
import { NotesService } from 'src/app/shared/services/notes.service';
import { ToastrService } from 'ngx-toastr';
import * as uuidv1 from 'uuid/v1.js';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})
export class CreateNoteComponent implements OnInit {

  @ViewChild('noteForm') noteForm: NgForm;

  pageTitle: string = 'Add Note';
  note: Note;
  user: User;
  isEdit: boolean = false;

  busyCreating: boolean = false;

  constructor(private notesService: NotesService,
    private toastr: ToastrService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CreateNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.authService.user$.subscribe(res => this.user = res);
    this.note = this.data.note;
    if(this.note) {
      this.pageTitle = 'Edit Note';
      this.isEdit = true;
    } else {
      this.reset();
      this.pageTitle = 'Add Note';
    }
  }

  reset() {
    this.noteForm.resetForm();
    this.note = new Note();
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSave() {
    if(this.isEdit) {
      this.updateNote(this.note.id);
    } else {
      this.createNote();
    }
  }

  createNote() {
    if(!this.note.note.trim())
    return this.toastr.error('Please type valid note value');

    if(!tinycolor(this.note.bgColor).isValid())
    return this.toastr.error('Please type a valid color (ex. #FF0000)');

    this.note.bgColor = '#'+tinycolor(this.note.bgColor).toHex();

    let brightness = tinycolor(this.note.bgColor).getBrightness();
    if(brightness > 100) {
      this.note.txtColor = '#333';
    } else {
      this.note.txtColor = '#FFF'
    }

    this.busyCreating = true;
    try {
      let date = new Date();
      this.note.date = date.valueOf();
      this.note.uid = this.user.uid;
      let noteId = uuidv1();
      this.notesService.create(noteId, this.note)
      .then(res => {
        this.busyCreating = false;
        this.toastr.success('Your note was successfully created');
        this.dialogRef.close();
      })
      .catch(err => {
        this.toastr.error(err);
        this.busyCreating = false;
      })
    }
    catch (err) {
      this.toastr.error(err.message);
      this.busyCreating = false;
    }
  }

  updateNote(id) {
    if(!this.note.note.trim())
    return this.toastr.error('Please type valid note value');

    if(!this.note.note.trim())
    return this.toastr.error('Please type valid note value');

    if(!tinycolor(this.note.bgColor).isValid())
    return this.toastr.error('Please type a valid color (ex. #FF0000)');

    this.note.bgColor = '#'+tinycolor(this.note.bgColor).toHex();

    let brightness = tinycolor(this.note.bgColor).getBrightness();
    if(brightness > 100) {
      this.note.txtColor = '#333';
    } else {
      this.note.txtColor = '#FFF'
    }

    this.busyCreating = true;
    try {
      this.notesService.update(id, this.note)
      .then(res => {
        this.busyCreating = false;
        this.toastr.success('Your note was successfully updated');
        this.dialogRef.close();
      })
      .catch(err => {
        this.toastr.error(err);
        this.busyCreating = false;
      })
    }
    catch (err) {
      this.toastr.error(err.message);
      this.busyCreating = false;
    }
  }

}
