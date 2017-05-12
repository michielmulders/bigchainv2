import { Http, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { LocalStorageService } from './localstorage.service';
import getRequestHeader from "../_constants/headers";
import getEnvs from "../_constants/env";

// Service for creating requests to backend
@Injectable()
export class RequestService {

    constructor(private http: Http, private localStorageService: LocalStorageService) {}

    /* Send request to backend
    * @url: request path (e.g. /auth/login)
    * @postData: optional param, data for post request 
    * @method: POST or GET, default GET 
    * @tokenFlag: if token flag false -> don't add token to request 
    */
    request(url: string, postData?: any, method: string = "GET", tokenFlag: boolean = true) {
        // Create Header JSON Object for Reqest
        let HEADER_CONFIG = {headers: getRequestHeader("JSON")};

        // Create GET Request
        if(method === "GET") {
            // http.get @param1: Get application path from Ng2 Env + add @url request path + add user token
            // http.get @param2: JSON Header
            return this.http.get(getEnvs()["APP_PATH"] + url + this.localStorageService.getRequestToken(), HEADER_CONFIG)
                .map((response: Response) => response.json())
                .catch((error: Response) => Observable.throw(error));
        }

        // Create POST Request
        if(method === "POST") {
            let postUrl: string;
            // if flag false -> don't add token else do add token
            (!tokenFlag) ? postUrl = url : postUrl = url + this.localStorageService.getRequestToken();

            // http.post @param1: Get application path from Ng2 Env + postUrl (with or without token)
            // http.post @param2: JSOn stringified data for post request 
            // http.post @param3: JSON Header
            return this.http.post(getEnvs()["APP_PATH"] + postUrl, postData, HEADER_CONFIG)
                .map((response: Response) => response.json())
                .catch((error: Response) => Observable.throw(error));
        }
    }
}