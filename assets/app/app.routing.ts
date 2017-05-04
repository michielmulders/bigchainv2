import { Routes, RouterModule } from "@angular/router";

import { AuthenticationComponent } from "./auth/authentication.component";
import { CompanyComponent } from "./company/company.component";
import { AUTH_ROUTES } from "./auth/auth.routes";
import { COMPANY_ROUTES } from './company/company.routes';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/auth/signin', pathMatch: 'full' },
    { path: 'auth', component: AuthenticationComponent, children: AUTH_ROUTES },
    { path: 'company', component: CompanyComponent, children: COMPANY_ROUTES }
];

export const routing = RouterModule.forRoot(APP_ROUTES);