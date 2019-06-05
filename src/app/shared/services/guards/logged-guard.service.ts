import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root'
})
export class loggedInGuard implements CanActivate {
    isLoggedIn = this.authService.isLoggedIn;
    constructor(private authService: AuthService,
        private router: Router){}
    
    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if(this.isLoggedIn) {
            return true
        } else {
            this.router.navigate(['/home']);
        }
        
    }

}
