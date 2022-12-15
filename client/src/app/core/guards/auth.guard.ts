import { AuthService } from 'src/app/auth/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){

  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean| UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const {guest} = route.data;
    const token = localStorage.getItem('token');
    if (!token && guest == true) {
      return true;
    }else if(token && guest == false){
      return true;
    }
    return this.router.parseUrl('/error')
  }
  
}
