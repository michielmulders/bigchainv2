import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { RequestService } from './request.service';
import { LocalStorageService } from './localstorage.service';
import { User } from "../_models/user.model";
import getRequestHeader from "../_constants/headers";

/* Services related to authentication of users */
@Injectable()
export class AuthService {
    constructor(private http: Http, private requestService: RequestService, private localStorageService: LocalStorageService) {}

    signup(user: User) {
        return this.requestService.request('/user', JSON.stringify(user), "POST", false);
    }

    signin(user: User) {
        return this.requestService.request('/user/signin', JSON.stringify(user), "POST", false);
    }

    // Logout: Clear localStorage (token, userId, isCompany)
    logout(): void {
        this.localStorageService.clear();
    }

    // @Return boolean if user is logged in
    isLoggedIn(): boolean {
        return (this.localStorageService.getToken() !== '');
    }
}