import { AuthService } from './_services/auth.service';
import { LocalStorageService } from './_services/localstorage.service';
import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
    constructor(private authService: AuthService) {}

    // Function used for determining if footer is showed
    isLoggedIn() {
        return this.authService.isLoggedIn();
    }
}