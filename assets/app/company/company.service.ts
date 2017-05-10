import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Test } from "./test.model";
import getRequestHeader from "../constants/headers";

@Injectable()
export class CompanyService {
    createTestUser: string;

    constructor(private http: Http) {}

    createTest(test: Test) {
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        const body = JSON.stringify(test);
        return this.http.post('http://localhost:3000/compv/createTest' + token, body, {headers: getRequestHeader("JSON")})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    // Search params: http://stackoverflow.com/questions/38475869/angular-2-http-get-with-params
    searchPersonType(name: string, type: string) {
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.get('http://localhost:3000/compv/searchPersonType/' + name + "/" + type + token, {headers: getRequestHeader("JSON")})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error));
    }

    getAutoCompletePerson(searchString: string) {
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        
        return this.http.get('http://localhost:3000/compv/autoCompletePerson/' + searchString + token, {headers: getRequestHeader("JSON")})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error));
    }
}