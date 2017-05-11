import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { RequestService } from './request.service';
import { LocalStorageService } from './localstorage.service';
import { User } from "../_models/user.model";
import getRequestHeader from "../_constants/headers";

@Injectable()
export class AuthService {
    constructor(private http: Http, private requestService: RequestService, private localStorageService: LocalStorageService) {}

    signup(user: User) {
        return this.requestService.request('/user', JSON.stringify(user), "POST", false);
    }

    signin(user: User) {
        return this.requestService.request('/user/signin', JSON.stringify(user), "POST", false);
    }

    logout() {
        this.localStorageService.clear();
    }

    isLoggedIn() {
        return this.localStorageService.getToken() !== null;
    }
}