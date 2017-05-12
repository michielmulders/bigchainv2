import { Injectable } from "@angular/core";

// Service for localStorage related functions
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

    // Set new token for user which has logged in
    setToken(token: string) {
        localStorage.setItem('token', token);
    }

    // Clear localstorage
    clear() {
        localStorage.clear();
    }
}