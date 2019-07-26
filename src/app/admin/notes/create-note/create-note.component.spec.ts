import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { NotesService, AuthService } from '../../../shared/services';
import { MaterialImportsModule } from '../../../shared/modules';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateNoteComponent } from './create-note.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';
import { User } from 'src/app/shared/models';
import { By } from '@angular/platform-browser';

class MatDialogMock {
  close() {}
}

describe('CreateNoteComponent', () => {
  const model = {note: {note: 'Test Note', date: 0, bgColor: 'red', txtColor: 'green'}};

  let component: CreateNoteComponent;
  let fixture: ComponentFixture<CreateNoteComponent>;
  let service: NotesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CreateNoteComponent
      ],
      imports: [
        MaterialImportsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase, 'my-app-name'),
        AngularFirestoreModule,
        AngularFireStorageModule,
        AngularFireAuthModule,
        BrowserAnimationsModule,
        FormsModule,
        ToastrModule.forRoot({
          positionClass: 'toast-bottom-right',
          preventDuplicates: false,
          newestOnTop: false,
          progressBar: false,
          closeButton: false
        })
      ],
      providers: [
        NotesService,
        AuthService,
        {provide: MatDialogRef, useClass: MatDialogMock},
        {provide: MAT_DIALOG_DATA, useValue: model},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNoteComponent);
    component = fixture.componentInstance;
    service = TestBed.get(NotesService);
    fixture.detectChanges();
  });

  it('should set component as edit if it receives data', () => {
    expect(component.isEdit).toBeTruthy();
    expect(component.pageTitle).toBe('Edit Note');
  });

  it('should render note.note and note.bachground to the template when loaded as edit note', () => {
    let deNote = fixture.debugElement.query(By.css('#noteTxt'));
    let deBg = fixture.debugElement.query(By.css('#noteBg'));

    let noteEl: MatInput = deNote.nativeElement;
    let bgEl: MatInput = deBg.nativeElement;

    fixture.whenRenderingDone().then(() => {
      expect(noteEl.value).toBe(model.note.note);
      expect(bgEl.value).toBe(model.note.bgColor);
    })
  })

  it('should save the edited task to the server and close the component', () => {
    let dialogRef = TestBed.get(MatDialogRef);
    
    let spy = spyOn(dialogRef, 'close');
    spyOn(service, 'update').and.returnValue(Promise.resolve(model.note));

    component.onSave();

    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
    })
  });

  it('should save the new note to the server and close the component', () => {
    const note = {note: 'Test Note', date: 0, bgColor: 'red', txtColor: 'green',};
    let dialogRef = TestBed.get(MatDialogRef);
    
    component.isEdit = false;
    component.note = note;
    component.user = new User();
    component.user.uid = '123';

    let spy = spyOn(dialogRef, 'close');
    spyOn(service, 'create').and.returnValue(Promise.resolve());

    component.onSave();

    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
    })
  })
});
