import { LocalStorageService } from './../_services/localstorage.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
 
@Injectable()
export class CompanyGuard implements CanActivate {
 
    constructor(private router: Router, private localStorageService: LocalStorageService) { }
 
    // Determine if user can access APP_PATH/company/*
    canActivate() {
        if (this.localStorageService.getToken() != '' && localStorage.getItem('company')) {
            // logged in as company so return true
            return true;
        }
 
        // not logged in so redirect to login page
        this.router.navigate(['/auth', 'signin']);
        return false;
    }
}