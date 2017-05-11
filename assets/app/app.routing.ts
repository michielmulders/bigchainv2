import { TestGuard } from './_guards/test.guard';
import { CompanyGuard } from './_guards/company.guard';

import { Routes, RouterModule } from "@angular/router";

import { TestPersonComponent } from './testperson/testperson.component';
import { AuthenticationComponent } from "./auth/authentication.component";
import { CompanyComponent } from "./company/company.component";

import { AUTH_ROUTES } from "./auth/auth.routes";
import { COMPANY_ROUTES } from './company/company.routes';
import { TESTPERSON_ROUTES } from './testperson/testperson.routes';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/auth/signin', pathMatch: 'full' },
    { path: 'auth', component: AuthenticationComponent, children: AUTH_ROUTES },
    { path: 'company', component: CompanyComponent, children: COMPANY_ROUTES, canActivate: [CompanyGuard] },
    { path: 'test', component: TestPersonComponent, children: TESTPERSON_ROUTES, canActivate: [TestGuard] }
];

export const routing = RouterModule.forRoot(APP_ROUTES);