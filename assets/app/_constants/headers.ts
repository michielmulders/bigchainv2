import { Headers } from "@angular/http";

// Contains switch to return right Content-Type header 
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