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

import { TestPersonService } from './_services/testperson.service';
import { CompanyService } from './_services/company.service';
import { AuthService } from './_services/auth.service';
import { LocalStorageService } from './_services/localstorage.service';
import { RequestService } from './_services/request.service';

import { TestGuard } from './_guards/test.guard';
import { CompanyGuard } from './_guards/company.guard';

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
    providers: [AuthService, CompanyService, TestPersonService, RequestService, LocalStorageService, CompanyGuard, TestGuard],
    bootstrap: [AppComponent]
})
export class AppModule {

}