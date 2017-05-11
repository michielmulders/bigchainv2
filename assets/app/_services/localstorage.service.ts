import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorageService {
    constructor() {}

    // Return token for request if set, else return empty string
    getRequestToken() {
        return localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
    }

    // Return token if set, else return empty string
    getToken() {
        return localStorage.getItem('token')
            ? localStorage.getItem('token')
            : '';
    }

    setToken(token: string) {
        localStorage.setItem('token', token);
    }

    clear() {
        localStorage.clear();
    }
}