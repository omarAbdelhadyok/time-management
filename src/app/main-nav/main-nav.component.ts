import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../shared/services';
import { User } from '../shared/models';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  isLoggedIn: boolean = this.authService.isLoggedIn;
  user: User;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
    public authService: AuthService) {

    this.authService.user$.subscribe(res => {
      if(res) {
        this.isLoggedIn = true;
        this.user = res;
      } else {
        this.isLoggedIn = false;
      }
    })
  }

  logOut() {
    this.authService.signOut().then(() => {
      window.location.reload()
      localStorage.removeItem('appUser');
    });
  }

}
