import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PhotosService } from 'src/app/shared/services/photos.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user = new User();
  busylogging = false;
  hide = true;
  displayImg;
  loggedUser: any = this.authService.isLoggedIn;

  constructor(private authService: AuthService,
    private photosService: PhotosService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.authService.user$.subscribe(res => {
      if(res) {
        this.loggedUser = res;
      } else {
        this.loggedUser = null;
      }
    })
  }

  //get base64 for item photo
  onPostImageUpload($event) : void {
    this.readItemImage($event.target);
    this.user.photoURL = $event.target.files[0];
  }

  //get base64 for item photo
  readItemImage(inputValue: any): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.displayImg = myReader.result;
    }
    myReader.readAsDataURL(file);
  }

  register() {
    if(!this.user.photoURL) return this.toastr.error('Image is required please add one');
    try {
      this.busylogging = true;
      let user: User;
      this.authService.registerWithEmail(this.user.email, this.user.password)
      .then(res => {
        if(res.user) {
          user = {
            uid: res.user.uid,
            email: res.user.email,
            displayName: this.user.displayName
          }
          return this.photosService.uploadPhoto(`users/${user.uid}`, this.user.photoURL)
        }
      }).then(res => {
        return res.ref.getDownloadURL();
      }).then(url => {
        user.photoURL = url;
        return this.authService.updateUserData(user);
      }).then(() => {
        this.router.navigate(['/']);
        this.busylogging = false;
      }).catch(error => {
        this.busylogging = false;
        console.log(error);
      });
    } catch (error) {
      this.busylogging = false;
      console.log(error);
    }
  }

}
