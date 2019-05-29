import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { environment } from 'src/environments/environment';

import { MainNavComponent } from './main-nav/main-nav.component';
import { HomeComponent } from './general/home/home.component';
import { MaterialImportsModule } from './shared/modules/material-imports.module';
import { LoginComponent } from './general/login/login.component';
import { NotFoundComponent } from './general/not-found/not-found.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './general/register/register.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    HomeComponent,
    LoginComponent,
    NotFoundComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialImportsModule,
    FormsModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase, 'my-app-name'),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
      newestOnTop: false,
      progressBar: false,
      closeButton: false
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
