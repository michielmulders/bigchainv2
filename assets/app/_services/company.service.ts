import { RequestService } from './request.service';
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Test } from "../_models/test.model";
import getRequestHeader from "../_constants/headers";

// Service for company related functions
@Injectable()
export class CompanyService {
    createTestUser: string; // Variable for passing selected user between components

    constructor(private http: Http, private requestService: RequestService) {}

    createTest(test: Test) {
        return this.requestService.request('/compv/createTest', JSON.stringify(test), "POST");
    }

    // OPTIONAL: Search params: http://stackoverflow.com/questions/38475869/angular-2-http-get-with-params
    // Return boolean if testperson can do test of specific type
    searchPersonType(name: string, type: string) {
        return this.requestService.request('/compv/searchPersonType/' + name + "/" + type);
    }

    // Get list of testpersons for search string (used in autocomplete)
    getAutoCompletePerson(searchString: string) {
        return this.requestService.request('/compv/autoCompletePerson/' + searchString);
    }
}