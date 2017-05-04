import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Test } from "./test.model";
import getRequestHeader from "../constants/headers";

@Injectable()
export class CompanyService {
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
    searchPersons(name: string) {
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.get('http://localhost:3000/compv/searchPerson/' + name + token)
            .map((response: Response) => {
                const transactions = response.json().obj;
                console.log(transactions);
                /*let transformedMessages: Message[] = [];
                for (let message of messages) {
                    transformedMessages.push(new Message(
                        message.content,
                        message.user.firstName,
                        message._id,
                        message.user._id)
                    );
                }
                this.messages = transformedMessages;
                return transformedMessages;*/
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    searchPerson(name: string) {
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        var userObj = {
            name: name
        };
        const body = JSON.stringify(userObj);
        console.log(body);
        return this.http.post('http://localhost:3000/compv/searchPerson' + token, body, {headers: getRequestHeader("JSON")})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
}