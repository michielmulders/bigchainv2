import { RequestService } from './request.service';
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Test } from "../_models/test.model";
import getRequestHeader from "../_constants/headers";

@Injectable()
export class CompanyService {
    createTestUser: string;

    constructor(private http: Http, private requestService: RequestService) {}

    createTest(test: Test) {
        return this.requestService.request('/compv/createTest', JSON.stringify(test), "POST");
    }

    // Search params: http://stackoverflow.com/questions/38475869/angular-2-http-get-with-params
    searchPersonType(name: string, type: string) {
        return this.requestService.request('/compv/searchPersonType/' + name + "/" + type);
    }

    getAutoCompletePerson(searchString: string) {
        return this.requestService.request('/compv/autoCompletePerson/' + searchString);
    }
}