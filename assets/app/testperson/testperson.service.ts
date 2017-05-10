import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import getRequestHeader from "../constants/headers";

@Injectable()
export class TestPersonService {
    constructor(private http: Http) {}

    // get tests for person 
    getTests() {
        console.log("testperson.service.ts");
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        console.log("token: ", token);
        return this.http.get('http://localhost:3000/testv/getTests' + token, {headers: getRequestHeader("JSON")})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error));
    }
}