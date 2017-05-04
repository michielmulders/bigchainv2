import { Headers } from "@angular/http";

export default function getRequestHeader(TYPE: string) {
    let header = '';

    switch(TYPE) {
        case "JSON": 
            header = "application/json";
            break;
        case "HTML":
            header = "text/html";
            break;
        case "TEXT":
            header = "text/plain";
            break;
        default: 
            header = "application/json";
            break;
    }

    return new Headers({'Content-Type': header});
}