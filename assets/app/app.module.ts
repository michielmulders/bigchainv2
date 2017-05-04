import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { routing } from "./app.routing";

import { AppComponent } from "./app.component";
import { AuthenticationComponent } from "./auth/authentication.component";
import { SearchPersonComponent } from './company/searchperson.component';
import { CreateTestComponent } from './company/createtest.component';
import { CompanyComponent } from './company/company.component';
import { LogoutComponent } from "./auth/logout.component";
import { SignupComponent } from "./auth/signup.component";
import { SigninComponent } from "./auth/signin.component";

import { AuthService } from "./auth/auth.service";
import { CompanyService } from './company/company.service';

@NgModule({
    declarations: [
        AppComponent,
        AuthenticationComponent,
        LogoutComponent,
        SignupComponent,
        SigninComponent,
        CompanyComponent,
        CreateTestComponent,
        SearchPersonComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        ReactiveFormsModule,
        HttpModule
    ],
    providers: [AuthService, CompanyService],
    bootstrap: [AppComponent]
})
export class AppModule {

}