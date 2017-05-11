import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { RequestService } from "./request.service";

import getRequestHeader from "../_constants/headers";

@Injectable()
export class TestPersonService {
    constructor(private http: Http, private requestService: RequestService) {}

    // get tests for person 
    getTests() {
        return this.requestService.request("/testv/getTests");
    }
}