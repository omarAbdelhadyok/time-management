import { Component, OnInit, Renderer2 } from '@angular/core';
import { NotesService } from 'src/app/shared/services/notes.service';
import { Note } from 'src/app/shared/models/note.model';
import { MatDialog } from '@angular/material';
import { CreateNoteComponent } from './create-note/create-note.component';
import { ToastrService } from 'ngx-toastr';
import { FavColorsService } from 'src/app/shared/services/fav-colors.service';
import { FavColor } from 'src/app/shared/models/fav-color.model';
import tinycolor from "tinycolor2";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  notes: Note[] = [];
  noData: boolean = false;
  busyDeleting: boolean = false;
  displayedMsg: string;

  favColors: FavColor;
  busyLoading: boolean = false;
  selectedFavColors: string[] = [];

  constructor(private notesService: NotesService,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private favColorsService: FavColorsService) { }

  //handling add - edit note dialog
  openDialog(noteIndex?): void {
    let data;
    if(noteIndex || noteIndex == 0) {
      data = this.notes[noteIndex];
    }
    const dialogRef = this.dialog.open(CreateNoteComponent, {
      width: '60%',
      data: {note: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllNotes();
    });
  }

  ngOnInit() {
    this.getAllNotes();
    this.getAllColors();
  }

  //copy selected color to clipboard
  copyColor(color: string) {
    //try to inject window service and use clipboard
  }

  //getting all notes
  getAllNotes() {
    try {
      this.notesService.getAll().then(snapshot => {
        let results = [];
        snapshot.docs.map(doc => {
          const data = doc.data() as Note;
          const id = doc.id;
          results.push({ id, ...data });
          this.selectedFavColors.push('');
        })
        this.notes = results;
        if(this.notes.length !== 0) {
          this.noData = false;
        } else {
          //no data to display (data length === 0)
          this.noData = true;
          this.displayedMsg = `No notes yet ...`;
        }
      })
      .catch(err => {
        console.log(err);
        this.noData = true;
        this.displayedMsg = 'Something seem to be wrong, please reload the page ...';
      })
    } catch (error) {
      console.log(error);
      this.noData = true;
      this.displayedMsg = 'Something seem to be wrong, please reload the page ...';
    }
  }

  getAllColors() {
    this.busyLoading = true;
    try {
      this.favColorsService.getAll().then(snapshot => {
        let results = [];
        snapshot.docs.map(doc => {
          const data = doc.data() as FavColor;
          const id = doc.id;
          results.push({ id, ...data });
        })
        if(results) this.favColors = results[0];
        this.busyLoading = false;
      })
      .catch(err => {
        console.log(err);
        this.toastr.error('Somthing Went Wrong, Please reload the page');
        this.busyLoading = false;
      })
    } catch (error) {
      console.log(error);
        this.toastr.error('Somthing Went Wrong, Please reload the page');
        this.busyLoading = false;
    }
  }

  changeNoteBackground(note, color, noteIndex) {
    this.selectedFavColors[noteIndex] = color;
    this.renderer.setStyle(note, 'background-color', color);
    let brightness = tinycolor(color).getBrightness();
    if(brightness > 100) {
      this.renderer.setStyle(note, 'color', '#333');
    } else {
      this.renderer.setStyle(note, 'color', '#FFF');
    }
  }

  deleteNote(noteId, index) {
    this.busyDeleting = true;
    try {
      this.notesService.delete(noteId).then(res => {
        console.log(res);
        this.notes.splice(index,1);
        this.toastr.success('Note was deleted successfully');
        this.busyDeleting = false;
      })
      .catch(err => {
        console.log(err);
        this.toastr.error('Something went wrong, Please try again');
        this.busyDeleting = false;
      })
    } catch (error) {
      console.log(error);
      this.toastr.error('Something went wrong, Please try again');
      this.busyDeleting = false;
    }
  }

}
