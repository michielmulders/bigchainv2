import { CompanyService } from './company.service';
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Test } from './test.model';

@Component({
    selector: 'app-create-test',
    templateUrl: 'createtest.component.html'
})
export class CreateTestComponent implements OnInit {
    myForm: FormGroup;
    personName = '';
    
    constructor(private companyService: CompanyService) {}

    onSubmit() {
        const test = new Test(
            this.myForm.value.name,
            this.myForm.value.date,
            this.myForm.value.type,
            this.myForm.value.remark || ""
        );

        console.log(test);

        this.companyService.createTest(test)
            .subscribe(
                data => console.log(data),
                error => console.error(error)
            );
        this.myForm.reset();
    }

    onKeypress() {
        console.log(this.personName);
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            name: new FormControl(null, Validators.required),
            date: new FormControl(null, [
                Validators.pattern('[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}'),
                Validators.required
            ]),
            type: new FormControl(null, Validators.required),
            remark: new FormControl(null, null)
        });
    }
}
