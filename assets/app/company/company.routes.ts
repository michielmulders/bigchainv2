import { SearchPersonComponent } from './searchperson.component';
import { Routes } from "@angular/router";

import { CreateTestComponent } from "./createtest.component";

export const COMPANY_ROUTES: Routes = [
    { path: '', redirectTo: 'createtest', pathMatch: 'full' },
    { path: 'createtest', component: CreateTestComponent },
    { path: 'searchperson', component: SearchPersonComponent }
];