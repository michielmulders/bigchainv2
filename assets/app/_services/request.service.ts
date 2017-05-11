import { Http, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { LocalStorageService } from './localstorage.service';
import getRequestHeader from "../_constants/headers";
import getEnvs from "../_constants/env";

@Injectable()
export class RequestService {

    constructor(private http: Http, private localStorageService: LocalStorageService) {}

    request(url: string, postData?: any, method: string = "GET", tokenFlag: boolean = true) {
        let HEADER_CONFIG = {headers: getRequestHeader("JSON")};

        if(method === "GET") {
            return this.http.get(getEnvs()["APP_PATH"] + url + this.localStorageService.getRequestToken(), HEADER_CONFIG)
                .map((response: Response) => response.json())
                .catch((error: Response) => Observable.throw(error));
        }

        if(method === "POST") {
            let postUrl: string;
            (!tokenFlag) ? postUrl = url : postUrl = url + this.localStorageService.getRequestToken();
            return this.http.post(getEnvs()["APP_PATH"] + postUrl, postData, HEADER_CONFIG)
                .map((response: Response) => response.json())
                .catch((error: Response) => Observable.throw(error));
        }
    }
}