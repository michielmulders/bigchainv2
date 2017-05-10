import { Routes } from "@angular/router";

import { ListTestsComponent } from "./listtests.component";

export const TESTPERSON_ROUTES: Routes = [
    { path: '', redirectTo: 'listtests', pathMatch: 'full' },
    { path: 'listtests', component: ListTestsComponent }
];