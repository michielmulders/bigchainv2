import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthService } from "../_services/auth.service";
import { LocalStorageService } from './../_services/localstorage.service';
import { User } from "../_models/user.model";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
    myForm: FormGroup;
    isCompany: boolean= false;

    constructor(private authService: AuthService, private localStorageService: LocalStorageService) {}

    switchCompany(){
        this.isCompany = !this.isCompany;
    }


    onSubmit() {
        const user = new User(
            this.myForm.value.email,
            this.myForm.value.password,
            this.myForm.value.name,
            this.myForm.value.birth,
            this.isCompany
        );
        this.authService.signup(user)
            .subscribe(
                data => console.log(data),
                error => console.error(error)
            );
        this.myForm.reset();
        // Redirect: zie signin.component
    }

    ngOnInit() {
        this.localStorageService.clear();

        this.myForm = new FormGroup({
            name: new FormControl(null, Validators.required),
            birth: new FormControl(null, [
                // Validators.required,  -- required eraf moeten halen omdat het zelfde form is voor company/user
                Validators.pattern('[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}')
            ]),
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            password: new FormControl(null, Validators.required)
        });
    }
}