import { LocalStorageService } from './../_services/localstorage.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
 
@Injectable()
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router, private localStorageService: LocalStorageService) { }
 
    // Determine if user can access APP_PATH/auth/*
    canActivate() {
        if (this.localStorageService.getToken() == '') {
            // not logged in so return true
            return true;
        }
 
        // logged in so return false, logout and redirect to signin page
        this.localStorageService.clear();
        this.router.navigate(['/auth', 'signin']);
        return false;
    }
}