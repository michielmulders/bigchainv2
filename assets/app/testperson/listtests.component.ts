import { TestPersonService } from '../_services/testperson.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-list-tests',
    templateUrl: './listtests.component.html',
    styles: [`
        .card {
            border: 1px solid black;
            border-radius: 5px;
            margin-bottom:10px;
            padding: 0px 10px 0px 10px;
        }
    `]
})
export class ListTestsComponent implements OnInit {
    outputs = [];
    constructor(private testPersonService: TestPersonService) { }

    ngOnInit() {
        this.testPersonService.getTests()
        .subscribe(
            data => this.outputs = data,
            error => console.error(error)
        );
    }
}