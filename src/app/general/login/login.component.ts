import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  busylogging: boolean = false;
  user: any = this.authService.isLoggedIn;

  constructor(public authService: AuthService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.authService.user$.subscribe(res => {
      if(res) {
        this.user = res;
      } else {
        this.user = null;
      }
    })
  }

  signInWithMail(mail, pass) {
    try {
      this.busylogging = true;
      this.authService.signInWithMail(mail, pass)
      .then((res) => {
        this.authService.user$.subscribe(res => {
          if(res) {
            this.busylogging = false;
            localStorage.setItem('appUser', JSON.stringify(res));
            this.router.navigate(['home']);
            this.toastr.success(`Welcome ${res.displayName}`);
          }
        })
      })
      .catch(err => {
        this.toastr.error(err);
        this.busylogging = false;        
      });
    } catch (error) {
      this.toastr.error(error);      
    }
  }

}
