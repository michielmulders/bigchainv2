import { AutoCompletePerson } from './company/autocompleteperson.component';
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
import { TestPersonComponent } from './testperson/testperson.component';
import { ListTestsComponent } from './testperson/listtests.component';

import { AuthService } from "./auth/auth.service";
import { CompanyService } from './company/company.service';
import { TestPersonService } from './testperson/testperson.service';

@NgModule({
    declarations: [
        AppComponent,
        AuthenticationComponent,
        LogoutComponent,
        SignupComponent,
        SigninComponent,
        CompanyComponent,
        CreateTestComponent,
        SearchPersonComponent,
        TestPersonComponent,
        ListTestsComponent,
        AutoCompletePerson
    ],
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        ReactiveFormsModule,
        HttpModule
    ],
    providers: [AuthService, CompanyService, TestPersonService],
    bootstrap: [AppComponent]
})
export class AppModule {

}