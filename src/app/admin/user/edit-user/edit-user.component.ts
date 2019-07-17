import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/shared/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PhotosService } from 'src/app/shared/services/photos.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  user: User;
  userId;
  busyLoading: boolean = false;
  busyUpdating: boolean = false;
  displayImg;

  @ViewChild('editUserFrom') editUserFrom: NgForm;

  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private photosService: PhotosService) { }

  ngOnInit() {
    this.userId = this.route.snapshot.params.id;
    if(this.userId) {
      this.getUserId();
    }
  }

  //get article by id
  getUserId() {
    try {
      this.authService.getById(this.userId).subscribe(res => {
        if(res) {
          this.user = res;
        } else {
          this.router.navigate(['/home']);
          this.toastr.error('Something went wrong please try again')
        }
      }, err => {
        this.toastr.error(err);
      })
    } catch (error) {
      this.toastr.error(error);      
    }
  }

  //get base64 for item photo
  onPostImageUpload($event) : void {
    this.readItemImage($event.target);
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

  updateUser() {
    if(!this.user.displayName.trim())
    return this.toastr.error('Please type valid name');

    if(!this.displayImg && !this.user.photoURL)
      return this.toastr.error('Image is required please add one');

    this.busyUpdating = true;
    try {
      if(this.displayImg) {
        this.photosService.uploadPhoto(`users/${this.userId}`, this.displayImg)
        .then(res => {
          return res.ref.getDownloadURL();
        })
        .then(url => {
          this.user.photoURL = url;
          return this.authService.updateUser(this.userId, this.user.displayName, this.user.photoURL)
        })
        .then(res => {
          this.busyUpdating = false;
          this.toastr.success('Your profile was successfully updated');
          this.router.navigate(['/admin/profile']);
        })
        .catch(err => {
          this.toastr.error(err);
          this.busyUpdating = false;
        })
      } else {
        this.authService.updateUser(this.userId, this.user.displayName, this.user.photoURL)
        .then(res => {
          this.busyUpdating = false;
          this.toastr.success('Your profile was successfully updated');
          this.router.navigate(['/admin/profile']);
        })
        .catch(err => {
          this.toastr.error(err);
          this.busyUpdating = false;
        })
      }
    }
    catch (err) {
      this.toastr.error(err.message);
      this.busyUpdating = false;
    }
  }

}
