import { Router } from '@angular/router';
import { AuthService } from './../_services/auth.service';
import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styles: [`
        div {
            height: 100px;
        }

        button {
            position: absolute; 
            bottom: 0; 
            right: 0;
            margin-right: 15px;
        }
    `]
})
// Component adds footer to all pages if logged in for easy logging out
export class FooterComponent {
    constructor(private authService: AuthService, private router: Router) { }

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/auth', 'signin']);
    }
}