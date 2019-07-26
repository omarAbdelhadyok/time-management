import { FavColorsComponent } from "./fav-colors.component";
import { ComponentFixture, async, TestBed, fakeAsync } from '@angular/core/testing';
import { FavColorsService } from 'src/app/shared/services';
import { MaterialImportsModule } from 'src/app/shared/modules';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NotesHeaderComponent } from '../notes-header/notes-header.component';

describe('fav-colors component', () => {
    let component: FavColorsComponent;
    let fixture: ComponentFixture<FavColorsComponent>;
    let service: FavColorsService;

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            declarations: [
                FavColorsComponent,
                NotesHeaderComponent
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
              FavColorsService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FavColorsComponent);
        component = fixture.componentInstance;
        service = TestBed.get(FavColorsService);
        fixture.detectChanges();
    });

    it('should send a request to the server to get all colors and render them to template if exist', () => {
        // service.user.uid = '123';
        const snapshot = {
            docs: [{
                id: '123',
                data: () => {
                    return {colors: ['red', 'blue'], uid: '123'}
                }
            }]
        }
        let spy = spyOn(service, 'getAll').and.returnValue(Promise.resolve(snapshot));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    });
});