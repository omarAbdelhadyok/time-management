import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  busylogging: boolean = false;
  // get isLoggedIn(): boolean {
  //   this.authService.isLoggedIn();
  // }

  constructor(public auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    // console.log(this.authService.isLoggedIn().then(res => console.log(res)))
  }

  // login(mail, pass) {
    // try {
    //   this.busylogging = true;
    //   this.authService.login(mail, pass)
    //   .then((res) => {
    //     this.busylogging = false;
    //     localStorage.setItem('user', JSON.stringify(res.user));
    //     this.router.navigate(['home']);
    //     this.notifier.notify('success', `Welcome ${res.user.displayName}`);
    //   })
    //   .catch(err => {
    //     this.notifier.notify('error', err);
    //     this.busylogging = false;        
    //   });
    // } catch (error) {
    //   this.notifier.notify('error', error);      
    // }
  // }

}
