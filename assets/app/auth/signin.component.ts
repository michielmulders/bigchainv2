import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { User } from "../_models/user.model";
import { AuthService } from "../_services/auth.service";
import { LocalStorageService } from './../_services/localstorage.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html'
})
export class SigninComponent {
    myForm: FormGroup;

    constructor(private authService: AuthService, private router: Router, private localStorageService: LocalStorageService) {}

    onSubmit() {
        const user = new User(this.myForm.value.email, this.myForm.value.password);
        this.authService.signin(user)
            .subscribe(
                data => {
                    // Set token, userId and isCompany to localStorage
                    this.localStorageService.setToken(data.token);
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('company', data.company);

                    console.log("signin component");
                    console.log("\ncompdata : ", data.company);
                    // Navigate to /test or /comp based on user if he is a company
                    //(data.company) ? this.router.navigateByUrl('/company') : this.router.navigateByUrl('/test');

                    if(data.company) { 
                        console.log("\ncompany route");
                        this.router.navigateByUrl('/company') 
                    } else {
                        console.log("\ntest route");
                        this.router.navigateByUrl('/test');
                    }
                },
                error => console.error(error)
            );
        this.myForm.reset();
    }

    ngOnInit() {
        this.localStorageService.clear();

        this.myForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            password: new FormControl(null, Validators.required)
        });
    }
}